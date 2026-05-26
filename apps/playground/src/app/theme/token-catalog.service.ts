import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

import type { UploadSlot } from './css-import-normalize';
import { MDS_VARS_CATALOG } from './mds-vars-catalog.generated';
import type {
  CatalogSection,
  CatalogToken,
  MdsVarEntry,
  PrimaryReplacement,
  ResolvedMap,
  ResolvedTokenColor,
  SectionView,
  TokenMaps,
  TokenRowView,
} from './token-catalog.types';
import {
  buildTokenMapsFromSections,
  detectPrimaryPaletteReplacement,
  groupByComponent,
  groupByPalette,
  highlightParts,
  inferTokenType,
  isDarkColor,
  mergeUploadedVars,
  primaryReplacementLabel,
  replaceTealRefs,
  rgbToHex,
} from './token-catalog.utils';
import { ThemeService, type MdsThemeMode } from './theme.service';
import { ThemeUploadService } from './theme-upload.service';

const SLOT_STYLE_ID: Record<UploadSlot, string> = {
  primitives: 'user-primitives',
  'semantic-light': 'user-semantic-light',
  'semantic-dark': 'user-semantic-dark',
  components: 'user-components',
};

@Injectable({ providedIn: 'root' })
export class TokenCatalogService {
  private readonly doc = inject(DOCUMENT);
  private readonly theme = inject(ThemeService);
  private readonly upload = inject(ThemeUploadService);

  readonly searchQuery = signal('');
  readonly mapMode = signal(false);

  private readonly catalogRevision = computed(() => ({
    mode: this.theme.mode(),
    slots: this.upload.loadedSlots(),
    tick: this.upload.inspectorTick(),
  }));

  readonly primaryReplacementBadge = computed(() => {
    this.catalogRevision();
    const rep = this.detectReplacement();
    return primaryReplacementLabel(rep);
  });

  readonly sections = computed(() => {
    this.catalogRevision();
    return this.buildSections();
  });

  readonly tokenMaps = computed((): TokenMaps => buildTokenMapsFromSections(this.sections()));

  readonly listView = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const sections = this.sections();
    const maps = this.tokenMaps();
    let total = 0;
    let openCount = 0;
    const sectionViews: SectionView[] = [];

    for (const sec of sections) {
      const filteredSubs = sec.subGroups
        .map((sg) => ({
          ...sg,
          tokens: sg.tokens.filter(
            (t) => !q || t.name.toLowerCase().includes(q) || t.label.toLowerCase().includes(q)
          ),
        }))
        .filter((sg) => sg.tokens.length);

      if (!filteredSubs.length) continue;

      const secTotal = filteredSubs.reduce((a, sg) => a + sg.tokens.length, 0);
      total += secTotal;
      const isOpen = openCount === 0 || !!q;
      openCount++;

      const subGroups = filteredSubs.map((sg) => {
        const themeCtx = sg.theme ?? this.theme.mode();
        const resolved = this.batchResolve(sg.tokens, themeCtx);
        return {
          subGroup: sg,
          rows: sg.tokens.map((t) => this.buildRow(t, sec, q, resolved, maps)),
        };
      });

      sectionViews.push({ section: sec, subGroups, total: secTotal, open: isOpen });
    }

    return { sections: sectionViews, total };
  });

  setSearchQuery(value: string): void {
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  setMapMode(on: boolean): void {
    this.mapMode.set(on);
  }

  private buildSections(): CatalogSection[] {
    const hasAny = Object.keys(this.upload.loadedSlots()).length > 0;
    return hasAny ? this.buildSectionsFromSlots() : this.buildSectionsFromCatalog();
  }

  private buildSectionsFromCatalog(): CatalogSection[] {
    const { prim, light, dark, comp } = this.readCoreVars();
    const sections: CatalogSection[] = [];
    const isDark = this.theme.mode() === 'dark';

    const primSubs = groupByPalette(prim);
    if (primSubs.length) {
      sections.push({ id: 'primitivos', label: 'Primitivos', cls: 'tva-prim', subGroups: primSubs });
    }

    const semSubs: CatalogSection['subGroups'] = [];
    const activeSemData = isDark ? dark : light;
    if (activeSemData.length) {
      const mode: MdsThemeMode = isDark ? 'dark' : 'light';
      const tokens: CatalogToken[] = activeSemData.map(({ name, value }) => ({
        name,
        label: name.replace(/^--/, ''),
        type: inferTokenType(value),
        value,
      }));
      semSubs.push({
        label: isDark ? 'Dark' : 'Light',
        mode,
        theme: mode,
        tokens,
      });
    }
    if (semSubs.length) {
      sections.push({
        id: 'semanticos',
        label: isDark ? 'Semánticos - Dark' : 'Semánticos - Light',
        cls: 'tva-sem',
        subGroups: semSubs,
      });
    }

    const compSubs = groupByComponent(comp);
    if (compSubs.length) {
      sections.push({ id: 'componentes', label: 'Componentes', cls: 'tva-comp', subGroups: compSubs });
    }

    return sections;
  }

  private buildSectionsFromSlots(): CatalogSection[] {
    const base = this.readCoreVars();
    const sections: CatalogSection[] = [];
    const isDark = this.theme.mode() === 'dark';
    const rep = this.detectReplacement();

    const primCss = this.getSlotCss('primitives');
    if (primCss || base.prim.length) {
      let vars = primCss ? mergeUploadedVars(base.prim, primCss) : base.prim.slice();
      if (rep) {
        const isTealScale = (n: string) =>
          /^--teal-(50|100|200|300|400|500|600|700|800|900|950)$/.test(n);
        vars = vars.filter((v) => !isTealScale(v.name));
      }
      const subGroups = groupByPalette(vars);
      if (subGroups.length) {
        sections.push({ id: 'primitivos', label: 'Primitivos', cls: 'tva-prim', subGroups });
      }
    }

    const activeSlot: UploadSlot = isDark ? 'semantic-dark' : 'semantic-light';
    const semCss = this.getSlotCss(activeSlot);
    const baseVars = (isDark ? base.dark : base.light).slice();
    const semVars = semCss ? mergeUploadedVars(baseVars, semCss) : baseVars;
    if (semVars.length) {
      const tokens: CatalogToken[] = semVars.map(({ name, value }) => {
        const mapped = rep ? replaceTealRefs(value, rep) : value;
        return {
          name,
          label: name.replace(/^--/, ''),
          type: inferTokenType(mapped),
          value: mapped,
        };
      });
      sections.push({
        id: 'semanticos',
        label: isDark ? 'Semánticos - Dark' : 'Semánticos - Light',
        cls: 'tva-sem',
        subGroups: [
          {
            label: isDark ? 'Dark' : 'Light',
            mode: isDark ? 'dark' : 'light',
            theme: isDark ? 'dark' : 'light',
            tokens,
          },
        ],
      });
    }

    const compCss = this.getSlotCss('components');
    const compVars = compCss ? mergeUploadedVars(base.comp, compCss) : base.comp.slice();
    const mappedVars = rep
      ? compVars.map((v) => ({ ...v, value: replaceTealRefs(v.value, rep) }))
      : compVars;
    const compSubs = groupByComponent(mappedVars);
    if (compSubs.length) {
      sections.push({ id: 'componentes', label: 'Componentes', cls: 'tva-comp', subGroups: compSubs });
    }

    return sections;
  }

  private detectReplacement(): PrimaryReplacement | null {
    const primCss = this.getSlotCss('primitives');
    if (!primCss) return null;
    return detectPrimaryPaletteReplacement(primCss, this.readCoreVars().prim);
  }

  private readCoreVars(): {
    prim: MdsVarEntry[];
    light: MdsVarEntry[];
    dark: MdsVarEntry[];
    comp: MdsVarEntry[];
  } {
    return {
      prim: MDS_VARS_CATALOG.prim.map((v) => ({ ...v })),
      light: MDS_VARS_CATALOG.light.map((v) => ({ ...v })),
      dark: MDS_VARS_CATALOG.dark.map((v) => ({ ...v })),
      comp: MDS_VARS_CATALOG.comp.map((v) => ({ ...v })),
    };
  }

  private getSlotCss(slot: UploadSlot): string {
    return this.doc.getElementById(SLOT_STYLE_ID[slot])?.textContent?.trim() ?? '';
  }

  /** Resolución de colores/texto en contexto light/dark (vista mapa). */
  batchResolveTokens(tokens: CatalogToken[], theme: MdsThemeMode): ResolvedMap {
    return this.batchResolve(tokens, theme);
  }

  resolveTokenColor(key: string): string {
    return this.resolveColor(key);
  }

  private batchResolve(tokens: CatalogToken[], theme: MdsThemeMode): ResolvedMap {
    const html = this.doc.documentElement;
    const orig = html.getAttribute('data-theme');
    html.setAttribute('data-theme', theme);
    const results: ResolvedMap = {};
    tokens.forEach((t) => {
      if (t.type === 'color') {
        const rgb = this.resolveColor(t.name);
        const hex = rgbToHex(rgb);
        results[t.name] = { rgb, hex, dk: isDarkColor(rgb) };
      } else {
        let v = this.getCssVar(t.name) || '—';
        if (t.name === '--p-font-family') {
          v = v.split(',')[0]?.replace(/['"]/g, '').trim() || '—';
        }
        results[t.name] = { text: v };
      }
    });
    html.setAttribute('data-theme', orig ?? this.theme.mode());
    return results;
  }

  private buildRow(
    t: CatalogToken,
    sec: CatalogSection,
    query: string,
    resolved: ResolvedMap,
    maps: TokenMaps
  ): TokenRowView {
    const r = resolved[t.name];
    let displayValue = t.value || '—';
    let swatchBg = '';
    let swatchClass = 'tva-sw';

    if (t.type === 'color') {
      const color = r as ResolvedTokenColor | undefined;
      const hex = color?.hex ?? rgbToHex(this.resolveColor(t.name));
      const dk = color?.dk ?? isDarkColor(this.resolveColor(t.name));
      swatchBg = hex ? `#${hex}` : `var(${t.name})`;
      if (hex) displayValue = `#${hex}`;
      if (dk) swatchClass += ' dk';
    } else {
      const isDim = /dimension|spacing|radius/i.test(t.name);
      if (r && 'text' in r) displayValue = r.text;
      swatchClass += isDim ? ' tva-sw-dim' : ' tva-sw-text';
    }

    const affects = maps.semAffects[t.name];
    const src = maps.compSources[t.name];

    return {
      token: t,
      displayValue,
      swatchBg,
      swatchClass,
      metaKind: sec.id === 'semanticos' && affects?.length ? 'sem' : undefined,
      metaParts: affects,
      compSource: sec.id === 'componentes' && src ? src : undefined,
      nameParts: highlightParts(t.name, query),
    };
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
}
