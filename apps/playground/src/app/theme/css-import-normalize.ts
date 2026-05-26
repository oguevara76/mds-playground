/** Port de js/css-import-normalize.js — normaliza CSS exportados de Figma/MDS. */

export type UploadSlot = 'primitives' | 'semantic-light' | 'semantic-dark' | 'components';

export interface NormalizeInject {
  slot: UploadSlot;
  css: string;
}

export interface NormalizeResult {
  ok: boolean;
  injects: NormalizeInject[];
  reason?: string;
}

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function stripLeadingNoise(css: string): string {
  let s = css.trim();
  s = s.replace(/^\s*@layer\s+[^;{]+;/gim, '');
  s = s.replace(/^\s*@import\s+[^;]+;/gim, '');
  return s.trim();
}

function extractCustomDeclarations(blockBody: string): string {
  const body = stripComments(blockBody);
  const lines: string[] = [];
  const re = /(--[a-zA-Z0-9_-]+)\s*:\s*((?:[^;{}]|'[^']*'|"[^"]*")*?)\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    lines.push(`  ${m[1]}: ${m[2].trim().replace(/\s+/g, ' ')};`);
  }
  return lines.join('\n');
}

function balancedBraceBlock(css: string, openBraceIndex: number): { inner: string; end: number } {
  let depth = 0;
  let i = openBraceIndex;
  if (css[i] !== '{') return { inner: '', end: openBraceIndex };
  depth = 1;
  i++;
  const start = i;
  while (i < css.length && depth > 0) {
    const c = css[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    i++;
  }
  return { inner: css.slice(start, i - 1), end: i };
}

function parseDataThemeBlocks(css: string): { themeRaw: string; inner: string }[] {
  const blocks: { themeRaw: string; inner: string }[] = [];
  const cleaned = stripLeadingNoise(stripComments(css));
  let re = /html\s*\[\s*data-theme\s*=\s*(["'])([^"']+)\1\s*\]\s*\{/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(cleaned)) !== null) {
    const bracePos = m.index + m[0].length - 1;
    const pack = balancedBraceBlock(cleaned, bracePos);
    blocks.push({ themeRaw: m[2], inner: pack.inner });
  }
  if (blocks.length) return blocks;
  re = /\[\s*data-theme\s*=\s*(["'])([^"']+)\1\s*\]\s*\{/gi;
  while ((m = re.exec(cleaned)) !== null) {
    const bp = cleaned.indexOf('{', m.index);
    if (bp < 0) continue;
    const p = balancedBraceBlock(cleaned, bp);
    blocks.push({ themeRaw: m[2], inner: p.inner });
  }
  return blocks;
}

export function mapToPlaygroundTheme(themeRaw: string): 'light' | 'dark' {
  const low = String(themeRaw).toLowerCase();
  const lm = low.match(/\blight\b/);
  const dm = low.match(/\bdark\b/);
  const iL = lm ? lm.index! : -1;
  const iD = dm ? dm.index! : -1;
  if (iL >= 0 && iD >= 0) return iD > iL ? 'dark' : 'light';
  if (iD >= 0) return 'dark';
  if (iL >= 0) return 'light';
  return 'light';
}

const COMPONENT_VAR_RE =
  /--(?:accordion|autocomplete|avatar|badge|blockui|breadcrumb|button|calendar|card|cascadeselect|checkbox|chip|colorpicker|contextmenu|datatable|datepicker|dialog|divider|dock|dropdown|fieldset|fileupload|galleria|image|inplace|input|knob|listbox|menu|menubar|megamenu|multiselect|orderlist|organizationchart|overlay|paginator|panel|password|picklist|radiobutton|rating|scrollpanel|select|sidebar|skeleton|slider|splitbutton|stepper|table|tabs|textarea|tieredmenu|toast|togglebutton|toolbar|tooltip|tree|treeselect|treetable|virtualscroller)(?:-[a-zA-Z0-9_]+)+\s*:/i;

export function looksLikeComponentsCss(css: string): boolean {
  return COMPONENT_VAR_RE.test(css);
}

function looksLikePrimitivePalette(css: string): boolean {
  return /--(?:teal|blue|red|amber|green|purple|sky|slate|neutral|stone|zinc|gray|violet|indigo|pink|orange|lime|emerald|cyan|fuchsia|yellow|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\s*:/i.test(
    css
  );
}

function extractRootInner(css: string): string | null {
  const cleaned = stripLeadingNoise(stripComments(css));
  const patterns = [/html\s*:\s*root\s*\{/i, /:root\s*\{/i];
  for (const rx of patterns) {
    const found = cleaned.search(rx);
    if (found < 0) continue;
    const braceAt = cleaned.indexOf('{', found);
    if (braceAt < 0) continue;
    const blk = balancedBraceBlock(cleaned, braceAt);
    return blk.inner;
  }
  return null;
}

function wrapRoot(decl: string): string {
  return `html:root {\n${decl}\n}`;
}

/** Si el upload trae --tag-padding-x/y sin shorthand, añade --tag-padding (core MDS). */
function synthesizeTagPaddingShorthand(decl: string): string {
  if (/--tag-padding\s*:/.test(decl)) {
    return decl;
  }
  if (!/--tag-padding-x\s*:/.test(decl) || !/--tag-padding-y\s*:/.test(decl)) {
    return decl;
  }
  const line = '  --tag-padding: var(--tag-padding-y) var(--tag-padding-x);';
  return decl.trimEnd() + (decl.endsWith('\n') ? '' : '\n') + line + '\n';
}

/** Si el upload trae --tooltip-padding-x/y sin shorthand, añade --tooltip-padding (core MDS). */
function synthesizeTooltipPaddingShorthand(decl: string): string {
  if (/--tooltip-padding\s*:/.test(decl)) {
    return decl;
  }
  if (
    !/--tooltip-padding-x\s*:/.test(decl) ||
    !/--tooltip-padding-y\s*:/.test(decl)
  ) {
    return decl;
  }
  const line = '  --tooltip-padding: var(--tooltip-padding-y) var(--tooltip-padding-x);';
  return decl.trimEnd() + (decl.endsWith('\n') ? '' : '\n') + line + '\n';
}

export function normalizeUploaded(css: string): NormalizeResult {
  const raw = String(css || '');
  if (!raw.trim()) return { ok: false, injects: [], reason: 'vacío' };

  const themeBlocks = parseDataThemeBlocks(raw);
  if (themeBlocks.length) {
    const accLight: string[] = [];
    const accDark: string[] = [];
    for (const block of themeBlocks) {
      const pg = mapToPlaygroundTheme(block.themeRaw);
      const decl = extractCustomDeclarations(block.inner);
      if (!decl) continue;
      if (pg === 'dark') accDark.push(decl);
      else accLight.push(decl);
    }
    const injects: NormalizeInject[] = [];
    if (accLight.length) {
      injects.push({
        slot: 'semantic-light',
        css: `html[data-theme="light"] {\n${accLight.join('\n')}\n}`,
      });
    }
    if (accDark.length) {
      injects.push({
        slot: 'semantic-dark',
        css: `html[data-theme="dark"] {\n${accDark.join('\n')}\n}`,
      });
    }
    if (injects.length) return { ok: true, injects };
  }

  if (looksLikeComponentsCss(raw)) {
    const innerC = extractRootInner(raw);
    if (innerC) {
      const declC = synthesizeTagPaddingShorthand(
        synthesizeTooltipPaddingShorthand(extractCustomDeclarations(innerC)),
      );
      if (declC) return { ok: true, injects: [{ slot: 'components', css: wrapRoot(declC) }] };
    }
    return { ok: false, injects: [], reason: 'componentes: no hay bloque :root con variables' };
  }

  const innerP = extractRootInner(raw);
  if (innerP) {
    const declP = extractCustomDeclarations(innerP);
    if (declP) {
      if (looksLikePrimitivePalette(raw)) {
        return { ok: true, injects: [{ slot: 'primitives', css: wrapRoot(declP) }] };
      }
      if (COMPONENT_VAR_RE.test(innerP)) {
        const declC = synthesizeTagPaddingShorthand(synthesizeTooltipPaddingShorthand(declP));
        return { ok: true, injects: [{ slot: 'components', css: wrapRoot(declC) }] };
      }
      return { ok: true, injects: [{ slot: 'primitives', css: wrapRoot(declP) }] };
    }
  }

  return { ok: false, injects: [], reason: 'no se detectó data-theme ni :root con --variables' };
}

export function detectSlotFromRaw(css: string): UploadSlot {
  if (/html\[data-theme="light"\]/i.test(css)) return 'semantic-light';
  if (/html\[data-theme="dark"\]/i.test(css)) return 'semantic-dark';
  if (looksLikeComponentsCss(css)) return 'components';
  return 'primitives';
}

export function sanitizeUploadedCss(css: string): string {
  return css
    .replace(/<script/gi, '/* removed script */')
    .replace(/expression\s*\(/gi, '/* removed expression */');
}
