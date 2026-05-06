/**
 * Normaliza CSS exportado desde otros proyectos (p. ej. nomenclaturas CTR / ITS / Tol):
 * extrae solo variables custom (--nombre) y las vuelca a los selectores del playground,
 * ignorando el valor literal de data-theme, @layer y metadatos de proyecto.
 */
(function (global) {
  'use strict';

  function stripComments(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  function stripLeadingNoise(css) {
    var s = css.trim();
    s = s.replace(/^\s*@layer\s+[^;{]+;/gim, '');
    s = s.replace(/^\s*@import\s+[^;]+;/gim, '');
    return s.trim();
  }

  /** Solo declaraciones --propiedad: valor; */
  function extractCustomDeclarations(blockBody) {
    var body = stripComments(blockBody);
    var lines = [];
    var re = /(--[a-zA-Z0-9_-]+)\s*:\s*((?:[^;{}]|'[^']*'|"[^"]*")*?)\s*;/g;
    var m;
    while ((m = re.exec(body)) !== null) {
      lines.push('  ' + m[1] + ': ' + m[2].trim().replace(/\s+/g, ' ') + ';');
    }
    return lines.join('\n');
  }

  function balancedBraceBlock(css, openBraceIndex) {
    var depth = 0;
    var i = openBraceIndex;
    if (!css[i] || css[i] !== '{') return { inner: '', end: openBraceIndex };
    depth = 1;
    i++;
    var start = i;
    while (i < css.length && depth > 0) {
      var c = css[i];
      if (c === '{') depth++;
      else if (c === '}') depth--;
      i++;
    }
    return { inner: css.slice(start, i - 1), end: i };
  }

  /** Bloques con data-theme="…" (cualquier valor: ITS, CTR, Tol, etc.) */
  function parseDataThemeBlocks(css) {
    var blocks = [];
    var cleaned = stripLeadingNoise(stripComments(css));
    var re = /html\s*\[\s*data-theme\s*=\s*(["'])([^"']+)\1\s*\]\s*\{/gi;
    var m;
    while ((m = re.exec(cleaned)) !== null) {
      var bracePos = m.index + m[0].length - 1;
      var pack = balancedBraceBlock(cleaned, bracePos);
      blocks.push({ themeRaw: m[2], inner: pack.inner });
    }
    if (blocks.length) return blocks;
    re = /\[\s*data-theme\s*=\s*(["'])([^"']+)\1\s*\]\s*\{/gi;
    while ((m = re.exec(cleaned)) !== null) {
      var bp = cleaned.indexOf('{', m.index);
      if (bp < 0) continue;
      var p = balancedBraceBlock(cleaned, bp);
      blocks.push({ themeRaw: m[2], inner: p.inner });
    }
    return blocks;
  }

  /**
   * Interpreta el valor exportado de data-theme y lo mapea a light | dark del playground.
   */
  function mapToPlaygroundTheme(themeRaw) {
    var low = String(themeRaw).toLowerCase();
    var lm = low.match(/\blight\b/);
    var dm = low.match(/\bdark\b/);
    var iL = lm ? lm.index : -1;
    var iD = dm ? dm.index : -1;
    if (iL >= 0 && iD >= 0) return iD > iL ? 'dark' : 'light';
    if (iD >= 0) return 'dark';
    if (iL >= 0) return 'light';
    return 'light';
  }

  /**
   * Tokens de componente MDS (--accordion-*, --button-*, etc.).
   * Sin \\b delante de --: tras { o salto de línea \\b fallaba y el fichero se clasificaba como primitivos.
   * No usar el prefijo "tab" solo: coincide con "button"; usar "tabs".
   */
  /* Segmentos con -nombre-; no usar [a-z0-9_-] (el guion dentro de [] rompe el patrón en algunos motores). */
  var COMPONENT_VAR_RE =
    /--(?:accordion|autocomplete|avatar|badge|blockui|breadcrumb|button|calendar|card|cascadeselect|checkbox|chip|colorpicker|contextmenu|datatable|datepicker|dialog|divider|dock|dropdown|fieldset|fileupload|galleria|image|inplace|input|knob|listbox|menu|menubar|megamenu|multiselect|orderlist|organizationchart|overlay|paginator|panel|password|picklist|radiobutton|rating|scrollpanel|select|sidebar|skeleton|slider|splitbutton|stepper|table|tabs|textarea|tieredmenu|toast|togglebutton|toolbar|tooltip|tree|treeselect|treetable|virtualscroller)(?:-[a-zA-Z0-9_]+)+\s*:/i;

  function looksLikeComponents(css) {
    return COMPONENT_VAR_RE.test(css);
  }

  /** Rampas de color primitivas (fichero primitives, no components) */
  function looksLikePrimitivePalette(css) {
    return /--(?:teal|blue|red|amber|green|purple|sky|slate|neutral|stone|zinc|gray|violet|indigo|pink|orange|lime|emerald|cyan|fuchsia|yellow|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\s*:/i.test(
      css
    );
  }

  function extractRootInner(css) {
    var cleaned = stripLeadingNoise(stripComments(css));
    var patterns = [/html\s*:\s*root\s*\{/i, /:root\s*\{/i];
    for (var p = 0; p < patterns.length; p++) {
      var rx = patterns[p];
      var found = cleaned.search(rx);
      if (found < 0) continue;
      var braceAt = cleaned.indexOf('{', found);
      if (braceAt < 0) continue;
      var blk = balancedBraceBlock(cleaned, braceAt);
      return blk.inner;
    }
    return null;
  }

  function wrapRoot(decl) {
    return 'html:root {\n' + decl + '\n}';
  }

  /**
   * @returns {{ ok: boolean, injects: Array<{ slot: string, css: string }>, reason?: string }}
   */
  function normalizeUploaded(css) {
    var raw = String(css || '');
    if (!raw.trim()) return { ok: false, injects: [], reason: 'vacío' };

    var themeBlocks = parseDataThemeBlocks(raw);
    if (themeBlocks.length) {
      var accLight = [];
      var accDark = [];
      for (var i = 0; i < themeBlocks.length; i++) {
        var pg = mapToPlaygroundTheme(themeBlocks[i].themeRaw);
        var decl = extractCustomDeclarations(themeBlocks[i].inner);
        if (!decl) continue;
        if (pg === 'dark') accDark.push(decl);
        else accLight.push(decl);
      }
      var injects = [];
      if (accLight.length) {
        injects.push({
          slot: 'semantic-light',
          css: 'html[data-theme="light"] {\n' + accLight.join('\n') + '\n}',
        });
      }
      if (accDark.length) {
        injects.push({
          slot: 'semantic-dark',
          css: 'html[data-theme="dark"] {\n' + accDark.join('\n') + '\n}',
        });
      }
      if (injects.length) return { ok: true, injects: injects };
    }

    if (looksLikeComponents(raw)) {
      var innerC = extractRootInner(raw);
      if (innerC) {
        var declC = extractCustomDeclarations(innerC);
        if (declC) return { ok: true, injects: [{ slot: 'components', css: wrapRoot(declC) }] };
      }
      return { ok: false, injects: [], reason: 'componentes: no hay bloque :root con variables' };
    }

    var innerP = extractRootInner(raw);
    if (innerP) {
      var declP = extractCustomDeclarations(innerP);
      if (declP) {
        if (looksLikePrimitivePalette(raw)) {
          return { ok: true, injects: [{ slot: 'primitives', css: wrapRoot(declP) }] };
        }
        if (COMPONENT_VAR_RE.test(innerP)) {
          return { ok: true, injects: [{ slot: 'components', css: wrapRoot(declP) }] };
        }
        return { ok: true, injects: [{ slot: 'primitives', css: wrapRoot(declP) }] };
      }
    }

    return { ok: false, injects: [], reason: 'no se detectó data-theme ni :root con --variables' };
  }

  global.CssImportNormalize = {
    normalizeUploaded: normalizeUploaded,
    mapToPlaygroundTheme: mapToPlaygroundTheme,
    /** Para fallback en app.js (misma heurística que normalizeUploaded) */
    looksLikeComponentsCss: looksLikeComponents,
    looksLikePrimitivePalette: looksLikePrimitivePalette,
  };
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
