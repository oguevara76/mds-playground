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
        setTimeout(() => { refreshColorStrip(); refreshTokenGrid(); autoContrastPrimary(); }, 100);
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

  /* ── Init ── */
  document.documentElement.setAttribute('data-theme', 'ctr--tol--light');
  syncToggleState();
  refreshTokenGrid();
  refreshColorStrip();
  initSplitButtons();
  setTimeout(autoContrastPrimary, 100);

})();
