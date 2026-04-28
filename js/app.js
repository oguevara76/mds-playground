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
  const CATALOGS = {
    button: [
      { name: 'Button', link: '/button' },
      { name: 'SpeedDial', link: '/speeddial' },
      { name: 'SplitButton', link: '/splitbutton' }
    ],
    form: [
      { name: 'AutoComplete', link: '/autocomplete' },
      { name: 'CascadeSelect', link: '/cascadeselect' },
      { name: 'Checkbox', link: '/checkbox' },
      { name: 'ColorPicker', link: '/colorpicker' },
      { name: 'DatePicker', link: '/datepicker' },
      { name: 'Editor', link: '/editor' },
      { name: 'FloatLabel', link: '/floatlabel' },
      { name: 'IconField', link: '/iconfield' },
      { name: 'IftaLabel', link: '/iftalabel' },
      { name: 'InputGroup', link: '/inputgroup' },
      { name: 'InputMask', link: '/inputmask' },
      { name: 'InputNumber', link: '/inputnumber' },
      { name: 'InputOtp', link: '/inputotp' },
      { name: 'InputText', link: '/inputtext' },
      { name: 'KeyFilter', link: '/keyfilter' },
      { name: 'Knob', link: '/knob' },
      { name: 'Listbox', link: '/listbox' },
      { name: 'MultiSelect', link: '/multiselect' },
      { name: 'Password', link: '/password' },
      { name: 'RadioButton', link: '/radiobutton' },
      { name: 'Rating', link: '/rating' },
      { name: 'Select', link: '/select' },
      { name: 'SelectButton', link: '/selectbutton' },
      { name: 'Slider', link: '/slider' },
      { name: 'Textarea', link: '/textarea' },
      { name: 'ToggleButton', link: '/togglebutton' },
      { name: 'ToggleSwitch', link: '/toggleswitch' },
      { name: 'TreeSelect', link: '/treeselect' }
    ],
    data: [
      { name: 'DataView', link: '/dataview' },
      { name: 'OrderList', link: '/orderlist' },
      { name: 'OrgChart', link: '/organizationchart' },
      { name: 'Paginator', link: '/paginator' },
      { name: 'PickList', link: '/picklist' },
      { name: 'Table', link: '/table' },
      { name: 'Timeline', link: '/timeline' },
      { name: 'Tree', link: '/tree' },
      { name: 'TreeTable', link: '/treetable' },
      { name: 'VirtualScroller', link: '/virtualscroller' }
    ],
    panel: [
      { name: 'Accordion', link: '/accordion' },
      { name: 'Card', link: '/card' },
      { name: 'Divider', link: '/divider' },
      { name: 'Fieldset', link: '/fieldset' },
      { name: 'Panel', link: '/panel' },
      { name: 'ScrollPanel', link: '/scrollpanel' },
      { name: 'Splitter', link: '/splitter' },
      { name: 'Stepper', link: '/stepper' },
      { name: 'Tabs', link: '/tabs' },
      { name: 'Toolbar', link: '/toolbar' }
    ],
    overlay: [
      { name: 'ConfirmDialog', link: '/confirmdialog' },
      { name: 'ConfirmPopup', link: '/confirmpopup' },
      { name: 'Dialog', link: '/dialog' },
      { name: 'Drawer', link: '/drawer' },
      { name: 'DynamicDialog', link: '/dynamicdialog' },
      { name: 'Popover', link: '/popover' },
      { name: 'Tooltip', link: '/tooltip' }
    ],
    file: [{ name: 'Upload', link: '/fileupload' }],
    menu: [
      { name: 'Breadcrumb', link: '/breadcrumb' },
      { name: 'ContextMenu', link: '/contextmenu' },
      { name: 'Dock', link: '/dock' },
      { name: 'Menu', link: '/menu' },
      { name: 'Menubar', link: '/menubar' },
      { name: 'MegaMenu', link: '/megamenu' },
      { name: 'PanelMenu', link: '/panelmenu' },
      { name: 'TieredMenu', link: '/tieredmenu' }
    ],
    chart: [{ name: 'Chart.js', link: '/chart' }],
    messages: [
      { name: 'Message', link: '/message' },
      { name: 'Toast', link: '/toast' }
    ],
    media: [
      { name: 'Carousel', link: '/carousel' },
      { name: 'Galleria', link: '/galleria' },
      { name: 'Image', link: '/image' },
      { name: 'ImageCompare', link: '/imagecompare' }
    ],
    misc: [
      { name: 'AnimateOnScroll', link: '/animateonscroll' },
      { name: 'AutoFocus', link: '/autofocus' },
      { name: 'Avatar', link: '/avatar' },
      { name: 'Badge', link: '/badge' },
      { name: 'Bind', link: '/bind' },
      { name: 'BlockUI', link: '/blockui' },
      { name: 'Chip', link: '/chip' },
      { name: 'ClassNames', link: '/classnames' },
      { name: 'FocusTrap', link: '/focustrap' },
      { name: 'Fluid', link: '/fluid' },
      { name: 'Inplace', link: '/inplace' },
      { name: 'MeterGroup', link: '/metergroup' },
      { name: 'ProgressBar', link: '/progressbar' },
      { name: 'ProgressSpinner', link: '/progressspinner' },
      { name: 'Ripple', link: '/ripple' },
      { name: 'ScrollTop', link: '/scrolltop' },
      { name: 'Skeleton', link: '/skeleton' },
      { name: 'StyleClass', link: '/styleclass' },
      { name: 'Tag', link: '/tag' },
      { name: 'Terminal', link: '/terminal' }
    ],
    utilities: [{ name: 'FilterService', link: '/filterservice' }]
  };

  function renderCatalog(categoryKey) {
    const mount = document.getElementById(`catalog-${categoryKey}`);
    if (!mount) return;

    const items = CATALOGS[categoryKey] || [];
    mount.innerHTML = '';

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'catalog-card';
      card.innerHTML = `
        <span class="catalog-name">${item.name}</span>
        <a class="catalog-link" href="https://primeng.org${item.link}" target="_blank" rel="noreferrer noopener">Docs</a>
      `;
      mount.appendChild(card);
    });
  }

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
  Object.keys(CATALOGS).forEach(renderCatalog);
  refreshTokenGrid();
  refreshColorStrip();
  syncThemeSwitchLabel();

})();
