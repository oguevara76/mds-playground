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
      document.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.remove('active');
        p.hidden = false; /* clear any hidden attr left by showTokensView */
      });
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Form catalog interactions (radio + checkbox) ── */
  function setRadioChecked(optionEl, checked) {
    const radioEl = optionEl.querySelector('.p-radio');
    if (!radioEl) return;
    radioEl.classList.toggle('p-radio-checked', checked);
    radioEl.innerHTML = checked ? '<span class="p-radio-dot"></span>' : '';
    optionEl.setAttribute('aria-checked', checked ? 'true' : 'false');
  }

  function syncRadioTabIndices(groupEl) {
    groupEl.querySelectorAll('.js-radio-option').forEach(el => {
      el.tabIndex = el.getAttribute('aria-checked') === 'true' ? 0 : -1;
    });
  }

  document.querySelectorAll('[data-radio-group]').forEach(groupEl => {
    groupEl.querySelectorAll('.js-radio-option').forEach(optionEl => {
      optionEl.addEventListener('click', () => {
        groupEl.querySelectorAll('.js-radio-option').forEach(el => setRadioChecked(el, el === optionEl));
        syncRadioTabIndices(groupEl);
      });
    });

    groupEl.addEventListener('keydown', (e) => {
      const options = [...groupEl.querySelectorAll('.js-radio-option')];
      if (!options.length) return;
      const currentIndex = options.indexOf(document.activeElement);
      let nextIndex = currentIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % options.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = currentIndex < 0 ? options.length - 1 : (currentIndex - 1 + options.length) % options.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = options.length - 1;
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (currentIndex >= 0) {
          e.preventDefault();
          options[currentIndex].click();
        }
        return;
      } else {
        return;
      }

      options.forEach((el, i) => setRadioChecked(el, i === nextIndex));
      syncRadioTabIndices(groupEl);
      options[nextIndex].focus();
    });

    syncRadioTabIndices(groupEl);
  });

  function setCheckboxChecked(optionEl, checked) {
    const checkboxEl = optionEl.querySelector('.p-checkbox');
    if (!checkboxEl) return;
    checkboxEl.classList.toggle('p-checkbox-checked', checked);
    checkboxEl.innerHTML = checked ? '<i class="pi pi-check"></i>' : '';
    optionEl.setAttribute('aria-checked', checked ? 'true' : 'false');
  }

  document.querySelectorAll('.js-checkbox-option').forEach(optionEl => {
    optionEl.addEventListener('click', () => {
      const isChecked = optionEl.getAttribute('aria-checked') === 'true';
      setCheckboxChecked(optionEl, !isChecked);
    });

    optionEl.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        optionEl.click();
      }
    });
  });

  /* FloatLabel interactivo: refuerzo de estado “flotado” con valor (paridad PrimeNG) */
  function initLiveFloatLabels(scope) {
    const root = scope || document;
    root.querySelectorAll('#tab-form-catalog .p-floatlabel').forEach(wrap => {
      if (wrap.closest('.is-static-preview')) return;
      const input = wrap.querySelector('input.p-inputtext');
      if (!input || input.disabled || input.readOnly) return;

      const sync = () => {
        const hasValue = input.value.trim().length > 0;
        const focused = document.activeElement === input;
        if (hasValue || focused) wrap.classList.add('is-label-floated');
        else wrap.classList.remove('is-label-floated');
      };

      input.addEventListener('input', sync);
      input.addEventListener('focus', sync);
      input.addEventListener('blur', () => window.setTimeout(sync, 0));
      sync();
    });
  }

  initLiveFloatLabels(document);

  document.querySelectorAll('.input-variant-block').forEach(showcaseEl => {
    showcaseEl.querySelectorAll('.js-input-icon-toggle').forEach(toggleEl => {
      toggleEl.addEventListener('click', () => {
        const side = toggleEl.dataset.iconSide;
        const isOn = toggleEl.getAttribute('aria-pressed') === 'true';
        const next = !isOn;
        toggleEl.setAttribute('aria-pressed', next ? 'true' : 'false');
        const toggleKnob = toggleEl.querySelector('.p-toggle');
        if (toggleKnob) toggleKnob.classList.toggle('p-toggle-on', next);
        if (side === 'left') showcaseEl.classList.toggle('show-left-icon', next);
        if (side === 'right') showcaseEl.classList.toggle('show-right-icon', next);
      });
      toggleEl.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleEl.click();
        }
      });
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
    const theme = isDark ? 'dark' : 'light';
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
    const current = html.getAttribute('data-theme') || 'light';

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

    const lightRule = buildRule('light');
    const darkRule  = buildRule('dark');

    /* Restaurar el tema real antes de escribir el estilo */
    html.setAttribute('data-theme', current);

    let el = document.getElementById('auto-contrast');
    if (!el) {
      el = document.createElement('style');
      el.id = 'auto-contrast';
      document.head.appendChild(el);
    }
    el.textContent = lightRule + '\n' + darkRule;
    finalizeUserCssOrder();
  }

  function syncToggleState() {
    const hasAnyFile = Object.values(loadedSlots).some(v => v !== null);
    const hasLightSem = !!loadedSlots['semantic-light'];
    const hasDarkSem  = !!loadedSlots['semantic-dark'];
    const onlyDarkSem = hasDarkSem && !hasLightSem;
    const onlyLightSem = hasLightSem && !hasDarkSem;

    if (!hasAnyFile) {
      toggleTheme.disabled = false;
      toggleTheme.title = '';
      if (forcedDark) forcedDark = false;
      return;
    }

    if (onlyDarkSem) {
      /* Solo semantic-dark subido → oscuro fijo, toggle deshabilitado */
      toggleTheme.disabled = true;
      toggleTheme.title = 'Solo hay semántica oscura: el tema permanece en modo oscuro.';
      if (!isDark) {
        isDark = true;
        forcedDark = true;
        applyTheme();
      }
      return;
    }

    if (onlyLightSem) {
      /* Solo semantic-light subido → claro fijo, toggle deshabilitado */
      toggleTheme.disabled = true;
      toggleTheme.title = 'Solo hay semántica clara: el tema permanece en modo claro.';
      if (isDark) {
        isDark = false;
        applyTheme();
      }
      if (forcedDark) forcedDark = false;
      return;
    }

    /* Semántica light+dark, o ninguna semántica subida (p. ej. solo primitivos/componente: el core aporta ambos modos) */
    toggleTheme.disabled = false;
    toggleTheme.title = '';
    if (hasLightSem && hasDarkSem && forcedDark) {
      isDark = false;
      forcedDark = false;
      applyTheme();
    } else if (forcedDark && !hasDarkSem) {
      forcedDark = false;
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

  /* Orden en el DOM: prim → sem light → sem dark → comp, siempre delante de #auto-contrast */
  const USER_STYLE_IDS_ORDERED = [
    'user-primitives',
    'user-semantic-light',
    'user-semantic-dark',
    'user-components',
  ];

  function finalizeUserCssOrder() {
    const contrast = document.getElementById('auto-contrast');
    if (!contrast || !document.head.contains(contrast)) return;
    [...USER_STYLE_IDS_ORDERED].reverse().forEach(id => {
      const el = document.getElementById(id);
      if (el && document.head.contains(el)) document.head.insertBefore(el, contrast);
    });
  }

  /* ── Auto-detection of file type (alineado con css-import-normalize.js) ── */
  function detectSlot(css) {
    if (/html\[data-theme="light"\]/.test(css)) return 'semantic-light';
    if (/html\[data-theme="dark"\]/.test(css)) return 'semantic-dark';
    if (
      typeof window.CssImportNormalize !== 'undefined' &&
      typeof window.CssImportNormalize.looksLikeComponentsCss === 'function' &&
      window.CssImportNormalize.looksLikeComponentsCss(css)
    ) {
      return 'components';
    }
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
    const sorted = Array.from(files).sort((a, b) => a.name.localeCompare(b.name, 'es'));
    const readers = sorted.map(
      file =>
        new Promise((resolve, reject) => {
          const fr = new FileReader();
          fr.onload = () => resolve({ file, text: fr.result });
          fr.onerror = () => reject(new Error(file.name));
          fr.readAsText(file);
        })
    );

    Promise.all(readers)
      .then(entries => {
        /* Un solo pase: todos los slots se rellenan de forma determinista (nombre de fichero ordenado). */
        const bySlot = {};
        entries.forEach(({ file, text }) => {
          const raw = sanitizeCSS(String(text));
          const norm =
            typeof window.CssImportNormalize !== 'undefined'
              ? window.CssImportNormalize.normalizeUploaded(raw)
              : { ok: false, injects: [] };

          if (norm.ok && norm.injects && norm.injects.length) {
            norm.injects.forEach(({ slot, css }) => {
              bySlot[slot] = { fileName: file.name, css };
            });
          } else {
            const slot = detectSlot(raw);
            bySlot[slot] = { fileName: file.name, css: raw };
          }
        });

        /* Obligatorio: primitivos + al menos un semántico (tras fusionar con lo ya cargado) */
        const merged = { ...loadedSlots };
        Object.entries(bySlot).forEach(([slot, payload]) => {
          merged[slot] = payload;
        });
        const hasPrim = !!merged.primitives;
        const hasSem =
          !!merged['semantic-light'] || !!merged['semantic-dark'];
        if (!hasPrim || !hasSem) {
          if (!hasPrim && !hasSem) {
            showToast(
              'Subida no permitida: faltan primitivos y semántica (light u oscuro). Ambos son obligatorios.',
              'error'
            );
          } else if (!hasPrim) {
            showToast(
              'Subida no permitida: falta el fichero de primitivos (obligatorio).',
              'error'
            );
          } else {
            showToast(
              'Subida no permitida: falta semántica clara u oscura (al menos una es obligatoria).',
              'error'
            );
          }
          fileInput.value = '';
          return;
        }

        Object.entries(bySlot).forEach(([slot, payload]) => {
          loadedSlots[slot] = payload;
          injectSlot(slot, payload.css);
        });
        finalizeUserCssOrder();

        invalidateMdsCache(); /* uploaded file may override core vars — force re-parse */
        renderFileList();
        validateSlots();
        syncToggleState();
        const labels = Object.keys(bySlot)
          .sort()
          .map(s => SLOT_LABEL[s]);
        showToast(
          labels.length
            ? `✓ ${labels.join(' · ')} — ${entries.length} fichero(s)`
            : `✓ ${entries.length} fichero(s)`,
          'success'
        );
        setTimeout(
          () => {
            refreshColorStrip();
            refreshTokenGrid();
            autoContrastPrimary();
            if (tvIsActive) {
              if (tvMapMode) renderTvMap();
              else renderTvList(tvSearch.value);
            }
          },
          120
        );
      })
      .catch(() => {
        showToast('No se pudo leer uno de los ficheros', 'error');
      });
  }

  function sanitizeCSS(css) {
    return css
      .replace(/<script/gi, '/* removed script */')
      .replace(/expression\s*\(/gi, '/* removed expression */');
  }

  function injectSlot(slot, css) {
    const el = document.getElementById(SLOT_STYLE_ID[slot]);
    if (!el) return;
    const t = String(css || '').trim();
    /* Sin @layer: las mismas propiedades que el core/Prime ganan por orden (este bloque va tras los <link>). */
    el.textContent = t;
  }

  function removeAllSlots() {
    Object.keys(loadedSlots).forEach(slot => {
      loadedSlots[slot] = null;
      injectSlot(slot, '');
    });
    finalizeUserCssOrder();
    fileInput.value = '';
    invalidateMdsCache();
    renderFileList();
    validateSlots();
    syncToggleState();
    setTimeout(() => { refreshColorStrip(); refreshTokenGrid(); autoContrastPrimary(); if (tvIsActive) { if (tvMapMode) renderTvMap(); else renderTvList(tvSearch.value); } }, 120);
    showToast('Ficheros eliminados — tokens por defecto restaurados', 'info');
  }

  /* ── Obligatorio: primitivos + al menos un semántico. Componentes: opcional. ── */
  function validateSlots() {
    const hasAnyFile = Object.values(loadedSlots).some(v => v !== null);
    const hasPrim    = !!loadedSlots['primitives'];
    const hasSem     =
      !!loadedSlots['semantic-light'] || !!loadedSlots['semantic-dark'];

    if (!hasAnyFile) {
      uploadWarning.hidden = true;
      return;
    }

    let msg = null;
    if (!hasPrim) {
      msg =
        'Falta el fichero de primitivos (obligatorio). Añade también al menos un semántico (light y/o dark). Los componentes son opcionales.';
    } else if (!hasSem) {
      msg =
        'Falta la semántica: sube al menos light o dark (obligatorio). El fichero de componentes es opcional.';
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
    /* Use class removal — never touch .hidden on individual panels
       so the CSS-based .active system keeps working when we return */
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    navTokensLink.classList.add('active');
    renderTvList(tvSearch.value);
  }

  function hideTokensView() {
    tvIsActive = false;
    tokensView.hidden = true;
    previewTabsEl.hidden = false;
    /* Restore active class on the currently selected tab's panel */
    const activeTab = document.querySelector('.preview-tab.active');
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.hidden = false;
      p.classList.remove('active');
    });
    if (activeTab) {
      const panel = document.getElementById('tab-' + activeTab.dataset.tab);
      if (panel) panel.classList.add('active');
    }
    navTokensLink.classList.remove('active');
  }

  navTokensLink.addEventListener('click', e => {
    e.preventDefault();
    if (tvIsActive) return; // ya estamos en la vista, no hacer nada
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
    /* Dimension tokens (spacing/radius) get their own group */
    if (/^--dimension-spacing/.test(name)) return 'Spacing';
    if (/^--dimension-radius/.test(name))  return 'Radius';
    /* Strip optional --p- prefix, then read first word segment */
    const n = name.startsWith('--p-') ? name.slice(4) : name.slice(2);
    const m = n.match(/^([\w]+)/);
    if (!m) return 'Otros';
    const key = m[1].toLowerCase();
    const LABELS = {
      primary:'Primary', surface:'Surface',
      gray:'Gray', grey:'Grey', slate:'Slate', zinc:'Zinc',
      neutral:'Neutral', stone:'Stone',
      red:'Red', orange:'Orange', amber:'Amber', yellow:'Yellow',
      lime:'Lime', green:'Green', emerald:'Emerald', teal:'Teal',
      cyan:'Cyan', sky:'Sky', blue:'Blue', indigo:'Indigo',
      violet:'Violet', purple:'Purple', fuchsia:'Fuchsia', pink:'Pink', rose:'Rose',
    };
    return LABELS[key] || (key[0].toUpperCase() + key.slice(1));
  }

  /* ── Extract the first var() reference from a CSS value string ── */
  function extractVarRef(value) {
    if (!value) return null;
    const m = (value + '').match(/var\((--[\w-]+)/);
    return m ? m[1] : null;
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
  /* Color palettes come first; non-color groups (Spacing, Radius) are always last. */
  const PALETTE_TAIL = new Set(['Spacing', 'Radius']);
  function groupByPalette(vars) {
    const map = new Map();
    vars.forEach(({ name, value }) => {
      const pal = primPalette(name);
      if (!map.has(pal)) map.set(pal, []);
      map.get(pal).push({ name, label: name.replace(/^--/, ''), type: inferTokenType(value), value });
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => {
        const aT = PALETTE_TAIL.has(a) ? 1 : 0;
        const bT = PALETTE_TAIL.has(b) ? 1 : 0;
        return aT - bT; // color groups keep insertion order; tail groups sink to end
      })
      .map(([label, tokens]) => ({ label, tokens }));
  }

  /* ── Group an array of {name,value} into sub-groups by component ── */
  function groupByComponent(vars) {
    const map = new Map();
    vars.forEach(({ name, value }) => {
      const comp = compLabel(name);
      if (!map.has(comp)) map.set(comp, []);
      map.get(comp).push({ name, label: name.replace(/^--/, ''), type: inferTokenType(value), value });
    });
    return Array.from(map.entries()).map(([label, tokens]) => ({ label, tokens }));
  }

  /* ── MDS core variables — sourced from the pre-parsed mds-vars-data.js catalogue.
     MDS_VARS is a global injected by that script (loaded before app.js in index.html).
     We clone it once on first call and cache the result. ── */
  let mdsVarsCache = null;

  function readMdsCoreVars() {
    if (mdsVarsCache) return mdsVarsCache;

    /* Primary: use the embedded catalogue (always synchronous, works on file://) */
    if (typeof MDS_VARS !== 'undefined' &&
        (MDS_VARS.prim.length || MDS_VARS.light.length || MDS_VARS.dark.length || MDS_VARS.comp.length)) {
      mdsVarsCache = {
        prim:  MDS_VARS.prim.slice(),
        light: MDS_VARS.light.slice(),
        dark:  MDS_VARS.dark.slice(),
        comp:  MDS_VARS.comp.slice(),
      };
      return mdsVarsCache;
    }

    /* Fallback: try sheet.cssRules (same-origin HTTP dev server) */
    const buckets = { prim: [], light: [], dark: [], comp: [] };
    const seen    = { prim: new Set(), light: new Set(), dark: new Set(), comp: new Set() };
    for (const sheet of document.styleSheets) {
      try {
        const href = (sheet.href || '').toLowerCase();
        let bKey = null;
        if      (href.includes('mds-primitives'))     bKey = 'prim';
        else if (href.includes('mds-semantic-light')) bKey = 'light';
        else if (href.includes('mds-semantic-dark'))  bKey = 'dark';
        else if (href.includes('mds-components'))     bKey = 'comp';
        else continue;
        for (const rule of sheet.cssRules) {
          const txt = rule.cssText || '';
          const re  = /(--[\w-]+)\s*:\s*([^;}\n]+)/g;
          let m;
          while ((m = re.exec(txt)) !== null) {
            const name = m[1].trim(), value = m[2].trim();
            if (!seen[bKey].has(name)) { seen[bKey].add(name); buckets[bKey].push({ name, value }); }
          }
        }
      } catch (e) {}
    }
    const total = buckets.prim.length + buckets.light.length + buckets.dark.length + buckets.comp.length;
    if (total > 0) { mdsVarsCache = buckets; return buckets; }

    return { prim: [], light: [], dark: [], comp: [] };
  }

  /* Parse all --var: value pairs out of a raw CSS string (used for uploaded files) */
  function parseCssVarsText(text) {
    const re = /(--[\w-]+)\s*:\s*([^;}\n]+)/g;
    const seen = new Set(), vars = [];
    let m;
    while ((m = re.exec(text)) !== null) {
      const name = m[1].trim(), value = m[2].trim();
      if (!seen.has(name)) { seen.add(name); vars.push({ name, value }); }
    }
    return vars;
  }

  /* Invalidate cache when user uploads custom CSS so next read re-evaluates */
  function invalidateMdsCache() { mdsVarsCache = null; }

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

  /* Merge an uploaded CSS string's variable overrides into a base var array.
     All variables from base are preserved; uploaded values replace matching ones;
     any new names in the upload are appended at the end. */
  function mergeUploadedVars(base, uploadedCss) {
    const overrides = new Map(parseCssVarsText(uploadedCss).map(v => [v.name, v.value]));
    const merged    = base.map(v => overrides.has(v.name) ? { name: v.name, value: overrides.get(v.name) } : v);
    const baseNames = new Set(merged.map(v => v.name));
    parseCssVarsText(uploadedCss).forEach(v => { if (!baseNames.has(v.name)) merged.push(v); });
    return merged;
  }

  function buildSectionsFromSlots() {
    /* Always start from the full MDS_VARS catalogue so every variable is visible.
       Uploaded files only override the *values* of matching variables. */
    const base     = readMdsCoreVars();
    const sections = [];

    /* ── Primitivos ── */
    {
      const vars      = loadedSlots.primitives
        ? mergeUploadedVars(base.prim, loadedSlots.primitives.css)
        : base.prim.slice();
      const subGroups = groupByPalette(vars);
      if (subGroups.length) sections.push({ id:'primitivos', label:'Primitivos', cls:'tva-prim', subGroups });
    }

    /* ── Semánticos — only the active mode ── */
    const semSubs   = [];
    const activeSlot  = isDark ? 'semantic-dark'  : 'semantic-light';
    const activeMode  = isDark ? 'dark'            : 'light';
    const activeTheme = isDark ? 'dark'  : 'light';
    {
      const baseVars = (isDark ? base.dark : base.light).slice();
      const vars     = loadedSlots[activeSlot]
        ? mergeUploadedVars(baseVars, loadedSlots[activeSlot].css)
        : baseVars;
      if (vars.length) {
        const tokens = vars.map(({ name, value }) => ({ name, label: name.replace(/^--/, ''), type: inferTokenType(value), value }));
        semSubs.push({ label: activeMode === 'light' ? 'Light' : 'Dark', mode: activeMode, theme: activeTheme, tokens });
      }
    }
    if (semSubs.length) sections.push({ id:'semanticos', label: isDark ? 'Semánticos - Dark' : 'Semánticos - Light', cls:'tva-sem', subGroups: semSubs });

    /* ── Componentes ── */
    {
      const vars      = loadedSlots.components
        ? mergeUploadedVars(base.comp, loadedSlots.components.css)
        : base.comp.slice();
      const subGroups = groupByComponent(vars);
      if (subGroups.length) sections.push({ id:'componentes', label:'Componentes', cls:'tva-comp', subGroups });
    }

    return sections;
  }

  function buildSectionsFromDocument() {
    const { prim, light, dark, comp } = readMdsCoreVars();
    const total = prim.length + light.length + dark.length + comp.length;
    if (!total) return buildFallbackSections();

    const sections = [];

    /* Primitivos — grouped by palette */
    const primSubs = groupByPalette(prim);
    if (primSubs.length) sections.push({ id:'primitivos', label:'Primitivos', cls:'tva-prim', subGroups: primSubs });

    /* Semánticos — only the active mode */
    const semSubs = [];
    const activeSemData  = isDark ? dark  : light;
    const activeSemMode  = isDark ? 'dark'           : 'light';
    const activeSemTheme = isDark ? 'dark' : 'light';
    if (activeSemData.length) {
      const tokens = activeSemData.map(({ name, value }) => ({ name, label: name.replace(/^--/, ''), type: inferTokenType(value), value }));
      semSubs.push({ label: activeSemMode === 'light' ? 'Light' : 'Dark', mode: activeSemMode, theme: activeSemTheme, tokens });
    }
    if (semSubs.length) sections.push({ id:'semanticos', label: isDark ? 'Semánticos - Dark' : 'Semánticos - Light', cls:'tva-sem', subGroups: semSubs });

    /* Componentes — grouped by component name */
    const compSubs = groupByComponent(comp);
    if (compSubs.length) sections.push({ id:'componentes', label:'Componentes', cls:'tva-comp', subGroups: compSubs });

    return sections;
  }

  function buildFallbackSections() {
    const primSubs = [], semSubs = [], compSubs = [];
    TOKEN_CATALOG.forEach(g => {
      if (g.id.startsWith('prim'))       primSubs.push({ label: g.label.replace('Primitivos — ',''),  tokens: g.tokens });
      else if (g.id.startsWith('sem'))   semSubs.push({ label: g.label.replace('Semánticos — ',''),   mode:'light', theme:'light', tokens: g.tokens });
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
    /* Value column always shows the raw CSS reference (var(--x) or literal) */
    val = t.value || '—';
    if (t.type === 'color') {
      /* Swatch: use batch-resolved hex for accurate theme color, else var(--name) */
      const r   = resolved ? resolved[t.name] : null;
      const rgb = r ? r.rgb : resolveColor(t.name);
      const hex = r ? r.hex : rgbToHex(rgb);
      const dk  = r ? r.dk  : isDarkColor(rgb);
      const bg  = (r && hex) ? '#' + hex : `var(${t.name})`;
      sw = `<span class="tva-sw${dk ? ' dk' : ''}" style="background:${bg}"></span>`;
    } else {
      /* Dimension / spacing / radius tokens get a ruler mark; typography keeps "Aa" */
      const isDim = /dimension|spacing|radius/i.test(t.name);
      sw = isDim
        ? `<span class="tva-sw tva-sw-dim"></span>`
        : `<span class="tva-sw tva-sw-text">Aa</span>`;
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

        /* Semantic sub-groups (sg.mode set) skip the inner band — the mode
           label is already in the section title ("Semánticos - Light / Dark"). */
        const mCls  = sg.mode ? ` tva-sg-${sg.mode}` : '';
        const hdrHtml = sg.mode ? '' :
          `<div class="tva-sg-hdr">${sg.label}<span class="tva-sg-count">${sg.tokens.length}</span></div>`;

        return `<div class="tva-subgroup${mCls}">
          ${hdrHtml}${rowsHtml}
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

  /* ════════════════════════════════════════════════════════════
     VARIABLE VISUALIZER MAP
     ════════════════════════════════════════════════════════════ */

  /* Zoom + pan state (persists across re-renders) */
  let vvZoom = 1;
  let vvPan  = { x: 40, y: 40 };
  const VV_ZOOM_MIN = 0.2, VV_ZOOM_MAX = 2.5, VV_ZOOM_STEP = 0.12;

  /* Panel position store (world coords, persist across re-renders) */
  /* Default world-space positions for the three main columns.
     Primitivos | ← 260 px gap → | Semánticos | ← 260 px gap → | Componentes grid
     (gap is measured between right edge of one panel and left edge of the next) */
  const VV_DEFAULT_POS = {
    prim: { x: 40,  y: 40 },
    sem:  { x: 590, y: 40 },   // 590-(40+290) = 260 px gap after prim
    comp: { x: 1140, y: 40 },  // 1140-(590+290) = 260 px gap after sem
  };
  const vvPosStore = {
    prim: { ...VV_DEFAULT_POS.prim },
    sem:  { ...VV_DEFAULT_POS.sem  },
    comp: { ...VV_DEFAULT_POS.comp },
  };

  /* Per-component-panel positions — key: 'comp-button', 'comp-accordion', etc.
     Populated with a grid layout on first render; preserved across re-renders
     so user-dragged positions survive theme switches and search refreshes. */
  const vvCompPosStore = new Map();

  /* Component panel layout constants */
  const COMP_PANEL_W   = 215;
  const COMP_PANEL_GAP = 60;   // horizontal gap between columns
  const COMP_ROW_GAP   = 40;   // vertical gap between stacked panels (enforced by vvRestack)
  const COMP_COLS      = 10;

  /* Assigns each panel to a column (round-robin across 10 cols).
     Only x and col are meaningful here; the real y values are set by vvRestack()
     after the DOM is rendered and actual heights are measurable.             */
  function computeCompGridPositions(compGroups, baseX, baseY) {
    const colTokenCount = Array(COMP_COLS).fill(0); // use token count as proxy for height

    return compGroups.map(([, tokens]) => {
      /* Place in the column with fewest tokens so far (balances heights) */
      const col = colTokenCount.indexOf(Math.min(...colTokenCount));
      colTokenCount[col] += tokens.length;
      return {
        x:   baseX + col * (COMP_PANEL_W + COMP_PANEL_GAP),
        y:   baseY,   // placeholder — vvRestack() sets the real y
        col,
      };
    });
  }

  /* After the DOM is painted, measure each comp panel's real offsetHeight and
     restack every column so the gap between panels is exactly COMP_ROW_GAP.  */
  function vvRestack() {
    /* Group panel elements by their assigned column */
    const cols = new Map(); // col → [{ key, el }]

    document.querySelectorAll('#vv-canvas .vv-panel-comp').forEach(el => {
      const hdr = el.querySelector('[data-drag]');
      if (!hdr) return;
      const key    = hdr.dataset.drag;
      const stored = vvCompPosStore.get(key);
      if (!stored || stored.col === undefined) return;
      if (!cols.has(stored.col)) cols.set(stored.col, []);
      cols.get(stored.col).push({ key, el });
    });

    /* Restack each column top-to-bottom using real heights */
    cols.forEach(panels => {
      /* Keep panels in the order they were inserted (top → bottom) */
      panels.sort((a, b) => (vvCompPosStore.get(a.key)?.y ?? 0) - (vvCompPosStore.get(b.key)?.y ?? 0));

      let y = vvPosStore.comp.y;
      panels.forEach(({ key, el }) => {
        const stored = vvCompPosStore.get(key);
        vvCompPosStore.set(key, { ...stored, y });
        el.style.top = y + 'px';
        y += el.offsetHeight + COMP_ROW_GAP;
      });
    });

    requestAnimationFrame(vvDrawLines);
  }

  /* Active map interaction state */
  let vvInteraction     = null;   // { type:'drag'|'pan', ... }
  let vvConnData        = { semRefMap: new Map(), compRefMap: new Map(), primSet: new Set(), semSet: new Set() };
  let vvSelectedVar     = null;   // currently selected variable name (or null)
  let vvClickSuppressed = false;  // set true after a drag so the click event is ignored
  let vvMapSearchQuery  = '';     // current map-search string (persists across re-renders)

  function renderTvMap() {
    const sections = buildSections();
    const primSec  = sections.find(s => s.id === 'primitivos');
    const semSec   = sections.find(s => s.id === 'semanticos');
    const compSec  = sections.find(s => s.id === 'componentes');

    /* ── Flatten all vars ── */
    const allPrimVars = primSec ? primSec.subGroups.flatMap(sg => sg.tokens) : [];
    const allSemVars  = semSec  ? semSec.subGroups.flatMap(sg => sg.tokens)  : [];
    const allCompVars = compSec ? compSec.subGroups.flatMap(sg => sg.tokens) : [];
    const semTheme    = semSec?.subGroups[0]?.theme ?? null;

    const primSet = new Set(allPrimVars.map(t => t.name));
    const semSet  = new Set(allSemVars.map(t => t.name));

    /* ── Build connection maps ── */
    /* sem → prim: first var() ref that points to a known primitive */
    const semRefMap  = new Map(); // semName → primName
    allSemVars.forEach(t => {
      const ref = extractVarRef(t.value);
      if (ref && primSet.has(ref)) semRefMap.set(t.name, ref);
    });
    /* comp → sem or prim */
    const compRefMap = new Map(); // compVarName → refName
    allCompVars.forEach(t => {
      const ref = extractVarRef(t.value);
      if (ref && (semSet.has(ref) || primSet.has(ref))) compRefMap.set(t.name, ref);
    });

    /* ── Persist connection data for selection logic ── */
    vvConnData = { semRefMap, compRefMap, primSet, semSet };

    /* ── Filter to connected vars only ── */
    const connPrimNames = new Set(semRefMap.values());
    const connSemNames  = new Set([
      ...semRefMap.keys(),
      ...[...compRefMap.values()].filter(r => semSet.has(r)),
    ]);
    const filteredPrims = allPrimVars.filter(t => connPrimNames.has(t.name));
    const filteredSems  = allSemVars.filter(t => connSemNames.has(t.name));
    const filteredComps = allCompVars.filter(t => compRefMap.has(t.name));

    /* ── Color resolution for semantics ── */
    const semResolved = semTheme ? batchResolve(filteredSems, semTheme) : null;

    /* ── Group connected comp vars by component label ── */
    const compGroupMap = new Map();
    filteredComps.forEach(t => {
      const grp = compLabel(t.name);
      if (!compGroupMap.has(grp)) compGroupMap.set(grp, []);
      compGroupMap.get(grp).push(t);
    });
    const compGroups = [...compGroupMap.entries()]; // [[label, tokens[]], ...]

    /* ── Swatch helper (same logic as list view) ── */
    function swHtml(name, type, resolvedMap) {
      if (type === 'color') {
        const r   = resolvedMap ? resolvedMap[name] : null;
        const rgb = r ? null : resolveColor(name);
        const hex = r ? r.hex : rgbToHex(rgb || '');
        const dk  = r ? r.dk  : isDarkColor(rgb || '');
        const bg  = hex ? '#' + hex : `var(${name})`;
        return `<span class="vv-sw${dk ? ' dk' : ''}" style="background:${bg}"></span>`;
      }
      const isDim = /dimension|spacing|radius/i.test(name);
      return isDim
        ? `<span class="vv-sw vv-sw-dim"></span>`
        : `<span class="vv-sw vv-sw-text">Aa</span>`;
    }

    /* ── Row builder: data-var + data-vtype for selection ── */
    function mkRow(t, vtype, leftRef, resolvedMap) {
      const sw = swHtml(t.name, t.type, resolvedMap);
      const ld = leftRef
        ? `<span class="vv-dot vv-dot-l" data-cref="${leftRef}"></span>`
        : `<span class="vv-dot-sp"></span>`;
      const rd = vtype !== 'comp'
        ? `<span class="vv-dot vv-dot-r" data-sdot="${t.name}"></span>`
        : '';
      return `<div class="vv-row" data-var="${t.name}" data-vtype="${vtype}">
        ${ld}${sw}<span class="vv-name">${t.label.replace(/^p-/, '')}</span>${rd}
      </div>`;
    }

    /* ── Primitivos panel body (only connected prims) ── */
    const primBody = filteredPrims.length
      ? filteredPrims.map(t => mkRow(t, 'prim', null, null)).join('')
      : '<p class="vv-empty">Sin conexiones</p>';

    /* ── Semánticos panel body (only connected sems) ── */
    const semBody = filteredSems.length
      ? filteredSems.map(t => mkRow(t, 'sem', semRefMap.get(t.name) ?? null, semResolved)).join('')
      : '<p class="vv-empty">Sin conexiones</p>';

    /* ── Component panels: one box per component, individually positioned ── */
    /* Compute grid layout for panels not yet positioned by the user */
    const gridPos = computeCompGridPositions(compGroups, vvPosStore.comp.x, vvPosStore.comp.y);
    const compPanelsHtml = compGroups.map(([grpLabel, tokens], i) => {
      const safeId   = grpLabel.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const storeKey = 'comp-' + safeId;
      /* First render for this panel → assign grid position */
      if (!vvCompPosStore.has(storeKey)) vvCompPosStore.set(storeKey, gridPos[i]);
      const pos  = vvCompPosStore.get(storeKey);
      const body = tokens.map(t => mkRow(t, 'comp', compRefMap.get(t.name) ?? null, null)).join('');
      return `<div class="vv-panel vv-panel-comp" id="vv-comp-${safeId}" style="left:${pos.x}px;top:${pos.y}px">
        <div class="vv-phdr vv-phdr-sm" data-drag="comp-${safeId}">
          ${grpLabel}<span class="vv-pc">${tokens.length}</span>
        </div>
        <div class="vv-pbody-fit">${body}</div>
      </div>`;
    }).join('');

    /* ── Layout positions ── */
    const pp = vvPosStore.prim;
    const sp = vvPosStore.sem;

    /* ── Render ── */
    tvMapArea.innerHTML = `
      <div class="vv-toolbar" id="vv-toolbar">
        <div class="vv-zoom-group">
          <button class="vv-zbtn" id="vv-zoom-out" title="Alejar">−</button>
          <span class="vv-zlabel" id="vv-zlabel">${Math.round(vvZoom * 100)}%</span>
          <button class="vv-zbtn" id="vv-zoom-in" title="Acercar">+</button>
        </div>
        <button class="vv-zbtn vv-reset" id="vv-zoom-reset" title="Restablecer vista">↺ Reset</button>
        <div class="vv-msearch-wrap" id="vv-msearch-wrap">
          <i class="pi pi-search vv-msearch-icon"></i>
          <input class="vv-msearch-input" id="vv-msearch"
            type="search" placeholder="Buscar variable…" autocomplete="off"
            value="${vvMapSearchQuery.replace(/"/g, '&quot;')}">
          <button class="vv-msearch-clear" id="vv-msearch-clear"
            title="Limpiar"${vvMapSearchQuery ? '' : ' hidden'}>✕</button>
        </div>
        <span class="vv-hint">Scroll = zoom · Arrastra panel = mover · Clic = seleccionar</span>
      </div>
      <div class="vv-canvas" id="vv-canvas">
        <div class="vv-world" id="vv-world" style="transform:translate(${vvPan.x}px,${vvPan.y}px) scale(${vvZoom});transform-origin:0 0;">
          <!-- bg SVG: default/dimmed lines, sits BEHIND the panels -->
          <svg id="vv-svg-bg" style="position:absolute;top:0;left:0;pointer-events:none;z-index:1;overflow:visible;" width="1" height="1"></svg>
          <!-- fg SVG: highlighted lines (selection / search), sits IN FRONT of panels -->
          <svg id="vv-svg-fg" style="position:absolute;top:0;left:0;pointer-events:none;z-index:50;overflow:visible;" width="1" height="1"></svg>

          <!-- Primitivos: only prims referenced by at least one semantic -->
          <div class="vv-panel vv-panel-fit" id="vv-prim" style="left:${pp.x}px;top:${pp.y}px">
            <div class="vv-phdr" data-drag="prim">
              <i class="pi pi-box"></i> Primitivos
              <span class="vv-pc">${filteredPrims.length}</span>
            </div>
            <div class="vv-pbody-fit">${primBody}</div>
          </div>

          <!-- Semánticos: only sems that reference a prim or are referenced by a comp -->
          <div class="vv-panel vv-panel-fit" id="vv-sem" style="left:${sp.x}px;top:${sp.y}px">
            <div class="vv-phdr" data-drag="sem">
              <i class="pi pi-sliders-h"></i> Semánticos
              <span class="vv-pc">${filteredSems.length}</span>
            </div>
            <div class="vv-pbody-fit">${semBody}</div>
          </div>

          <!-- Component panels: each one is absolutely positioned and individually draggable -->
          ${compPanelsHtml}
        </div>
      </div>`;

    /* Reset selection on every re-render */
    vvSelectedVar = null;

    initVvInteract();
    /* Two rAF ticks: first lets the browser paint, second measures real heights */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      vvRestack();   // restack with actual offsetHeights → exact 40 px gaps
    }));
  }

  /* ── Apply world transform ── */
  function applyVvTransform() {
    const world = document.getElementById('vv-world');
    if (!world) return;
    world.style.transform = `translate(${vvPan.x}px,${vvPan.y}px) scale(${vvZoom})`;
    const lbl = document.getElementById('vv-zlabel');
    if (lbl) lbl.textContent = Math.round(vvZoom * 100) + '%';
  }

  /* ── All map interactions: zoom, pan, panel drag, click-to-select ── */
  function initVvInteract() {
    const canvas = document.getElementById('vv-canvas');
    if (!canvas) return;

    /* ── Zoom buttons ── */
    document.getElementById('vv-zoom-in')?.addEventListener('click', () => {
      vvZoom = Math.min(VV_ZOOM_MAX, +(vvZoom + VV_ZOOM_STEP).toFixed(2));
      applyVvTransform(); requestAnimationFrame(vvDrawLines);
    });
    document.getElementById('vv-zoom-out')?.addEventListener('click', () => {
      vvZoom = Math.max(VV_ZOOM_MIN, +(vvZoom - VV_ZOOM_STEP).toFixed(2));
      applyVvTransform(); requestAnimationFrame(vvDrawLines);
    });
    document.getElementById('vv-zoom-reset')?.addEventListener('click', () => {
      /* Reset zoom + pan */
      vvZoom = 1; vvPan = { x: 40, y: 40 };
      /* Reset all panel positions to the default grid layout */
      vvPosStore.prim = { ...VV_DEFAULT_POS.prim };
      vvPosStore.sem  = { ...VV_DEFAULT_POS.sem  };
      vvPosStore.comp = { ...VV_DEFAULT_POS.comp };
      vvCompPosStore.clear();
      /* Re-render so comp panels are repositioned from scratch */
      renderTvMap();
    });

    /* ── Scroll-wheel zoom centred on cursor ── */
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const delta   = e.deltaY < 0 ? VV_ZOOM_STEP : -VV_ZOOM_STEP;
      const newZoom = Math.min(VV_ZOOM_MAX, Math.max(VV_ZOOM_MIN, +(vvZoom + delta).toFixed(2)));
      if (newZoom === vvZoom) return;
      const cRect = canvas.getBoundingClientRect();
      const mx    = e.clientX - cRect.left, my = e.clientY - cRect.top;
      const scale = newZoom / vvZoom;
      vvPan.x = mx - scale * (mx - vvPan.x);
      vvPan.y = my - scale * (my - vvPan.y);
      vvZoom  = newZoom;
      applyVvTransform(); requestAnimationFrame(vvDrawLines);
    }, { passive: false });

    /* ── Mouse down: panel/column drag vs canvas pan ── */
    canvas.addEventListener('mousedown', e => {
      const hdr = e.target.closest('[data-drag]');
      if (hdr) {
        const key       = hdr.dataset.drag;
        const draggable = hdr.closest('.vv-panel');
        if (!draggable) return;
        e.preventDefault();
        /* Comp panels use vvCompPosStore; prim/sem use vvPosStore */
        const isComp = key.startsWith('comp-');
        const orig   = isComp
          ? (vvCompPosStore.get(key) ?? { x: 0, y: 0 })
          : (vvPosStore[key]         ?? { x: 0, y: 0 });
        vvInteraction = {
          type: 'drag', draggable, key, moved: false, isComp,
          startCX: e.clientX, startCY: e.clientY,
          origX: orig.x, origY: orig.y,
        };
        draggable.classList.add('vv-dragging');
      } else if (!e.target.closest('.vv-pbody-fit, .vv-panel-body')) {
        /* Canvas pan — ignore clicks inside scrollable bodies */
        e.preventDefault();
        vvInteraction = {
          type: 'pan', moved: false,
          startCX: e.clientX, startCY: e.clientY,
          panOffX: e.clientX - vvPan.x, panOffY: e.clientY - vvPan.y,
        };
        canvas.classList.add('is-panning');
      }
    });

    document.addEventListener('mousemove', e => {
      if (!vvInteraction) return;
      /* Track whether the pointer actually moved (to distinguish drag from click) */
      if (!vvInteraction.moved) {
        if (Math.abs(e.clientX - vvInteraction.startCX) > 3 ||
            Math.abs(e.clientY - vvInteraction.startCY) > 3) {
          vvInteraction.moved = true;
        }
      }
      if (vvInteraction.type === 'drag') {
        const nx  = vvInteraction.origX + (e.clientX - vvInteraction.startCX) / vvZoom;
        const ny  = vvInteraction.origY + (e.clientY - vvInteraction.startCY) / vvZoom;
        const key = vvInteraction.key;
        /* Write position back to the right store */
        if (vvInteraction.isComp) vvCompPosStore.set(key, { x: nx, y: ny });
        else                      vvPosStore[key] = { x: nx, y: ny };
        vvInteraction.draggable.style.left = nx + 'px';
        vvInteraction.draggable.style.top  = ny + 'px';
        requestAnimationFrame(vvDrawLines);
      } else if (vvInteraction.type === 'pan') {
        vvPan.x = e.clientX - vvInteraction.panOffX;
        vvPan.y = e.clientY - vvInteraction.panOffY;
        applyVvTransform(); requestAnimationFrame(vvDrawLines);
      }
    });

    document.addEventListener('mouseup', () => {
      if (!vvInteraction) return;
      /* If the pointer moved, suppress the upcoming click event */
      if (vvInteraction.moved) vvClickSuppressed = true;
      if (vvInteraction.type === 'drag') {
        vvInteraction.draggable.classList.remove('vv-dragging');
      } else {
        document.getElementById('vv-canvas')?.classList.remove('is-panning');
      }
      vvInteraction = null;
    });

    /* ── Click: select variable or deselect ── */
    canvas.addEventListener('click', e => {
      if (vvClickSuppressed) { vvClickSuppressed = false; return; }
      const row = e.target.closest('.vv-row[data-var]');
      if (row) {
        vvSelectVar(row.dataset.var);
      } else if (!e.target.closest('.vv-panel')) {
        /* Clicked on canvas background — clear selection */
        vvDeselect();
      }
    });

    /* ── Map search: highlight rows whose var name matches the query ── */
    const msInput = document.getElementById('vv-msearch');
    const msClear = document.getElementById('vv-msearch-clear');
    if (msInput) {
      /* Re-apply persisted search state on every render */
      if (vvMapSearchQuery) applyVvSearch(vvMapSearchQuery);

      msInput.addEventListener('input', () => {
        vvMapSearchQuery = msInput.value.trim();
        msClear.hidden   = !vvMapSearchQuery;
        applyVvSearch(vvMapSearchQuery);
      });
      msClear.addEventListener('click', () => {
        msInput.value    = '';
        vvMapSearchQuery = '';
        msClear.hidden   = true;
        applyVvSearch('');
        msInput.focus();
      });
      /* Escape key clears the search */
      msInput.addEventListener('keydown', e => {
        if (e.key === 'Escape') msClear.click();
      });
    }
  }

  /* ── Apply map-search highlighting (query = '' clears it) ── */
  function applyVvSearch(q) {
    const world = document.getElementById('vv-world');
    if (!world) return;
    const lq = q.toLowerCase();
    if (!lq) {
      world.removeAttribute('data-search');
      world.querySelectorAll('[data-smatch]').forEach(el => el.removeAttribute('data-smatch'));
    } else {
      world.setAttribute('data-search', '1');

      /* Step 1: direct name matches */
      const directHits = new Set();
      world.querySelectorAll('[data-var]').forEach(row => {
        const matches = row.dataset.var.toLowerCase().includes(lq);
        row.toggleAttribute('data-smatch', matches);
        if (matches) directHits.add(row.dataset.var);
      });

      /* Step 2: build the full set of vars that should be highlighted.
         A connector is only drawn highlighted when BOTH endpoints are in this set,
         so we must include every node reachable from a direct hit in both directions. */
      const { semRefMap, compRefMap, primSet, semSet } = vvConnData;
      const allHits = new Set(directHits);

      /* For each direct hit, propagate along every connected edge */
      directHits.forEach(name => {
        if (primSet.has(name)) {
          /* prim → mark sems that reference it, then their comps */
          semRefMap.forEach((primRef, semName) => {
            if (primRef !== name) return;
            allHits.add(semName);
            compRefMap.forEach((ref, compName) => {
              if (ref === semName) allHits.add(compName);
            });
          });
          /* prim → mark comps that reference it directly */
          compRefMap.forEach((ref, compName) => {
            if (ref === name) allHits.add(compName);
          });
        } else if (semSet.has(name)) {
          /* sem → mark its referenced prim */
          const primRef = semRefMap.get(name);
          if (primRef) allHits.add(primRef);
          /* sem → mark comps that reference it */
          compRefMap.forEach((ref, compName) => {
            if (ref === name) allHits.add(compName);
          });
        } else {
          /* comp → mark its referenced sem/prim, and that sem's prim */
          const ref = compRefMap.get(name);
          if (ref) {
            allHits.add(ref);
            const primRef = semRefMap.get(ref);
            if (primRef) allHits.add(primRef);
          }
        }
      });

      /* Apply data-smatch to all reachable rows — iterate instead of using CSS.escape
         because variable names start with '--' which CSS.escape would corrupt */
      world.querySelectorAll('[data-var]').forEach(row => {
        row.toggleAttribute('data-smatch', allHits.has(row.dataset.var));
      });
    }
    requestAnimationFrame(vvDrawLines);
  }

  /* ── Draw bezier connection lines ──────────────────────────────────────────
     Two SVG layers:
       #vv-svg-bg  (z-index 1)  — default/dimmed lines, behind panels
       #vv-svg-fg  (z-index 50) — highlighted lines (selection / search), in front
     ─────────────────────────────────────────────────────────────────────── */
  function vvDrawLines() {
    const svgBg  = document.getElementById('vv-svg-bg');
    const svgFg  = document.getElementById('vv-svg-fg');
    const canvas = document.getElementById('vv-canvas');
    if (!svgBg || !svgFg || !canvas) return;

    const canvasR = canvas.getBoundingClientRect();
    const hlVars  = vvSelectedVar ? vvBuildHlSet(vvSelectedVar) : null;
    const hasSel  = !!hlVars;

    /* Search mode: collect matched var names */
    const world = document.getElementById('vv-world');
    const hasSearch  = !hasSel && world?.hasAttribute('data-search');
    const searchHits = hasSearch
      ? new Set([...world.querySelectorAll('[data-var][data-smatch]')].map(el => el.dataset.var))
      : null;

    function toWorld(cx, cy) {
      return {
        x: (cx - canvasR.left - vvPan.x) / vvZoom,
        y: (cy - canvasR.top  - vvPan.y) / vvZoom,
      };
    }
    function dotWorld(el) {
      const r = el.getBoundingClientRect();
      return toWorld((r.left + r.right) / 2, (r.top + r.bottom) / 2);
    }

    /* Build right-dot index by var name */
    const rdMap = {};
    document.querySelectorAll('#vv-canvas .vv-dot-r[data-sdot]').forEach(d => { rdMap[d.dataset.sdot] = d; });

    let bgPaths = '', fgPaths = '';

    document.querySelectorAll('#vv-canvas .vv-dot-l[data-cref]').forEach(cd => {
      const sd = rdMap[cd.dataset.cref];
      if (!sd) return;

      const cdR = cd.getBoundingClientRect();
      const sdR = sd.getBoundingClientRect();
      const visible = r =>
        r.right  > canvasR.left && r.left   < canvasR.right &&
        r.bottom > canvasR.top  && r.top    < canvasR.bottom;
      if (!visible(cdR) && !visible(sdR)) return;

      const srcVar = sd.dataset.sdot;
      const dstVar = cd.closest('[data-var]')?.dataset.var ?? null;
      const isHl   = hasSel && hlVars.has(srcVar) && dstVar && hlVars.has(dstVar);

      const p1 = dotWorld(sd);
      const p2 = dotWorld(cd);
      const dx = Math.abs(p2.x - p1.x) * 0.45;
      const d  = `M${p1.x},${p1.y} C${p1.x+dx},${p1.y} ${p2.x-dx},${p2.y} ${p2.x},${p2.y}`;

      let col, width, isFg = false;

      if (hasSel) {
        /* Click-selection mode */
        if (isHl) {
          col   = p1.x < p2.x ? 'rgba(20,184,166,.95)' : 'rgba(59,130,246,.95)';
          width = 2.5;
          isFg  = true;   // highlighted → foreground (above panels)
        } else {
          col   = 'rgba(150,150,150,.08)';
          width = 1;
          isFg  = false;  // dimmed → background
        }
      } else if (searchHits) {
        /* Search mode */
        const srcHit = searchHits.has(srcVar);
        const dstHit = dstVar && searchHits.has(dstVar);
        if (srcHit && dstHit) {
          col   = p1.x < p2.x ? 'rgba(20,184,166,.95)' : 'rgba(59,130,246,.95)';
          width = 2.5;
          isFg  = true;   // matched → foreground
        } else {
          col   = 'rgba(150,150,150,.07)';
          width = 1;
          isFg  = false;  // unmatched → background
        }
      } else {
        /* Default state: all lines go behind panels */
        col   = p1.x < p2.x ? 'rgba(20,184,166,.35)' : 'rgba(59,130,246,.35)';
        width = 1.4;
        isFg  = false;
      }

      const path = `<path d="${d}" fill="none" stroke="${col}" stroke-width="${width}" stroke-linecap="round"/>`;
      if (isFg) fgPaths += path;
      else      bgPaths += path;
    });

    svgBg.innerHTML = `<g>${bgPaths}</g>`;
    svgFg.innerHTML = `<g>${fgPaths}</g>`;
  }

  /* ── Build the set of variables in a selection chain ── */
  function vvBuildHlSet(varName) {
    const { semRefMap, compRefMap, primSet, semSet } = vvConnData;
    const hl = new Set([varName]);

    if (primSet.has(varName)) {
      /* Prim selected → find sems that reference it → find comps that reference those sems */
      semRefMap.forEach((primRef, semName) => {
        if (primRef === varName) {
          hl.add(semName);
          compRefMap.forEach((ref, compName) => { if (ref === semName) hl.add(compName); });
        }
      });
    } else if (semSet.has(varName)) {
      /* Sem selected → walk up to prim, walk down to comps */
      const primRef = semRefMap.get(varName);
      if (primRef) hl.add(primRef);
      compRefMap.forEach((ref, compName) => { if (ref === varName) hl.add(compName); });
    } else {
      /* Comp var selected → walk up through sem → prim */
      const ref = compRefMap.get(varName);
      if (ref) {
        hl.add(ref);
        if (semSet.has(ref)) {
          const primRef = semRefMap.get(ref);
          if (primRef) hl.add(primRef);
        }
      }
    }
    return hl;
  }

  /* ── Select a variable: highlight its chain, dim everything else ── */
  function vvSelectVar(varName) {
    const world = document.getElementById('vv-world');
    if (!world) return;
    /* Toggle off if clicking the same variable again */
    if (vvSelectedVar === varName) { vvDeselect(); return; }

    vvSelectedVar = varName;
    const hlVars = vvBuildHlSet(varName);

    world.setAttribute('data-sel', '1');
    world.querySelectorAll('[data-var]').forEach(row => {
      row.toggleAttribute('data-hl', hlVars.has(row.dataset.var));
    });
    requestAnimationFrame(vvDrawLines);
  }

  /* ── Clear selection ── */
  function vvDeselect() {
    vvSelectedVar = null;
    const world = document.getElementById('vv-world');
    if (!world) return;
    world.removeAttribute('data-sel');
    world.querySelectorAll('[data-hl]').forEach(el => el.removeAttribute('data-hl'));
    requestAnimationFrame(vvDrawLines);
  }

  /* ── Init ── */
  document.documentElement.setAttribute('data-theme', 'light');
  syncToggleState();
  refreshTokenGrid();
  refreshColorStrip();
  initSplitButtons();
  setTimeout(autoContrastPrimary, 100);

  /* MDS_VARS catalogue is available synchronously from mds-vars-data.js.
     No async load needed — readMdsCoreVars() always has data on first call. */

})();
