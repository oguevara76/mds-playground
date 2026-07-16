import type {
  CatalogSection,
  CatalogToken,
  CompSourceMeta,
  HighlightPart,
  MdsVarEntry,
  PrimaryReplacement,
  TokenMaps,
} from './token-catalog.types';

const SCALE_STEPS_RE = '(50|100|200|300|400|500|600|700|800|900|950)';
const SCALE_TOKEN_RE = new RegExp(`^--([a-z][\\w-]*)-${SCALE_STEPS_RE}$`, 'i');
const TEAL_REF_RE = new RegExp(`var\\(--teal-${SCALE_STEPS_RE}\\)`, 'g');

const PALETTE_LABELS: Record<string, string> = {
  primary: 'Primary',
  surface: 'Surface',
  gray: 'Gray',
  grey: 'Grey',
  slate: 'Slate',
  zinc: 'Zinc',
  neutral: 'Neutral',
  stone: 'Stone',
  red: 'Red',
  orange: 'Orange',
  amber: 'Amber',
  yellow: 'Yellow',
  lime: 'Lime',
  green: 'Green',
  emerald: 'Emerald',
  teal: 'Teal',
  cyan: 'Cyan',
  sky: 'Sky',
  blue: 'Blue',
  indigo: 'Indigo',
  violet: 'Violet',
  purple: 'Purple',
  fuchsia: 'Fuchsia',
  pink: 'Pink',
  rose: 'Rose',
};

const PALETTE_TAIL = new Set(['Spacing', 'Radius']);

const COMP_RE =
  /^--(button|accordion|autocomplete|badge|breadcrumb|calendar|card|carousel|checkbox|chip|colorpicker|confirmdialog|confirmpopup|contextmenu|datatable|dataview|dialog|divider|dropdown|editor|fieldset|fileupload|galleria|image|inlinemessage|inputgroup|inputnumber|inputotp|inputswitch|inputtext|knob|listbox|megamenu|menu|menubar|message|multiselect|orderlist|organizationchart|overlaypanel|paginator|panel|panelmenu|password|picklist|progressbar|progressspinner|radio|radiobutton|rating|scrollpanel|selectbutton|sidebar|skeleton|slider|speeddial|splitbutton|steps|tabmenu|tabs|tabview|tag|terminal|textarea|tieredmenu|timeline|toast|togglebutton|toolbar|tooltip|tree|treetable|tristatecheckbox|virtualscroller)-/;

export function parseCssVarsText(text: string): MdsVarEntry[] {
  const re = /(--[\w-]+)\s*:\s*([^;}\n]+)/g;
  const seen = new Set<string>();
  const vars: MdsVarEntry[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const name = m[1].trim();
    if (seen.has(name)) continue;
    seen.add(name);
    vars.push({ name, value: m[2].trim() });
  }
  return vars;
}

export function isRawColor(value: string): boolean {
  const v = (value || '').trim();
  return (
    /^#[0-9a-fA-F]{3,8}$/.test(v) ||
    /^rgba?\(/.test(v) ||
    /^hsla?\(/.test(v) ||
    /^oklch\(/.test(v) ||
    /^oklab\(/.test(v) ||
    /^color\(/.test(v) ||
    /^lch\(/.test(v)
  );
}

export function inferTokenType(value: string): 'color' | 'text' {
  if (isRawColor(value)) return 'color';
  if (/^var\(--[\w-]+\)\s*$/.test(value)) return 'color';
  return 'text';
}

export function primPalette(name: string): string {
  if (/^--dimension-(spacing|scale)/.test(name)) return 'Spacing';
  if (/^--dimension-radius/.test(name)) return 'Radius';
  const n = name.startsWith('--p-') ? name.slice(4) : name.slice(2);
  const m = n.match(/^([\w]+)/);
  if (!m) return 'Otros';
  const key = m[1].toLowerCase();
  return PALETTE_LABELS[key] || key[0].toUpperCase() + key.slice(1);
}

export function extractVarRef(value: string): string | null {
  if (!value) return null;
  const m = (value + '').match(/var\((--[\w-]+)/);
  return m ? m[1] : null;
}

export function resolveVarChain(
  value: string,
  valueMap: Map<string, string>,
  targetSet: Set<string>,
  maxDepth = 8
): string | null {
  let current = (value || '').trim();
  const visited = new Set<string>();
  for (let i = 0; i < maxDepth; i++) {
    const ref = extractVarRef(current);
    if (!ref || visited.has(ref)) return null;
    visited.add(ref);
    if (targetSet.has(ref)) return ref;
    const next = valueMap.get(ref);
    if (!next) return null;
    current = next;
  }
  return null;
}

export function compLabel(name: string): string {
  const n = name.startsWith('--p-') ? name.slice(4) : name.slice(2);
  const m = n.match(/^([\w]+)/);
  if (!m) return 'Otros';
  return m[1][0].toUpperCase() + m[1].slice(1);
}

export function groupByPalette(vars: MdsVarEntry[]): { label: string; tokens: CatalogToken[] }[] {
  const map = new Map<string, CatalogToken[]>();
  vars.forEach(({ name, value }) => {
    const pal = primPalette(name);
    if (!map.has(pal)) map.set(pal, []);
    map.get(pal)!.push({
      name,
      label: name.replace(/^--/, ''),
      type: inferTokenType(value),
      value,
    });
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => {
      const aT = PALETTE_TAIL.has(a) ? 1 : 0;
      const bT = PALETTE_TAIL.has(b) ? 1 : 0;
      return aT - bT;
    })
    .map(([label, tokens]) => ({ label, tokens }));
}

export function groupByComponent(vars: MdsVarEntry[]): { label: string; tokens: CatalogToken[] }[] {
  const map = new Map<string, CatalogToken[]>();
  vars.forEach(({ name, value }) => {
    const comp = compLabel(name);
    if (!map.has(comp)) map.set(comp, []);
    map.get(comp)!.push({
      name,
      label: name.replace(/^--/, ''),
      type: inferTokenType(value),
      value,
    });
  });
  return Array.from(map.entries()).map(([label, tokens]) => ({ label, tokens }));
}

export function mergeUploadedVars(base: MdsVarEntry[], uploadedCss: string): MdsVarEntry[] {
  const overrides = new Map(parseCssVarsText(uploadedCss).map((v) => [v.name, v.value]));
  const merged = base.map((v) =>
    overrides.has(v.name) ? { name: v.name, value: overrides.get(v.name)! } : v
  );
  const baseNames = new Set(merged.map((v) => v.name));
  parseCssVarsText(uploadedCss).forEach((v) => {
    if (!baseNames.has(v.name)) merged.push(v);
  });
  return merged;
}

function extractPaletteNameSet(vars: MdsVarEntry[]): Set<string> {
  const set = new Set<string>();
  vars.forEach(({ name }) => {
    const m = name.match(SCALE_TOKEN_RE);
    if (m) set.add(m[1].toLowerCase());
  });
  return set;
}

export function detectPrimaryPaletteReplacement(
  uploadedCss: string,
  basePrimVars: MdsVarEntry[]
): PrimaryReplacement | null {
  const uploaded = parseCssVarsText(uploadedCss || '');
  if (!uploaded.length) return null;

  const byPalette = new Map<string, Map<string, string>>();
  uploaded.forEach(({ name }) => {
    const m = name.match(SCALE_TOKEN_RE);
    if (!m) return;
    const pal = m[1].toLowerCase();
    const step = m[2];
    if (!byPalette.has(pal)) byPalette.set(pal, new Map());
    byPalette.get(pal)!.set(step, `--${pal}-${step}`);
  });

  if (byPalette.has('teal')) return null;

  const corePaletteSet = extractPaletteNameSet(basePrimVars || []);
  type BestPick = { palette: string; steps: Map<string, string>; score: number; isNonCore: boolean };
  let best: BestPick | null = null;
  for (const [palette, steps] of byPalette) {
    const score = steps.size;
    const isNonCore = !corePaletteSet.has(palette);
    if (!best) {
      best = { palette, steps, score, isNonCore };
      continue;
    }
    if (isNonCore && !best.isNonCore) {
      best = { palette, steps, score, isNonCore };
      continue;
    }
    if (isNonCore === best.isNonCore && score > best.score) {
      best = { palette, steps, score, isNonCore };
    }
  }

  if (!best || best.score < 3) return null;
  return { palette: best.palette, steps: best.steps };
}

export function replaceTealRefs(value: string, replacement: PrimaryReplacement | null): string {
  if (!value || !replacement) return value;
  return String(value).replace(TEAL_REF_RE, (full) => {
    const m = full.match(new RegExp(`--teal-${SCALE_STEPS_RE}`));
    if (!m) return full;
    const repl = replacement.steps.get(m[1]);
    return repl ? `var(${repl})` : full;
  });
}

export function classifyRefGroup(ref: string, primSet: Set<string>): string {
  if (primSet.has(ref)) {
    const m = ref.match(/^--([a-z]+)-/);
    const pal = m ? m[1][0].toUpperCase() + m[1].slice(1) : 'General';
    return 'Primitivos / ' + pal;
  }
  if (/^--primary/.test(ref)) return 'Semánticos / Primaria';
  if (/^--surface/.test(ref)) return 'Semánticos / Surface';
  if (/^--feedback-/.test(ref)) return 'Semánticos / Feedback';
  if (/^--highlight-/.test(ref)) return 'Semánticos / Highlight';
  if (/^--form-field-/.test(ref)) return 'Semánticos / Form field';
  if (/^--text-/.test(ref)) return 'Semánticos / Texto';
  if (/^--border-radius/.test(ref)) return 'Semánticos / Forma';
  if (/^--content-/.test(ref)) return 'Semánticos / Content';
  if (/^--navigation-/.test(ref)) return 'Semánticos / Navigation';
  if (/^--overlay-/.test(ref)) return 'Semánticos / Overlay';
  if (/^--list-/.test(ref)) return 'Semánticos / List';
  if (/^--mask-/.test(ref)) return 'Semánticos / Mask';
  if (/^--focus-ring/.test(ref)) return 'Semánticos / Focus';
  return 'Semánticos / General';
}

export function buildTokenMapsFromSections(sections: CatalogSection[]): TokenMaps {
  const primTokens =
    sections.find((s) => s.id === 'primitivos')?.subGroups.flatMap((sg) => sg.tokens) ?? [];
  const semTokens =
    sections.find((s) => s.id === 'semanticos')?.subGroups.flatMap((sg) => sg.tokens) ?? [];
  const compTokens =
    sections.find((s) => s.id === 'componentes')?.subGroups.flatMap((sg) => sg.tokens) ?? [];

  const valueMap = new Map<string, string>();
  const primSet = new Set<string>();
  const semSet = new Set<string>();

  primTokens.forEach((t) => {
    valueMap.set(t.name, t.value);
    primSet.add(t.name);
  });
  semTokens.forEach((t) => {
    valueMap.set(t.name, t.value);
    semSet.add(t.name);
  });
  compTokens.forEach((t) => valueMap.set(t.name, t.value));

  const compSources: Record<string, CompSourceMeta> = {};
  const semAffects: Record<string, string[]> = {};

  compTokens.forEach((t) => {
    const ref =
      resolveVarChain(t.value, valueMap, semSet) || resolveVarChain(t.value, valueMap, primSet);
    if (!ref) return;
    compSources[t.name] = { label: `var(${ref})`, group: classifyRefGroup(ref, primSet) };
    if (semSet.has(ref)) {
      if (!semAffects[ref]) semAffects[ref] = [];
      const lbl = compLabel(t.name);
      if (!semAffects[ref].includes(lbl)) semAffects[ref].push(lbl);
    }
  });

  Object.keys(semAffects).forEach((k) => {
    semAffects[k].sort((a, b) => a.localeCompare(b, 'es'));
  });

  return { compSources, semAffects };
}

export function highlightParts(text: string, query: string): HighlightPart[] {
  const q = query.trim();
  if (!q) return [{ text, mark: false }];
  const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  const parts: HighlightPart[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), mark: false });
    parts.push({ text: m[1], mark: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), mark: false });
  return parts.length ? parts : [{ text, mark: false }];
}

export function rgbToHex(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) return '';
  return [m[1], m[2], m[3]]
    .map((n) => parseInt(n, 10).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

export function isDarkColor(rgb: string): boolean {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) return false;
  return (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 < 0.5;
}

export function primaryReplacementLabel(rep: PrimaryReplacement | null): string {
  return rep ? `Primary replacement: ${rep.palette}` : '';
}
