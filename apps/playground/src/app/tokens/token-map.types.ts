import type { CatalogToken, ResolvedMap } from '../theme/token-catalog.types';
import type { MdsThemeMode } from '../theme/theme.service';

export interface VvConnData {
  semRefMap: Map<string, string>;
  compRefMap: Map<string, string>;
  primSet: Set<string>;
  semSet: Set<string>;
}

export interface MapTokenRow {
  token: CatalogToken;
  vtype: 'prim' | 'sem' | 'comp';
  leftRef: string | null;
}

export interface MapCompGroup {
  label: string;
  safeId: string;
  storeKey: string;
  rows: MapTokenRow[];
}

export interface TokenMapModel {
  connData: VvConnData;
  primRows: MapTokenRow[];
  semRows: MapTokenRow[];
  semTheme: MdsThemeMode | null;
  semResolved: ResolvedMap | null;
  compGroups: MapCompGroup[];
}

export interface PanelPos {
  x: number;
  y: number;
  col?: number;
}
