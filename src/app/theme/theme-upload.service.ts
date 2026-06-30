import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';

import {
  UploadSlot,
  detectSlotFromRaw,
  normalizeUploaded,
  sanitizeUploadedCss,
} from './css-import-normalize';
import { ThemeService, type MdsThemeMode } from './theme.service';
import { MDS_OVERLAY_OVERRIDE_STYLE_ID } from './overlay-mds-overrides';
import {
  MDS_RUNTIME_BRIDGE_STYLE_ID,
  MDS_TABS_OVERRIDE_STYLE_ID,
  MDS_SPLITBUTTON_OVERRIDE_STYLE_ID,
  syncPrimeUixPalettesFromMds,
} from './theme-prime-sync';
import { MDS_TOGGLESWITCH_OVERRIDE_STYLE_ID } from './toggleswitch-mds-overrides';
import { MDS_BUTTON_OVERRIDE_STYLE_ID } from './button-mds-overrides';
import type { LoadedSlotFile, LoadedSlotsMap } from './theme.types';

const SLOT_STYLE_ID: Record<UploadSlot, string> = {
  primitives: 'user-primitives',
  'semantic-light': 'user-semantic-light',
  'semantic-dark': 'user-semantic-dark',
  components: 'user-components',
};

const SLOT_LABEL: Record<UploadSlot, string> = {
  primitives: 'Primitives',
  'semantic-light': 'Semantic Light',
  'semantic-dark': 'Semantic Dark',
  components: 'Components',
};

const USER_STYLE_ORDER: string[] = [
  'user-primitives',
  'user-semantic-light',
  'user-semantic-dark',
  'user-components',
];

/** Orden legacy: upload core → auto-contraste → puente --p-* (después del tema PrimeNG). */
const POST_PRIME_STYLE_ORDER: string[] = [
  ...USER_STYLE_ORDER,
  'auto-contrast',
  MDS_RUNTIME_BRIDGE_STYLE_ID,
  MDS_OVERLAY_OVERRIDE_STYLE_ID,
  MDS_TABS_OVERRIDE_STYLE_ID,
  MDS_TOGGLESWITCH_OVERRIDE_STYLE_ID,
  MDS_BUTTON_OVERRIDE_STYLE_ID,
  MDS_SPLITBUTTON_OVERRIDE_STYLE_ID,
];

/** Tokens MDS (no los --p-* generados por PrimeNG, que pisan el upload). */
const WATCH_TOKENS = [
  { name: '--primary-color', label: 'primary' },
  { name: '--primary-50', label: 'primary-50' },
  { name: '--primary-900', label: 'primary-900' },
  { name: '--button-primary-background', label: 'btn-fill-bg' },
  { name: '--button-text-secondary-color', label: 'btn-text-sec' },
  { name: '--button-outlined-danger-color', label: 'btn-out-danger' },
  { name: '--p-font-family', label: 'font' },
] as const;

const PRIMARY_STRIP = [
  { key: '--primary-50', step: '50' },
  { key: '--primary-100', step: '100' },
  { key: '--primary-200', step: '200' },
  { key: '--primary-300', step: '300' },
  { key: '--primary-400', step: '400' },
  { key: '--primary-500', step: '500' },
  { key: '--primary-600', step: '600' },
  { key: '--primary-700', step: '700' },
  { key: '--primary-800', step: '800' },
  { key: '--primary-900', step: '900' },
  { key: '--primary-950', step: '950' },
  { key: '--primary-color', step: 'Base' },
] as const;

export type TokenRow = { label: string; display: string; isFont: boolean; swatchCss: string };
export type SwatchRow = { step: string; hex: string; isDark: boolean; cssVar: string };

@Injectable({ providedIn: 'root' })
export class ThemeUploadService {
  private readonly doc = inject(DOCUMENT);
  private readonly theme = inject(ThemeService);
  private readonly messages = inject(MessageService);

  readonly loadedSlots = signal<LoadedSlotsMap>({});
  readonly uploadWarning = signal<string | null>(null);
  readonly tokenRows = signal<TokenRow[]>([]);
  readonly colorSwatches = signal<SwatchRow[]>([]);
  readonly inspectorTick = signal(0);

  constructor() {
    this.ensureStyleElements();
    this.refreshInspector();
  }

  get hasUploadedFiles(): boolean {
    return Object.keys(this.loadedSlots()).length > 0;
  }

  get loadedEntries(): { slot: UploadSlot; fileName: string }[] {
    return (Object.entries(this.loadedSlots()) as [UploadSlot, LoadedSlotFile][])
      .map(([slot, v]) => ({ slot, fileName: v.fileName }))
      .sort((a, b) => a.slot.localeCompare(b.slot));
  }

  async processFiles(fileList: FileList | File[]): Promise<void> {
    const files = Array.from(fileList).filter((f) => f.name.endsWith('.css'));
    if (!files.length) {
      this.toast('Only .css files are accepted', 'error');
      return;
    }

    const sorted = [...files].sort((a, b) => a.name.localeCompare(b.name, 'es'));
    const bySlot: Partial<Record<UploadSlot, { fileName: string; css: string }>> = {};

    for (const file of sorted) {
      const text = sanitizeUploadedCss(await file.text());
      const norm = normalizeUploaded(text);
      if (norm.ok && norm.injects.length) {
        for (const inj of norm.injects) {
          bySlot[inj.slot] = { fileName: file.name, css: inj.css };
        }
      } else {
        const slot = detectSlotFromRaw(text);
        bySlot[slot] = { fileName: file.name, css: text };
      }
    }

    const merged: LoadedSlotsMap = { ...this.loadedSlots(), ...this.mapToLoaded(bySlot) };
    const hasPrim = !!merged['primitives'];
    const hasSem = !!merged['semantic-light'] || !!merged['semantic-dark'];

    if (!hasPrim || !hasSem) {
      if (!hasPrim && !hasSem) {
        this.toast(
          'Upload not allowed: missing primitives and semantic (light or dark). Both are required.',
          'error'
        );
      } else if (!hasPrim) {
        this.toast('Upload not allowed: missing primitives file (required).', 'error');
      } else {
        this.toast(
          'Upload not allowed: missing light or dark semantic (at least one is required).',
          'error'
        );
      }
      return;
    }

    for (const [slot, payload] of Object.entries(bySlot) as [UploadSlot, { fileName: string; css: string }][]) {
      this.injectSlot(slot, payload.css);
      merged[slot] = { fileName: payload.fileName };
    }

    this.loadedSlots.set(merged);
    this.ensureUserStylesAfterPrimeTheme();
    this.resyncThemeRuntime();
    this.validateSlots();
    this.theme.syncToggleFromSlots(merged);
    const labels = Object.keys(bySlot)
      .sort()
      .map((s) => SLOT_LABEL[s as UploadSlot]);
    this.toast(
      labels.length ? `✓ ${labels.join(' · ')} — ${sorted.length} file(s)` : `✓ ${sorted.length} file(s)`,
      'success'
    );
    setTimeout(() => this.refreshInspector(), 120);
  }

  removeAll(): void {
    (Object.keys(SLOT_STYLE_ID) as UploadSlot[]).forEach((slot) => this.injectSlot(slot, ''));
    this.loadedSlots.set({});
    this.ensureUserStylesAfterPrimeTheme();
    this.uploadWarning.set(null);
    this.theme.syncToggleFromSlots({});
    this.refreshInspector();
    this.toast('Files removed — default tokens restored', 'info');
  }

  /** Re-sincroniza PrimeNG + overrides MDS tras cambiar light/dark (sin recalcular inspector). */
  resyncThemeRuntime(): void {
    this.syncPrimeThemeRuntime();
  }

  refreshInspector(): void {
    this.inspectorTick.update((n) => n + 1);
    this.tokenRows.set(
      WATCH_TOKENS.map((t) => {
        const val = this.getCssVar(t.name);
        const isFont = t.name === '--p-font-family';
        let display: string;
        if (isFont) {
          display = val.split(',')[0]?.replace(/['"]/g, '').trim() || '—';
        } else {
          const hex = this.rgbToHex(this.resolveColor(t.name));
          display = hex ? `#${hex}` : val || '—';
        }
        return {
          label: t.label,
          display,
          isFont,
          swatchCss: isFont ? '' : `var(${t.name})`,
        };
      })
    );
    this.colorSwatches.set(
      PRIMARY_STRIP.map((s) => {
        const rgb = this.resolveColor(s.key);
        const hex = this.rgbToHex(rgb);
        return {
          step: s.step,
          hex: hex ? `#${hex}` : '—',
          isDark: this.isDarkColor(rgb),
          cssVar: s.key,
        };
      })
    );
    this.autoContrastPrimary();
    this.syncPrimeThemeRuntime();
  }

  private mapToLoaded(
    bySlot: Partial<Record<UploadSlot, { fileName: string; css: string }>>
  ): Partial<Record<UploadSlot, LoadedSlotFile>> {
    const out: Partial<Record<UploadSlot, LoadedSlotFile>> = {};
    for (const [slot, p] of Object.entries(bySlot) as [UploadSlot, { fileName: string; css: string }][]) {
      out[slot] = { fileName: p.fileName };
    }
    return out;
  }

  private validateSlots(): void {
    const slots = this.loadedSlots();
    const hasAny = Object.keys(slots).length > 0;
    if (!hasAny) {
      this.uploadWarning.set(null);
      return;
    }
    const hasPrim = !!slots['primitives'];
    const hasSem = !!slots['semantic-light'] || !!slots['semantic-dark'];
    if (!hasPrim) {
      this.uploadWarning.set(
        'Missing primitives file (required). Also add at least one semantic file (light and/or dark). Components are optional.'
      );
    } else if (!hasSem) {
      this.uploadWarning.set(
        'Missing semantic files: upload at least light or dark (required). The components file is optional.'
      );
    } else {
      this.uploadWarning.set(null);
    }
  }

  private injectSlot(slot: UploadSlot, css: string): void {
    const el = this.doc.getElementById(SLOT_STYLE_ID[slot]);
    if (el) el.textContent = String(css || '').trim();
  }

  private ensureStyleElements(): void {
    const ids = POST_PRIME_STYLE_ORDER;
    for (const id of ids) {
      let el = this.doc.getElementById(id);
      if (!el) {
        el = this.doc.createElement('style');
        el.id = id;
      }
      if (el.parentNode !== this.doc.head) {
        this.doc.head.appendChild(el);
      }
    }
  }

  /**
   * PrimeNG inyecta su tema después del build y fija --p-primary-* con el preset Aura.
   * Tras subir MDS, sincronizamos el preset runtime y recolocamos el CSS de usuario al final.
   */
  private syncPrimeThemeRuntime(): void {
    syncPrimeUixPalettesFromMds((varName) => this.resolveColor(varName), (id, css) =>
      this.injectStyleBlock(id, css)
    );
    requestAnimationFrame(() => this.ensureUserStylesAfterPrimeTheme());
  }

  private injectStyleBlock(id: string, css: string): void {
    let el = this.doc.getElementById(id);
    if (!el) {
      el = this.doc.createElement('style');
      el.id = id;
      this.doc.head.appendChild(el);
    } else if (el.parentNode !== this.doc.head) {
      this.doc.head.appendChild(el);
    }
    el.textContent = css;
  }

  private ensureUserStylesAfterPrimeTheme(): void {
    const ours = new Set(POST_PRIME_STYLE_ORDER);
    const headStyles = Array.from(this.doc.head.querySelectorAll('style'));
    let lastPrime: HTMLStyleElement | null = null;
    for (const s of headStyles) {
      if (!s.id || !ours.has(s.id)) lastPrime = s;
    }
    let anchor: Element | null = lastPrime;
    for (const id of POST_PRIME_STYLE_ORDER) {
      const el = this.doc.getElementById(id);
      if (!el) continue;
      if (anchor?.parentNode) {
        anchor.parentNode.insertBefore(el, anchor.nextSibling);
        anchor = el;
      } else if (el.parentNode !== this.doc.head) {
        this.doc.head.appendChild(el);
        anchor = el;
      }
    }
  }

  private autoContrastPrimary(): void {
    const html = this.doc.documentElement;
    const current = (html.getAttribute('data-theme') || 'light') as MdsThemeMode;

    const buildRule = (theme: MdsThemeMode): string => {
      html.setAttribute('data-theme', theme);
      const rgb = this.resolveColor('--primary-color');
      const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
      if (!m) return '';
      const lum = (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255;
      const text = lum > 0.55 ? '#111111' : '#ffffff';
      const ring = text === '#ffffff' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.35)';
      return `html[data-theme="${theme}"] {
        --p-primary-color-text: ${text};
        --button-primary-color: ${text};
        --button-primary-hover-color: ${text};
        --button-primary-active-color: ${text};
        --p-button-primary-color: ${text};
        --p-button-primary-hover-color: ${text};
        --p-button-primary-active-color: ${text};
        --button-primary-focus-ring-color: ${ring};
      }`;
    };

    const lightRule = buildRule('light');
    const darkRule = buildRule('dark');
    html.setAttribute('data-theme', current);

    const el = this.doc.getElementById('auto-contrast');
    if (el) el.textContent = `${lightRule}\n${darkRule}`;
  }

  private getCssVar(name: string): string {
    return getComputedStyle(this.doc.documentElement).getPropertyValue(name).trim();
  }

  private resolveColor(key: string): string {
    const el = this.doc.createElement('div');
    el.style.cssText = `position:absolute;opacity:0;pointer-events:none;background:var(${key})`;
    this.doc.body.appendChild(el);
    const rgb = getComputedStyle(el).backgroundColor;
    el.remove();
    return rgb;
  }

  private rgbToHex(rgb: string): string {
    const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (!m) return '';
    return [m[1], m[2], m[3]].map((n) => parseInt(n, 10).toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  private isDarkColor(rgb: string): boolean {
    const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (!m) return false;
    return (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 < 0.5;
  }

  private toast(detail: string, severity: 'success' | 'info' | 'warn' | 'error'): void {
    this.messages.add({ severity, summary: severity === 'error' ? 'Error' : 'MDS', detail, life: 4000 });
  }
}
