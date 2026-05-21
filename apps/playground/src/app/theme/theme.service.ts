import { Injectable, signal } from '@angular/core';

import type { UploadSlot } from './css-import-normalize';
import type { LoadedSlotsMap } from './theme.types';

export type MdsThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<MdsThemeMode>('light');
  readonly toggleDisabled = signal(false);
  readonly toggleTitle = signal('');

  private forcedDark = false;

  constructor() {
    this.apply(this.mode());
  }

  toggle(): void {
    if (this.toggleDisabled()) return;
    const next: MdsThemeMode = this.mode() === 'light' ? 'dark' : 'light';
    this.forcedDark = false;
    this.mode.set(next);
    this.apply(next);
  }

  setMode(mode: MdsThemeMode): void {
    if (this.toggleDisabled()) return;
    this.mode.set(mode);
    this.apply(mode);
  }

  /** Paridad con legacy: restricciones cuando solo hay semántica light o dark subida. */
  syncToggleFromSlots(slots: LoadedSlotsMap): void {
    const hasAny = Object.keys(slots).length > 0;
    const hasLight = !!slots['semantic-light'];
    const hasDark = !!slots['semantic-dark'];
    const onlyDark = hasDark && !hasLight;
    const onlyLight = hasLight && !hasDark;

    if (!hasAny) {
      this.toggleDisabled.set(false);
      this.toggleTitle.set('');
      this.forcedDark = false;
      return;
    }

    if (onlyDark) {
      this.toggleDisabled.set(true);
      this.toggleTitle.set('Solo hay semántica oscura: el tema permanece en modo oscuro.');
      if (this.mode() !== 'dark') {
        this.forcedDark = true;
        this.mode.set('dark');
        this.apply('dark');
      }
      return;
    }

    if (onlyLight) {
      this.toggleDisabled.set(true);
      this.toggleTitle.set('Solo hay semántica clara: el tema permanece en modo claro.');
      if (this.mode() !== 'light') {
        this.forcedDark = false;
        this.mode.set('light');
        this.apply('light');
      }
      return;
    }

    this.toggleDisabled.set(false);
    this.toggleTitle.set('');
    this.forcedDark = false;
  }

  private apply(mode: MdsThemeMode): void {
    document.documentElement.setAttribute('data-theme', mode);
  }
}
