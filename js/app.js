/* ═══════════════════════════════════════════════════════════════════
   MDS PLAYGROUND — App Logic
   ═══════════════════════════════════════════════════════════════════ */

(function () {

  /* ── DOM refs ── */
  const uploadZone    = document.getElementById('upload-zone');
  const fileInput     = document.getElementById('css-file-input');
  const loadedFiles   = document.getElementById('loaded-files');
  const filesHeader   = document.getElementById('files-header');
  const removeAllBtn  = document.getElementById('remove-all-files');
  const uploadWarning = document.getElementById('upload-warning');
  const uploadWarningText = document.getElementById('upload-warning-text');
  const tokenGrid     = document.getElementById('token-grid');
  const colorStrip    = document.getElementById('color-strip');
  const toggleTheme   = document.getElementById('toggle-theme');

  /* ── Tabs ── */
  document.querySelectorAll('.preview-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.preview-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Theme toggle ── */
  let isDark      = false;
  let forcedDark  = false; // true cuando dark se activó automáticamente (sin light)
  let tvIsActive  = false; // tokens view visible

  toggleTheme.addEventListener('click', () => {
    if (toggleTheme.disabled) return;
    isDark = !isDark;
    forcedDark = false; // el usuario eligió manualmente
    applyTheme();
  });

  function applyTheme() {
    const theme = isDark ? 'ctr--tol--dark' : 'ctr--tol--light';
    document.documentElement.setAttribute('data-theme', theme);
    toggleTheme.innerHTML = isDark
      ? '<i class="pi pi-sun"></i><span>Light</span>'
      : '<i class="pi pi-moon"></i><span>Dark</span>';
    refreshColorStrip();
    refreshTokenGrid();
    setTimeout(autoContrastPrimary, 50);
    if (tvIsActive) setTimeout(() => { if (tvMapMode) renderTvMap(); else renderTvList(tvSearch.value); }, 70);
  }

  /* ── Auto-contraste del color primario ── */
  /* Detecta si el primary actual es claro u oscuro y ajusta el texto sobre él */
  function autoContrastPrimary() {
    const html    = document.documentElement;
    const current = html.getAttribute('data-theme') || 'ctr--tol--light';

    /* Lee el primary para cada tema cambiando data-theme de forma síncrona
       (sin repintado visual hasta que el JS termina) y calcula la regla. */
    const buildRule = (theme) => {
      html.setAttribute('data-theme', theme);
      const rgb = resolveColor('--p-primary-color');
      const m   = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
      if (!m) return '';
      const lum  = (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255;
      const text = lum > 0.55 ? '#111111' : '#ffffff';
      const ring = text === '#ffffff' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.35)';
      return `html[data-theme="${theme}"] {
        --p-primary-color-text:            ${text};
        --button-primary-color:            ${text};
        --button-primary-hover-color:      ${text};
        --button-primary-active-color:     ${text};
        --p-button-primary-color:          ${text};
        --button-primary-focus-ring-color: ${ring};
      }`;
    };

    const lightRule = buildRule('ctr--tol--light');
    const darkRule  = buildRule('ctr--tol--dark');

    /* Restaurar el tema real antes de escribir el estilo */
    html.setAttribute('data-theme', current);

    let el = document.getElementById('auto-contrast');
    if (!el) {
      el = document.createElement('style');
      el.id = 'auto-contrast';
      document.head.appendChild(el);
    }
    el.textContent = lightRule + '\n' + darkRule;
  }

  function syncToggleState() {
    const hasAnyFile = Object.values(loadedSlots).some(v => v !== null);
    const hasLight   = !!loadedSlots['semantic-light'];
    const hasDark    = !!loadedSlots['semantic-dark'];
    const onlyDark   = hasDark && !hasLight;

    if (!hasAnyFile) {
      /* Sin ficheros — playground usa el MDS base completo, ambos modos disponibles */
      toggleTheme.disabled = false;
      toggleTheme.title = '';
    } else if (onlyDark) {
      /* Solo dark semantic subido → auto-switch a dark y bloquear toggle */
      toggleTheme.disabled = true;
      toggleTheme.title = 'Esta colección solo tiene modo oscuro';
      if (!isDark) { isDark = true; forcedDark = true; applyTheme(); }
    } else if (!hasDark) {
      /* Ficheros cargados sin dark semantic → bloquear toggle en light */
      toggleTheme.disabled = true;
      toggleTheme.title = 'Carga el fichero semantic-dark para activar el modo oscuro';
      if (isDark) { isDark = false; applyTheme(); }
    } else {
      /* Ambos modos disponibles */
      toggleTheme.disabled = false;
      toggleTheme.title = '';
      if (forcedDark) { isDark = false; forcedDark = false; applyTheme(); }
    }
  }

  /* ── Slot registry ── */
  /* Maps slot key → { fileName, css } — one entry per detected type */
  const loadedSlots = {
    'primitives':     null,
    'semantic-light': null,
    'semantic-dark':  null,
    'components':     null,
  };

  const SLOT_STYLE_ID = {
    'primitives':     'user-primitives',
    'semantic-light': 'user-semantic-light',
    'semantic-dark':  'user-semantic-dark',
    'components':     'user-components',
  };

  const SLOT_LABEL = {
    'primitives':     'Primitivos',
    'semantic-light': 'Semántica Light',
    'semantic-dark':  'Semántica Dark',
    'components':     'Componentes',
  };

  /* ── Auto-detection of file type ── */
  function detectSlot(css) {
    if (/html\[data-theme="ctr--tol--light"\]/.test(css)) return 'semantic-light';
    if (/html\[data-theme="ctr--tol--dark"\]/.test(css))  return 'semantic-dark';
    /* Components: cualquier token de componente sin prefijo --p- */
    if (/--button-|--accordion-|--autocomplete-|--badge-|--input-/.test(css)) return 'components';
    return 'primitives';
  }

  /* ── File upload ── */
  fileInput.addEventListener('change', e => processFiles(e.target.files));

  uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const valid = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.css'));
    if (valid.length) {
      processFiles(valid);
    } else {
      showToast('Solo se aceptan ficheros .css', 'error');
    }
  });

  function processFiles(files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const css  = sanitizeCSS(e.target.result);
        const slot = detectSlot(css);
        loadedSlots[slot] = { fileName: file.name, css };
        injectSlot(slot, css);
        renderFileList();
        validateSlots();
        syncToggleState();
        setTimeout(() => { refreshColorStrip(); refreshTokenGrid(); autoContrastPrimary(); if (tvIsActive) { if (tvMapMode) renderTvMap(); else renderTvList(tvSearch.value); } }, 120);
        showToast(`✓ ${SLOT_LABEL[slot]}: ${file.name}`, 'success');
      };
      reader.readAsText(file);
    });
  }

  function sanitizeCSS(css) {
    return css
      .replace(/<script/gi, '/* removed script */')
      .replace(/expression\s*\(/gi, '/* removed expression */');
  }

  function injectSlot(slot, css) {
    const el = document.getElementById(SLOT_STYLE_ID[slot]);
    if (el) el.textContent = css;
  }

  function removeAllSlots() {
    Object.keys(loadedSlots).forEach(slot => {
      loadedSlots[slot] = null;
      injectSlot(slot, '');
    });
    fileInput.value = '';
    renderFileList();
    validateSlots();
    syncToggleState();
    refreshColorStrip();
    refreshTokenGrid();
    showToast('Ficheros eliminados — tokens por defecto restaurados', 'info');
  }

  /* ── Validación: mínimo primitives + un semantic ── */
  function validateSlots() {
    const hasAnyFile  = Object.values(loadedSlots).some(v => v !== null);
    const hasPrim     = !!loadedSlots['primitives'];
    const hasSemantic = !!loadedSlots['semantic-light'] || !!loadedSlots['semantic-dark'];

    if (!hasAnyFile) {
      uploadWarning.hidden = true;
      return;
    }

    let msg = null;
    if (!hasPrim && !hasSemantic) {
      msg = 'Faltan primitives y un semantic (light o dark).';
    } else if (!hasPrim) {
      msg = 'Falta el fichero primitives.css.';
    } else if (!hasSemantic) {
      msg = 'Falta al menos un fichero semantic (light o dark).';
    }

    uploadWarningText.textContent = msg || '';
    uploadWarning.hidden = !msg;
  }

  removeAllBtn.addEventListener('click', removeAllSlots);

  /* ── Render loaded-files list ── */
  function renderFileList() {
    const entries = Object.entries(loadedSlots).filter(([, v]) => v !== null);
    const hasFiles = entries.length > 0;
    filesHeader.hidden  = !hasFiles;
    loadedFiles.hidden  = !hasFiles;
    uploadZone.hidden   = hasFiles;
    loadedFiles.innerHTML = '';
    entries.forEach(([slot, { fileName }]) => {
      const li = document.createElement('li');
      li.className = 'loaded-file-item';
      li.innerHTML = `
        <i data-lucide="file-text" class="lf-icon"></i>
        <span class="lf-name" title="${fileName}">${fileName}</span>`;
      loadedFiles.appendChild(li);
    });
    if (hasFiles && window.lucide) window.lucide.createIcons();
  }

  /* ── Token inspector ── */
  const WATCH_TOKENS = [
    { name: '--p-primary-color', label: 'primary' },
    { name: '--p-primary-50',    label: 'primary-50' },
    { name: '--p-primary-900',   label: 'primary-900' },
    { name: '--p-font-family',   label: 'font' },
  ];

  function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function refreshTokenGrid() {
    tokenGrid.innerHTML = '';
    WATCH_TOKENS.forEach(t => {
      const val = getCSSVar(t.name);
      const row = document.createElement('div');
      row.className = 'token-row';

      const swatch = document.createElement('div');
      if (t.name === '--p-font-family') {
        swatch.className = 'token-swatch token-swatch-font';
        swatch.textContent = 'Aa';
      } else {
        swatch.className = 'token-swatch';
        swatch.style.background = `var(${t.name})`;
      }
      row.appendChild(swatch);

      const nameEl = document.createElement('span');
      nameEl.className = 'token-name';
      nameEl.textContent = t.label;

      const valEl = document.createElement('span');
      valEl.className = 'token-value';
      let display;
      if (t.name === '--p-font-family') {
        display = val.split(',')[0].replace(/['"]/g, '').trim() || '—';
      } else {
        /* Resolve computed color → hex uppercase */
        const rgb = resolveColor(t.name);
        const hex = rgbToHex(rgb);
        display = hex ? '#' + hex : (val || '—');
      }
      valEl.textContent = display;

      row.appendChild(nameEl);
      row.appendChild(valEl);
      tokenGrid.appendChild(row);
    });
  }

  function resolveColor(key) {
    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;opacity:0;pointer-events:none;background:var(' + key + ')';
    document.body.appendChild(el);
    const rgb = getComputedStyle(el).backgroundColor;
    document.body.removeChild(el);
    return rgb;
  }

  function rgbToHex(rgb) {
    const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (!m) return '';
    return [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  function isDarkColor(rgb) {
    const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (!m) return false;
    return (0.299 * m[1] + 0.587 * m[2] + 0.114 * m[3]) / 255 < 0.5;
  }

  function refreshColorStrip() {
    colorStrip.querySelectorAll('.color-swatch').forEach(sw => {
      const key  = sw.dataset.key;
      const step = sw.dataset.step;
      if (!key) return;
      const rgb  = resolveColor(key);
      const hex  = rgbToHex(rgb);
      const dark = isDarkColor(rgb);
      sw.style.background = `var(${key})`;
      sw.classList.toggle('is-dark', dark);
      sw.innerHTML =
        '<span class="swatch-step">' + step + '</span>' +
        '<span class="swatch-hex">' + hex + '</span>';
    });
  }

  /* ── Toast ── */
  function showToast(msg, type = 'info') {
    const existing = document.querySelector('.mds-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'mds-toast mds-toast-' + type;
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  const toastStyles = document.createElement('style');
  toastStyles.textContent = `
    .mds-toast {
      position:fixed;bottom:24px;right:24px;padding:10px 18px;border-radius:8px;
      font-family:var(--p-font-family);font-size:13px;font-weight:500;
      z-index:9999;opacity:0;transform:translateY(8px);
      transition:opacity .25s,transform .25s;box-shadow:0 4px 16px rgba(0,0,0,.15);
    }
    .mds-toast-success{background:var(--p-success-color);color:#fff;}
    .mds-toast-error  {background:var(--p-danger-color); color:#fff;}
    .mds-toast-info   {background:var(--p-surface-700);  color:#fff;}
  `;
  document.head.appendChild(toastStyles);

  /* ── SplitButton interactivity ── */
  function closeAllSplitPanels() {
    document.querySelectorAll('.p-splitbutton').forEach(sb => {
      const panel   = sb.querySelector('.p-splitbutton-panel');
      const menuBtn = sb.querySelector('.p-splitbutton-menubutton');
      if (panel) panel.hidden = true;
      setChevron(menuBtn, false);
    });
  }

  function setChevron(btn, open) {
    if (!btn) return;
    const icon = btn.querySelector('.pi');
    if (!icon) return;
    icon.classList.toggle('pi-chevron-up',   open);
    icon.classList.toggle('pi-chevron-down', !open);
  }

  function initSplitButtons() {
    document.querySelectorAll('.p-splitbutton').forEach(sb => {
      const menuBtn = sb.querySelector('.p-splitbutton-menubutton');
      const panel   = sb.querySelector('.p-splitbutton-panel');
      if (!menuBtn || !panel) return;
      panel.hidden = true;
      menuBtn.addEventListener('click', e => {
        e.stopPropagation();
        const wasOpen = !panel.hidden;
        closeAllSplitPanels();
        if (!wasOpen) { panel.hidden = false; setChevron(menuBtn, true); }
      });
      sb.querySelector('.p-splitbutton-panel')?.addEventListener('click', e => e.stopPropagation());
    });
    document.addEventListener('click', closeAllSplitPanels);
  }

  /* ── Logo → home ── */
  document.getElementById('logo-home').addEventListener('click', e => {
    e.preventDefault();
    if (tvIsActive) hideTokensView();
  });

  /* ── Tokens View ── */
  const tokensView    = document.getElementById('tokens-view');
  const tvContent     = document.getElementById('tv-content');
  const tvSearch      = document.getElementById('tv-search');
  const tvSearchClear = document.getElementById('tv-search-clear');
  const tvSearchWrap  = document.getElementById('tv-search-wrap');
  const tvCount       = document.getElementById('tv-count');
  const navTokensLink = document.getElementById('nav-tokens');
  const previewTabsEl = document.querySelector('.preview-tabs');
  const tvBtnList     = document.getElementById('tv-btn-list');
  const tvBtnMap      = document.getElementById('tv-btn-map');
  const tvMapArea     = document.getElementById('tv-map-area');
  let   tvMapMode     = false;

  const TOKEN_CATALOG = [
    {
      id: 'prim-primary', label: 'Primitivos — Primaria',
      tokens: [
        { name: '--p-primary-50',    label: '50',    type: 'color' },
        { name: '--p-primary-100',   label: '100',   type: 'color' },
        { name: '--p-primary-200',   label: '200',   type: 'color' },
        { name: '--p-primary-300',   label: '300',   type: 'color' },
        { name: '--p-primary-400',   label: '400',   type: 'color' },
        { name: '--p-primary-500',   label: '500',   type: 'color' },
        { name: '--p-primary-600',   label: '600',   type: 'color' },
        { name: '--p-primary-700',   label: '700',   type: 'color' },
        { name: '--p-primary-800',   label: '800',   type: 'color' },
        { name: '--p-primary-900',   label: '900',   type: 'color' },
        { name: '--p-primary-950',   label: '950',   type: 'color' },
        { name: '--p-primary-color', label: 'Base',  type: 'color' },
      ]
    },
    {
      id: 'prim-surface', label: 'Primitivos — Surface',
      tokens: [
        { name: '--p-surface-0',   label: '0',   type: 'color' },
        { name: '--p-surface-50',  label: '50',  type: 'color' },
        { name: '--p-surface-100', label: '100', type: 'color' },
        { name: '--p-surface-200', label: '200', type: 'color' },
        { name: '--p-surface-300', label: '300', type: 'color' },
        { name: '--p-surface-400', label: '400', type: 'color' },
        { name: '--p-surface-500', label: '500', type: 'color' },
        { name: '--p-surface-600', label: '600', type: 'color' },
        { name: '--p-surface-700', label: '700', type: 'color' },
        { name: '--p-surface-800', label: '800', type: 'color' },
        { name: '--p-surface-900', label: '900', type: 'color' },
        { name: '--p-surface-950', label: '950', type: 'color' },
      ]
    },
    {
      id: 'sem-highlight', label: 'Semánticos — Highlight',
      tokens: [
        { name: '--highlight-background',       label: 'background',       type: 'color' },
        { name: '--highlight-color',            label: 'color',            type: 'color' },
        { name: '--highlight-focus-background', label: 'focus-background', type: 'color' },
        { name: '--highlight-focus-color',      label: 'focus-color',      type: 'color' },
      ]
    },
    {
      id: 'sem-estados', label: 'Semánticos — Estados',
      tokens: [
        { name: '--p-success-color', label: 'success', type: 'color' },
        { name: '--p-danger-color',  label: 'danger',  type: 'color' },
        { name: '--p-warning-color', label: 'warning', type: 'color' },
        { name: '--p-info-color',    label: 'info',    type: 'color' },
      ]
    },
    {
      id: 'sem-tipografia', label: 'Semánticos — Tipografía',
      tokens: [
        { name: '--p-font-family', label: 'font-family', type: 'text' },
        { name: '--p-font-size',   label: 'font-size',   type: 'text' },
      ]
    },
    {
      id: 'sem-forma', label: 'Semánticos — Forma',
      tokens: [
        { name: '--p-border-radius',      label: 'radius',      type: 'text' },
        { name: '--p-border-radius-sm',   label: 'radius-sm',   type: 'text' },
        { name: '--p-border-radius-md',   label: 'radius-md',   type: 'text' },
        { name: '--p-border-radius-lg',   label: 'radius-lg',   type: 'text' },
        { name: '--p-border-radius-xl',   label: 'radius-xl',   type: 'text' },
        { name: '--p-border-radius-2xl',  label: 'radius-2xl',  type: 'text' },
        { name: '--p-border-radius-full', label: 'radius-full', type: 'text' },
      ]
    },
    {
      id: 'comp-button', label: 'Componentes — Button',
      tokens: [
        { name: '--button-primary-color',            label: 'primary-color',            type: 'color' },
        { name: '--button-primary-hover-color',      label: 'primary-hover-color',      type: 'color' },
        { name: '--button-primary-active-color',     label: 'primary-active-color',     type: 'color' },
        { name: '--button-primary-focus-ring-color', label: 'primary-focus-ring-color', type: 'color' },
        { name: '--p-button-primary-color',          label: 'p-primary-color',          type: 'color' },
      ]
    },
  ];

  /* ── Relationship maps ── */
  const SEM_AFFECTS = {
    '--highlight-background':        ['Checkbox', 'Radio', 'MultiSelect', 'Listbox'],
    '--highlight-color':             ['Checkbox text', 'Radio text', 'MultiSelect text'],
    '--highlight-focus-background':  ['Checkbox focus', 'Radio focus'],
    '--highlight-focus-color':       ['Checkbox focus text', 'Radio focus text'],
    '--p-success-color':             ['Button success', 'Tag success', 'Message'],
    '--p-danger-color':              ['Button danger', 'Tag danger', 'InputText invalid'],
    '--p-warning-color':             ['Tag warn', 'Message warn'],
    '--p-info-color':                ['Tag info', 'Message info'],
    '--p-font-family':               ['Todos los componentes'],
    '--p-font-size':                 ['Button', 'InputText', 'Badge', 'Tag'],
    '--p-border-radius':             ['Button', 'InputText', 'Select'],
    '--p-border-radius-sm':          ['Badge', 'Chip', 'Avatar'],
    '--p-border-radius-md':          ['Button', 'InputText', 'Checkbox', 'Radio'],
    '--p-border-radius-lg':          ['Card', 'Panel', 'Fieldset'],
    '--p-border-radius-xl':          ['Dialog', 'Drawer'],
    '--p-border-radius-2xl':         ['OverlayPanel'],
    '--p-border-radius-full':        ['Avatar circular', 'Badge circular'],
  };

  const COMP_SOURCES = {
    '--button-primary-color':            { label: 'auto-contrast(--p-primary-color)', group: 'Primitivos / Primaria' },
    '--button-primary-hover-color':      { label: 'auto-contrast(--p-primary-color)', group: 'Primitivos / Primaria' },
    '--button-primary-active-color':     { label: 'auto-contrast(--p-primary-color)', group: 'Primitivos / Primaria' },
    '--button-primary-focus-ring-color': { label: 'rgba(--p-primary-color, 0.6)',     group: 'Primitivos / Primaria' },
    '--p-button-primary-color':          { label: 'auto-contrast(--p-primary-color)', group: 'Primitivos / Primaria' },
  };

  /* ── VV map: semantic tokens (left panel) ── */
  const VV_SEM = [
    { name: '--p-primary-color',               label: 'primary-color',      type: 'color', group: 'Primaria'     },
    { name: '--highlight-background',          label: 'highlight-bg',       type: 'color', group: 'Highlight'    },
    { name: '--highlight-color',               label: 'highlight-color',    type: 'color', group: 'Highlight'    },
    { name: '--highlight-focus-background',    label: 'highlight-focus-bg', type: 'color', group: 'Highlight'    },
    { name: '--p-success-color',               label: 'success',            type: 'color', group: 'Estados'      },
    { name: '--p-danger-color',                label: 'danger',             type: 'color', group: 'Estados'      },
    { name: '--p-warning-color',               label: 'warning',            type: 'color', group: 'Estados'      },
    { name: '--p-info-color',                  label: 'info',               type: 'color', group: 'Estados'      },
    { name: '--p-font-family',                 label: 'font-family',        type: 'text',  group: 'Tipografía'   },
    { name: '--p-border-radius-md',            label: 'radius-md',          type: 'text',  group: 'Forma'        },
    { name: '--button-primary-color',          label: 'btn-primary-color',  type: 'color', group: 'Auto-contraste' },
    { name: '--button-primary-focus-ring-color', label: 'btn-focus-ring',   type: 'color', group: 'Auto-contraste' },
  ];

  /* ── VV map: component usages (right panel) ── */
  const VV_COMP = [
    { id: 'vvc-btn-bg',     label: 'button · primary bg',     semRef: '--p-primary-color'               },
    { id: 'vvc-btn-text',   label: 'button · primary text',   semRef: '--button-primary-color'          },
    { id: 'vvc-btn-ring',   label: 'button · focus ring',     semRef: '--button-primary-focus-ring-color'},
    { id: 'vvc-pill-bg',    label: 'tab-pill · active bg',    semRef: '--p-primary-color'               },
    { id: 'vvc-pill-text',  label: 'tab-pill · active text',  semRef: '--button-primary-color'          },
    { id: 'vvc-chk-bg',     label: 'checkbox · selected bg',  semRef: '--highlight-background'          },
    { id: 'vvc-chk-text',   label: 'checkbox · color',        semRef: '--highlight-color'               },
    { id: 'vvc-radio-bg',   label: 'radio · selected bg',     semRef: '--highlight-background'          },
    { id: 'vvc-radio-focus',label: 'radio · focus bg',        semRef: '--highlight-focus-background'    },
    { id: 'vvc-tag-ok',     label: 'tag · success',           semRef: '--p-success-color'               },
    { id: 'vvc-tag-err',    label: 'tag · danger',            semRef: '--p-danger-color'                },
    { id: 'vvc-tag-warn',   label: 'tag · warning',           semRef: '--p-warning-color'               },
    { id: 'vvc-msg-info',   label: 'message · info',          semRef: '--p-info-color'                  },
    { id: 'vvc-all-font',   label: 'todos · font-family',     semRef: '--p-font-family'                 },
    { id: 'vvc-btn-radius', label: 'button · border-radius',  semRef: '--p-border-radius-md'            },
    { id: 'vvc-inp-radius', label: 'input · border-radius',   semRef: '--p-border-radius-md'            },
  ];

  function showTokensView() {
    tvIsActive = true;
    tokensView.hidden = false;
    previewTabsEl.hidden = true;
    document.querySelectorAll('.tab-panel').forEach(p => { p.hidden = true; });
    navTokensLink.classList.add('active');
    renderTvList(tvSearch.value);
  }

  function hideTokensView() {
    tvIsActive = false;
    tokensView.hidden = true;
    previewTabsEl.hidden = false;
    const activeTab = document.querySelector('.preview-tab.active');
    if (activeTab) {
      const panel = document.getElementById('tab-' + activeTab.dataset.tab);
      if (panel) panel.hidden = false;
    }
    navTokensLink.classList.remove('active');
  }

  navTokensLink.addEventListener('click', e => {
    e.preventDefault();
    if (!tokensView.hidden) { hideTokensView(); return; }
    showTokensView();
  });

  /* ════════════════════════════════════════════════════════════
     TOKEN SECTION BUILDER
     ════════════════════════════════════════════════════════════ */

  /* ── Parse all --var: value declarations from a CSS string ── */
  function parseCssVars(css) {
    const re = /(--[\w-]+)\s*:\s*([^;}\n]+)/g;
    const vars = []; let m;
    while ((m = re.exec(css)) !== null) vars.push({ name: m[1].trim(), value: m[2].trim() });
    return vars;
  }

  /* ── Detect if a CSS value string is a raw color literal ── */
  function isRawColor(value) {
    const v = (value || '').trim();
    return /^#[0-9a-fA-F]{3,8}$/.test(v)
        || /^rgba?\(/.test(v) || /^hsla?\(/.test(v)
        || /^oklch\(/.test(v) || /^oklab\(/.test(v)
        || /^color\(/.test(v) || /^lch\(/.test(v);
  }

  /* ── Token display type: 'color' or 'text' ── */
  function inferTokenType(value) {
    if (isRawColor(value))                           return 'color';
    if (/^var\(--[\w-]+\)\s*$/.test(value))          return 'color'; // single-var alias → likely color
    return 'text';
  }

  /* ── Palette label from a primitive variable name ── */
  function primPalette(name) {
    const m = name.match(/^--p-([\w]+)/);
    if (!m) return 'Otros';
    const LABELS = {
      primary:'Primary', surface:'Surface', gray:'Gray', grey:'Grey',
      slate:'Slate', zinc:'Zinc', neutral:'Neutral', stone:'Stone',
      red:'Red', orange:'Orange', amber:'Amber', yellow:'Yellow',
      lime:'Lime', green:'Green', emerald:'Emerald', teal:'Teal',
      cyan:'Cyan', sky:'Sky', blue:'Blue', indigo:'Indigo',
      violet:'Violet', purple:'Purple', fuchsia:'Fuchsia', pink:'Pink', rose:'Rose',
    };
    return LABELS[m[1]] || (m[1][0].toUpperCase() + m[1].slice(1));
  }

  /* ── Component label from a component variable name ── */
  function compLabel(name) {
    /* Strip optional --p- prefix, then take first word segment */
    const n = name.startsWith('--p-') ? name.slice(4) : name.slice(2);
    const m = n.match(/^([\w]+)/);
    if (!m) return 'Otros';
    return m[1][0].toUpperCase() + m[1].slice(1);
  }

  /* ── Is this variable a component token? ── */
  const COMP_RE = /^--(button|accordion|autocomplete|badge|breadcrumb|calendar|card|carousel|checkbox|chip|colorpicker|confirmdialog|contextmenu|datatable|dataview|dialog|divider|dropdown|editor|fieldset|fileupload|galleria|image|inlinemessage|inputgroup|inputnumber|inputotp|inputswitch|inputtext|knob|listbox|megamenu|menu|menubar|message|multiselect|orderlist|organizationchart|overlaypanel|paginator|panel|panelmenu|password|picklist|progressbar|progressspinner|radio|radiobutton|rating|scrollpanel|selectbutton|sidebar|skeleton|slider|speeddial|splitbutton|steps|tabmenu|tabview|tag|terminal|textarea|tieredmenu|timeline|toast|togglebutton|toolbar|tooltip|tree|treetable|tristatecheckbox|virtualscroller)-/;
  function isCompVar(name) {
    return COMP_RE.test(name) || /^--p-(button|accordion|checkbox|inputtext|select)-/.test(name);
  }

  /* ── Group an array of {name,value} into sub-groups by palette ── */
  function groupByPalette(vars) {
    const map = new Map();
    vars.forEach(({ name, value }) => {
      const pal = primPalette(name);
      if (!map.has(pal)) map.set(pal, []);
      map.get(pal).push({ name, label: name.replace(/^--/, ''), type: inferTokenType(value) });
    });
    return Array.from(map.entries()).map(([label, tokens]) => ({ label, tokens }));
  }

  /* ── Group an array of {name,value} into sub-groups by component ── */
  function groupByComponent(vars) {
    const map = new Map();
    vars.forEach(({ name, value }) => {
      const comp = compLabel(name);
      if (!map.has(comp)) map.set(comp, []);
      map.get(comp).push({ name, label: name.replace(/^--/, ''), type: inferTokenType(value) });
    });
    return Array.from(map.entries()).map(([label, tokens]) => ({ label, tokens }));
  }

  /* ── Read CSS custom properties from all document stylesheets, bucketed by selector context ── */
  function readDocumentVarsByContext() {
    const root = [], light = [], dark = [];
    const seen = { root: new Set(), light: new Set(), dark: new Set() };
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          const text = rule.cssText || '';
          let bucket, seenSet;
          if (text.includes('ctr--tol--light'))    { bucket = light; seenSet = seen.light; }
          else if (text.includes('ctr--tol--dark')) { bucket = dark;  seenSet = seen.dark;  }
          else                                       { bucket = root;  seenSet = seen.root;  }
          const re = /(--[\w-]+)\s*:\s*([^;}\n]+)/g;
          let m;
          while ((m = re.exec(text)) !== null) {
            const name = m[1].trim(), value = m[2].trim();
            if (!seenSet.has(name)) { seenSet.add(name); bucket.push({ name, value }); }
          }
        }
      } catch(e) { /* skip CORS-protected sheets */ }
    }
    return { root, light, dark };
  }

  /* ── Batch-resolve token colors in a specific theme context ── */
  function batchResolve(tokens, theme) {
    const html = document.documentElement;
    const orig = html.getAttribute('data-theme');
    html.setAttribute('data-theme', theme);
    const results = {};
    tokens.forEach(t => {
      if (t.type === 'color') {
        const rgb = resolveColor(t.name);
        const hex = rgbToHex(rgb);
        results[t.name] = { rgb, hex, dk: isDarkColor(rgb) };
      } else {
        let v = getCSSVar(t.name) || '—';
        if (t.name === '--p-font-family') v = v.split(',')[0].replace(/['"]/g, '').trim();
        results[t.name] = { text: v };
      }
    });
    html.setAttribute('data-theme', orig);
    return results;
  }

  /* ── Main section builder: returns [{id, label, cls, subGroups[]}] ── */
  function buildSections() {
    const hasAnyFile = Object.values(loadedSlots).some(v => v !== null);
    return hasAnyFile ? buildSectionsFromSlots() : buildSectionsFromDocument();
  }

  function buildSectionsFromSlots() {
    const sections = [];

    /* ── Primitivos ── */
    if (loadedSlots.primitives) {
      const vars      = parseCssVars(loadedSlots.primitives.css);
      const subGroups = groupByPalette(vars);
      if (subGroups.length) sections.push({ id:'primitivos', label:'Primitivos', cls:'tva-prim', subGroups });
    }

    /* ── Semánticos (light + dark as sub-groups) ── */
    const semSubs = [];
    ['semantic-light', 'semantic-dark'].forEach(slot => {
      if (!loadedSlots[slot]) return;
      const vars  = parseCssVars(loadedSlots[slot].css);
      const mode  = slot === 'semantic-light' ? 'light' : 'dark';
      const theme = slot === 'semantic-light' ? 'ctr--tol--light' : 'ctr--tol--dark';
      const tokens = vars.map(({ name, value }) => ({ name, label: name.replace(/^--/, ''), type: inferTokenType(value) }));
      semSubs.push({ label: mode === 'light' ? 'Light' : 'Dark', mode, theme, tokens });
    });
    if (semSubs.length) sections.push({ id:'semanticos', label:'Semánticos', cls:'tva-sem', subGroups: semSubs });

    /* ── Componentes ── */
    if (loadedSlots.components) {
      const vars      = parseCssVars(loadedSlots.components.css);
      const subGroups = groupByComponent(vars);
      if (subGroups.length) sections.push({ id:'componentes', label:'Componentes', cls:'tva-comp', subGroups });
    }

    return sections;
  }

  function buildSectionsFromDocument() {
    const { root, light, dark } = readDocumentVarsByContext();

    /* Split root vars: raw-color-value → primitive, comp pattern → component, rest → semantic light */
    const primVars  = root.filter(v => !isCompVar(v.name) && isRawColor(v.value));
    const compRootV = root.filter(v => isCompVar(v.name));
    const semRoot   = root.filter(v => !isCompVar(v.name) && !isRawColor(v.value));

    const sections = [];

    /* Primitivos */
    const primSubs = groupByPalette(primVars);
    if (primSubs.length) sections.push({ id:'primitivos', label:'Primitivos', cls:'tva-prim', subGroups: primSubs });

    /* Semánticos */
    const semSubs = [];
    const lightVars = [
      ...semRoot.map(({ name, value }) => ({ name, label: name.replace(/^--/, ''), type: inferTokenType(value) })),
      ...light.filter(v => !isCompVar(v.name)).map(({ name, value }) => ({ name, label: name.replace(/^--/, ''), type: inferTokenType(value) })),
    ];
    if (lightVars.length) semSubs.push({ label:'Light', mode:'light', theme:'ctr--tol--light', tokens: lightVars });
    const darkVars = dark.filter(v => !isCompVar(v.name)).map(({ name, value }) => ({ name, label: name.replace(/^--/, ''), type: inferTokenType(value) }));
    if (darkVars.length) semSubs.push({ label:'Dark', mode:'dark', theme:'ctr--tol--dark', tokens: darkVars });
    if (semSubs.length) sections.push({ id:'semanticos', label:'Semánticos', cls:'tva-sem', subGroups: semSubs });

    /* Componentes */
    const compAll = [
      ...compRootV,
      ...light.filter(v => isCompVar(v.name)),
      ...dark.filter(v => isCompVar(v.name)),
    ];
    const compSubs = groupByComponent(compAll);
    if (compSubs.length) sections.push({ id:'componentes', label:'Componentes', cls:'tva-comp', subGroups: compSubs });

    return sections.length ? sections : buildFallbackSections();
  }

  function buildFallbackSections() {
    const primSubs = [], semSubs = [], compSubs = [];
    TOKEN_CATALOG.forEach(g => {
      if (g.id.startsWith('prim'))       primSubs.push({ label: g.label.replace('Primitivos — ',''),  tokens: g.tokens });
      else if (g.id.startsWith('sem'))   semSubs.push({ label: g.label.replace('Semánticos — ',''),   mode:'light', theme:'ctr--tol--light', tokens: g.tokens });
      else                               compSubs.push({ label: g.label.replace('Componentes — ',''), tokens: g.tokens });
    });
    const sections = [];
    if (primSubs.length)  sections.push({ id:'primitivos', label:'Primitivos',  cls:'tva-prim', subGroups: primSubs  });
    if (semSubs.length)   sections.push({ id:'semanticos', label:'Semánticos',  cls:'tva-sem',  subGroups: semSubs   });
    if (compSubs.length)  sections.push({ id:'componentes',label:'Componentes', cls:'tva-comp', subGroups: compSubs  });
    return sections;
  }

  /* ════════════════════════════════════════════════════════════
     LIST RENDERER
     ════════════════════════════════════════════════════════════ */

  function renderTokenRow(t, sec, hl, resolved) {
    let sw = '', val = '';
    if (t.type === 'color') {
      const r   = resolved ? resolved[t.name] : null;
      const rgb = r ? r.rgb : resolveColor(t.name);
      const hex = r ? r.hex : rgbToHex(rgb);
      const dk  = r ? r.dk  : isDarkColor(rgb);
      /* Use inline hex for resolved (theme-accurate), live var() for current-context tokens */
      const bg  = (r && hex) ? '#' + hex : `var(${t.name})`;
      sw  = `<span class="tva-sw${dk ? ' dk' : ''}" style="background:${bg}"></span>`;
      val = hex ? '#' + hex : (getCSSVar(t.name) || '—');
    } else {
      const r = resolved ? resolved[t.name] : null;
      let v = r ? r.text : (getCSSVar(t.name) || '—');
      if (!r && t.name === '--p-font-family') v = v.split(',')[0].replace(/['"]/g, '').trim();
      sw  = `<span class="tva-sw tva-sw-text">Aa</span>`;
      val = v;
    }

    let meta = '';
    if (sec.id === 'semanticos' && SEM_AFFECTS[t.name]) {
      meta = `<div class="tva-meta tva-meta-sem"><i class="pi pi-arrow-right"></i>${SEM_AFFECTS[t.name].join(' · ')}</div>`;
    } else if (sec.id === 'componentes' && COMP_SOURCES[t.name]) {
      const src = COMP_SOURCES[t.name];
      meta = `<div class="tva-meta tva-meta-comp"><i class="pi pi-link"></i><code>${src.label}</code><em>${src.group}</em></div>`;
    }

    return `<div class="tva-row">
      <div class="tva-row-top">${sw}
        <span class="tva-name">${hl(t.name)}</span>
        <span class="tva-val">${val}</span>
      </div>${meta}
    </div>`;
  }

  function renderTvList(query) {
    const q = (query || '').trim().toLowerCase();
    let total = 0, openCount = 0;

    const hl = s => {
      if (!q) return s;
      const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      return s.replace(re, '<mark>$1</mark>');
    };

    const sections = buildSections();

    tvContent.innerHTML = sections.map(sec => {
      /* Filter by query */
      const filteredSubs = sec.subGroups.map(sg => ({
        ...sg,
        tokens: sg.tokens.filter(t => !q || t.name.toLowerCase().includes(q) || t.label.toLowerCase().includes(q)),
      })).filter(sg => sg.tokens.length);

      if (!filteredSubs.length) return '';

      const secTotal = filteredSubs.reduce((a, sg) => a + sg.tokens.length, 0);
      total += secTotal;

      /* First section with results is open; others closed (all open when searching) */
      const isOpen = openCount === 0 || !!q;
      openCount++;

      const subGroupsHtml = filteredSubs.map(sg => {
        /* Batch-resolve colors in the right theme context for semantic sub-groups */
        const resolved = sg.theme ? batchResolve(sg.tokens, sg.theme) : null;
        const rowsHtml = sg.tokens.map(t => renderTokenRow(t, sec, hl, resolved)).join('');

        const mCls  = sg.mode ? ` tva-sg-${sg.mode}` : '';
        const mIcon = sg.mode === 'light' ? '<i class="pi pi-sun"></i>'
                    : sg.mode === 'dark'  ? '<i class="pi pi-moon"></i>' : '';

        return `<div class="tva-subgroup${mCls}">
          <div class="tva-sg-hdr">${mIcon}${sg.label}<span class="tva-sg-count">${sg.tokens.length}</span></div>
          ${rowsHtml}
        </div>`;
      }).join('');

      return `<details class="tva tva-section ${sec.cls}"${isOpen ? ' open' : ''}>
        <summary class="tva-summary">
          <i class="pi pi-chevron-right tva-chev"></i>
          <span class="tva-glabel">${sec.label}</span>
          <span class="tva-badge">${secTotal}</span>
        </summary>
        <div class="tva-body">${subGroupsHtml}</div>
      </details>`;
    }).join('');

    tvCount.textContent = total + ' token' + (total !== 1 ? 's' : '');
  }

  tvSearch.addEventListener('input', () => {
    tvSearchClear.hidden = !tvSearch.value;
    renderTvList(tvSearch.value);
  });

  tvSearchClear.addEventListener('click', () => {
    tvSearch.value = '';
    tvSearchClear.hidden = true;
    renderTvList('');
    tvSearch.focus();
  });

  /* ── Map view toggle ── */
  tvBtnList.addEventListener('click', () => {
    if (!tvMapMode) return;
    tvMapMode = false;
    tvBtnList.classList.add('tv-view-btn-on');
    tvBtnMap.classList.remove('tv-view-btn-on');
    tvContent.hidden    = false;
    tvMapArea.hidden    = true;
    tvSearchWrap.hidden = false;
    tvCount.hidden      = false;
    renderTvList(tvSearch.value);
  });

  tvBtnMap.addEventListener('click', () => {
    if (tvMapMode) return;
    tvMapMode = true;
    tvBtnMap.classList.add('tv-view-btn-on');
    tvBtnList.classList.remove('tv-view-btn-on');
    tvContent.hidden    = true;
    tvMapArea.hidden    = false;
    tvSearchWrap.hidden = true;
    tvCount.hidden      = true;
    renderTvMap();
  });

  /* ── Variable Visualizer map renderer ── */

  /* Panel position store — persists drag positions between re-renders */
  const vvPosStore = {
    left:  { x: 40,  y: 40 },
    right: { x: 420, y: 40 },
  };

  function renderTvMap() {
    const theme = document.documentElement.getAttribute('data-theme') || '';
    const mode  = theme.includes('dark') ? 'Dark' : 'Light';

    /* ── Left panel: semantic tokens ── */
    let lastGroup = null;
    const leftRows = VV_SEM.map(t => {
      let sep = '';
      if (t.group !== lastGroup) {
        sep = `<div class="vv-gsep">${t.group}</div>`;
        lastGroup = t.group;
      }
      let sw = '', val = '';
      if (t.type === 'color') {
        const rgb = resolveColor(t.name);
        const hex = rgbToHex(rgb);
        const dk  = isDarkColor(rgb);
        sw  = `<span class="vv-sw${dk ? ' dk' : ''}" style="background:var(${t.name})"></span>`;
        val = hex ? '#' + hex : '—';
      } else {
        let v = getCSSVar(t.name) || '—';
        if (t.name === '--p-font-family') v = v.split(',')[0].replace(/['"]/g, '').trim();
        sw  = `<span class="vv-sw vv-sw-text">Aa</span>`;
        val = v;
      }
      return `${sep}<div class="vv-row">
        ${sw}
        <div class="vv-info"><span class="vv-name">${t.label}</span><span class="vv-val">${val}</span></div>
        <span class="vv-dot vv-dot-r" data-sdot="${t.name}"></span>
      </div>`;
    }).join('');

    /* ── Right panel: component usages ── */
    const rightRows = VV_COMP.map(c => {
      const semT = VV_SEM.find(s => s.name === c.semRef);
      let sw = '';
      if (semT && semT.type === 'color') {
        const rgb = resolveColor(c.semRef);
        const dk  = isDarkColor(rgb);
        sw = `<span class="vv-sw${dk ? ' dk' : ''}" style="background:var(${c.semRef})"></span>`;
      } else {
        sw = `<span class="vv-sw vv-sw-text">Aa</span>`;
      }
      return `<div class="vv-row">
        <span class="vv-dot vv-dot-l" data-cdot="${c.id}" data-cref="${c.semRef}"></span>
        ${sw}
        <div class="vv-info">
          <span class="vv-name">${c.label}</span>
          <span class="vv-val">${c.semRef.replace('--', '')}</span>
        </div>
      </div>`;
    }).join('');

    const lp = vvPosStore.left;
    const rp = vvPosStore.right;

    tvMapArea.innerHTML = `
      <div class="vv-canvas" id="vv-canvas">
        <svg class="vv-svg" id="vv-svg" overflow="visible"></svg>
        <div class="vv-panel" id="vv-left" style="left:${lp.x}px;top:${lp.y}px">
          <div class="vv-phdr" data-drag="left">
            <i class="pi pi-sliders-h"></i> Semánticos <small>${mode}</small>
          </div>
          ${leftRows}
        </div>
        <div class="vv-panel" id="vv-right" style="left:${rp.x}px;top:${rp.y}px">
          <div class="vv-phdr" data-drag="right">
            <i class="pi pi-th-large"></i> Componentes
          </div>
          ${rightRows}
        </div>
      </div>`;

    initVvDrag();
    requestAnimationFrame(() => requestAnimationFrame(vvDrawLines));
  }

  /* ── Drag interaction ── */
  function initVvDrag() {
    const canvas = document.getElementById('vv-canvas');
    if (!canvas) return;

    let dragging = null; // { panel, startX, startY, origX, origY }

    canvas.addEventListener('mousedown', e => {
      const hdr = e.target.closest('[data-drag]');
      if (!hdr) return;
      const key   = hdr.dataset.drag;
      const panel = hdr.closest('.vv-panel');
      if (!panel) return;
      e.preventDefault();
      dragging = {
        panel, key,
        startX: e.clientX, startY: e.clientY,
        origX: vvPosStore[key].x, origY: vvPosStore[key].y,
      };
      panel.classList.add('vv-dragging');
    });

    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const dx = e.clientX - dragging.startX;
      const dy = e.clientY - dragging.startY;
      const nx = Math.max(0, dragging.origX + dx);
      const ny = Math.max(0, dragging.origY + dy);
      vvPosStore[dragging.key] = { x: nx, y: ny };
      dragging.panel.style.left = nx + 'px';
      dragging.panel.style.top  = ny + 'px';
      vvDrawLines();
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging.panel.classList.remove('vv-dragging');
      dragging = null;
    });
  }

  function vvDrawLines() {
    const svg    = document.getElementById('vv-svg');
    const canvas = document.getElementById('vv-canvas');
    if (!svg || !canvas) return;

    /* Size SVG to cover the whole canvas area */
    const O = canvas.getBoundingClientRect();
    svg.style.width  = O.width  + 'px';
    svg.style.height = O.height + 'px';

    function dotXY(el) {
      const r = el.getBoundingClientRect();
      return { x: (r.left + r.right) / 2 - O.left, y: (r.top + r.bottom) / 2 - O.top };
    }

    let paths = '';
    canvas.querySelectorAll('.vv-dot-l[data-cdot]').forEach(cd => {
      const sd = canvas.querySelector(`.vv-dot-r[data-sdot="${cd.dataset.cref}"]`);
      if (!sd) return;
      const p1 = dotXY(sd), p2 = dotXY(cd);
      const dx = Math.abs(p2.x - p1.x) * 0.5;
      const d  = `M${p1.x},${p1.y} C${p1.x + dx},${p1.y} ${p2.x - dx},${p2.y} ${p2.x},${p2.y}`;
      paths += `<path d="${d}" fill="none" stroke="rgba(59,130,246,.4)" stroke-width="1.5" stroke-linecap="round"/>`;
    });
    svg.innerHTML = `<g>${paths}</g>`;
  }

  /* ── Init ── */
  document.documentElement.setAttribute('data-theme', 'ctr--tol--light');
  syncToggleState();
  refreshTokenGrid();
  refreshColorStrip();
  initSplitButtons();
  setTimeout(autoContrastPrimary, 100);

})();
