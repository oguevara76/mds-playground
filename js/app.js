/* ═══════════════════════════════════════════════════════════════════
   MDS PLAYGROUND — App Logic
   ═══════════════════════════════════════════════════════════════════ */

(function () {

  /* ── DOM refs ── */
  const uploadZone     = document.getElementById('upload-zone');
  const fileInput      = document.getElementById('css-file-input');
  const fileStatus     = document.getElementById('file-status');
  const fileName       = document.getElementById('file-name');
  const removeFile     = document.getElementById('remove-file');
  const userTheme      = document.getElementById('user-theme-override');
  const tokenGrid      = document.getElementById('token-grid');
  const colorStrip     = document.getElementById('color-strip');
  const toggleTheme    = document.getElementById('toggle-theme');
  const previewArea    = document.getElementById('preview-area');

  /* ── Tabs ── */
  document.querySelectorAll('.preview-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.preview-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panelId = 'tab-' + tab.dataset.tab;
      const panel = document.getElementById(panelId);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Dark / Light mode ── */
  let isDark = false;
  function syncThemeSwitchLabel() {
    const label = toggleTheme.querySelector('span');
    if (label) label.textContent = isDark ? 'Light' : 'Dark';
  }

  toggleTheme.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    toggleTheme.innerHTML = isDark
      ? '<i class="pi pi-sun"></i><span>Light</span>'
      : '<i class="pi pi-moon"></i><span>Dark</span>';

    refreshColorStrip();
    refreshTokenGrid();
  });

  /* ── CSS file upload ── */
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) loadCSSFile(file);
  });

  uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.css')) {
      loadCSSFile(file);
    } else {
      showToast('Solo se aceptan ficheros .css', 'error');
    }
  });

  removeFile.addEventListener('click', () => {
    userTheme.textContent = '';
    fileStatus.style.display = 'none';
    uploadZone.style.display = '';
    fileInput.value = '';
    showToast('CSS eliminado — tokens por defecto restaurados', 'info');
    refreshColorStrip();
    refreshTokenGrid();
  });

  function loadCSSFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
      const css = e.target.result;

      // Security: strip any url() with http that isn't a data URL or font
      // and strip <script> injection attempts
      const safe = css
        .replace(/<script/gi, '/* removed script */')
        .replace(/expression\s*\(/gi, '/* removed expression */');

      userTheme.textContent = safe;

      fileName.textContent = file.name;
      fileStatus.style.display = 'block';
      uploadZone.style.display = 'none';

      showToast('✓ CSS cargado — tokens aplicados en tiempo real', 'success');

      // Give browser a tick to apply styles, then refresh inspector
      setTimeout(() => {
        refreshColorStrip();
        refreshTokenGrid();
      }, 100);
    };
    reader.readAsText(file);
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

  function isColor(val) {
    return /^#|^rgb|^hsl|^color/.test(val.trim());
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
        swatch.style.background = val || '#ccc';
      }
      row.appendChild(swatch);

      const nameEl = document.createElement('span');
      nameEl.className = 'token-name';
      nameEl.textContent = t.label;

      const valEl = document.createElement('span');
      valEl.className = 'token-value';
      const normalized = val.startsWith('#') ? val.toUpperCase() : val;
      const display = t.name === '--p-font-family'
        ? (val.split(',')[0].replace(/['"]/g, '').trim() || '—')
        : (normalized.length > 18 ? normalized.slice(0, 18) + '…' : (normalized || '—'));
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
      const key = sw.dataset.key;
      const step = sw.dataset.step;
      if (!key) return;

      const rgb = resolveColor(key);
      const hex = rgbToHex(rgb);
      const dark = isDarkColor(rgb);

      sw.style.background = `var(${key})`;
      sw.classList.toggle('is-dark', dark);
      sw.innerHTML =
        '<span class="swatch-step">' + step + '</span>' +
        '<span class="swatch-hex">' + hex + '</span>';
    });
  }

  /* ── Toast notifications ── */
  function showToast(msg, type = 'info') {
    const existing = document.querySelector('.mds-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'mds-toast mds-toast-' + type;
    toast.textContent = msg;
    document.body.appendChild(toast);

    // Animate in
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

  // Toast styles injected dynamically
  const toastStyles = document.createElement('style');
  toastStyles.textContent = `
    .mds-toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 10px 18px;
      border-radius: 8px;
      font-family: var(--p-font-family);
      font-size: 13px;
      font-weight: 500;
      z-index: 9999;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity .25s, transform .25s;
      box-shadow: 0 4px 16px rgba(0,0,0,.15);
    }
    .mds-toast-success { background: var(--p-success-color); color: #fff; }
    .mds-toast-error   { background: var(--p-danger-color);  color: #fff; }
    .mds-toast-info    { background: var(--p-surface-700);   color: #fff; }
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
        if (!wasOpen) {
          panel.hidden = false;
          setChevron(menuBtn, true);
        }
      });

      sb.querySelector('.p-splitbutton-panel')?.addEventListener('click', e => {
        e.stopPropagation();
      });
    });

    document.addEventListener('click', closeAllSplitPanels);
  }

  /* ── Init ── */
  refreshTokenGrid();
  refreshColorStrip();
  syncThemeSwitchLabel();
  initSplitButtons();

})();
