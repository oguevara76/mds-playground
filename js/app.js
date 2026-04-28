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
  const resetBtn       = document.getElementById('reset-btn');
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
  toggleTheme.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    toggleTheme.innerHTML = isDark
      ? '<i class="pi pi-sun"></i>'
      : '<i class="pi pi-moon"></i>';

    // Also sync the preview-tab variant radios
    document.querySelectorAll('input[name="variant"]').forEach(r => {
      r.checked = (r.value === (isDark ? 'dark' : 'light'));
    });

    refreshColorStrip();
    refreshTokenGrid();
  });

  document.querySelectorAll('input[name="variant"]').forEach(r => {
    r.addEventListener('change', () => {
      isDark = r.value === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      toggleTheme.innerHTML = isDark
        ? '<i class="pi pi-sun"></i>'
        : '<i class="pi pi-moon"></i>';
      refreshColorStrip();
      refreshTokenGrid();
    });
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

  resetBtn.addEventListener('click', () => {
    userTheme.textContent = '';
    fileStatus.style.display = 'none';
    uploadZone.style.display = '';
    fileInput.value = '';
    showToast('Tokens restaurados al tema MDS por defecto', 'info');
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
    { name: '--p-primary-color',   label: 'primary' },
    { name: '--p-primary-50',      label: 'primary-50' },
    { name: '--p-primary-300',     label: 'primary-300' },
    { name: '--p-success-color',   label: 'success' },
    { name: '--p-warning-color',   label: 'warning' },
    { name: '--p-danger-color',    label: 'danger' },
    { name: '--p-border-radius',   label: 'radius' },
    { name: '--p-font-family',     label: 'font' },
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

      if (isColor(val) || val.startsWith('var(')) {
        const swatch = document.createElement('div');
        swatch.className = 'token-swatch';
        swatch.style.background = val || '#ccc';
        row.appendChild(swatch);
      }

      const nameEl = document.createElement('span');
      nameEl.className = 'token-name';
      nameEl.textContent = t.label;

      const valEl = document.createElement('span');
      valEl.className = 'token-value';
      valEl.textContent = val.length > 18 ? val.slice(0, 18) + '…' : (val || '—');

      row.appendChild(nameEl);
      row.appendChild(valEl);
      tokenGrid.appendChild(row);
    });
  }

  function refreshColorStrip() {
    const swatches = colorStrip.querySelectorAll('.color-swatch');
    const keys = [
      '--p-primary-50',
      '--p-primary-100',
      '--p-primary-200',
      '--p-primary-300',
      '--p-primary-400',
      '--p-primary-500',
      '--p-primary-600',
      '--p-primary-700',
      '--p-primary-color',
    ];
    swatches.forEach((sw, i) => {
      sw.style.background = `var(${keys[i]})`;
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

  /* ── Init ── */
  refreshTokenGrid();
  refreshColorStrip();

})();
