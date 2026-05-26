export interface MdsVarEntry {
  name: string;
  value: string;
}

export type TokenDisplayType = 'color' | 'text';

export interface CatalogToken {
  name: string;
  label: string;
  type: TokenDisplayType;
  value: string;
}

export interface CatalogSubGroup {
  label: string;
  tokens: CatalogToken[];
  mode?: 'light' | 'dark';
  theme?: 'light' | 'dark';
}

export interface CatalogSection {
  id: 'primitivos' | 'semanticos' | 'componentes';
  label: string;
  cls: 'tva-prim' | 'tva-sem' | 'tva-comp';
  subGroups: CatalogSubGroup[];
}

export interface ResolvedTokenColor {
  rgb: string;
  hex: string;
  dk: boolean;
}

export interface ResolvedTokenText {
  text: string;
}

export type ResolvedToken = ResolvedTokenColor | ResolvedTokenText;

export type ResolvedMap = Record<string, ResolvedToken>;

export interface CompSourceMeta {
  label: string;
  group: string;
}

export interface TokenMaps {
  compSources: Record<string, CompSourceMeta>;
  semAffects: Record<string, string[]>;
}

export interface PrimaryReplacement {
  palette: string;
  steps: Map<string, string>;
}

export interface TokenRowView {
  token: CatalogToken;
  displayValue: string;
  swatchBg: string;
  swatchClass: string;
  metaHtml?: string;
  metaKind?: 'sem' | 'comp';
  metaParts?: string[];
  compSource?: CompSourceMeta;
  nameParts: HighlightPart[];
}

export interface HighlightPart {
  text: string;
  mark: boolean;
}

export interface SectionView {
  section: CatalogSection;
  subGroups: SubGroupView[];
  total: number;
  open: boolean;
}

export interface SubGroupView {
  subGroup: CatalogSubGroup;
  rows: TokenRowView[];
}
