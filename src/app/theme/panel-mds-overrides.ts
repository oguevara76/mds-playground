/** Panel: paddings y superficie desde tokens MDS (el puente runtime colapsa *-padding compuestos). */
export const MDS_PANEL_OVERRIDE_STYLE_ID = 'mds-panel-overrides';

export const PANEL_MDS_OVERRIDE_CSS = `
.p-panel {
  border: 1px solid var(--panel-border-color, var(--p-panel-border-color)) !important;
  border-radius: var(--panel-border-radius, var(--p-panel-border-radius)) !important;
  background: var(--panel-background, var(--p-panel-background)) !important;
  color: var(--panel-color, var(--p-panel-color)) !important;
}

.p-panel-header {
  padding: var(--panel-header-padding, var(--p-panel-header-padding)) !important;
  background: var(--panel-header-background, var(--p-panel-header-background)) !important;
  color: var(--panel-header-color, var(--p-panel-header-color)) !important;
  border-width: var(--panel-header-border-width, var(--p-panel-header-border-width)) !important;
  border-color: var(--panel-header-border-color, var(--p-panel-header-border-color)) !important;
  border-radius: var(--panel-header-border-radius, var(--p-panel-header-border-radius)) !important;
}

.p-panel-toggleable .p-panel-header {
  padding: var(--panel-toggleable-header-padding-y, var(--dimension-scale-x6))
    var(--panel-toggleable-header-padding-x, var(--dimension-scale-x16)) !important;
}

.p-panel-title {
  font-weight: var(--panel-title-font-weight, var(--p-panel-title-font-weight, 600)) !important;
}

.p-panel-content {
  padding: var(--panel-content-padding-top, 0)
    var(--panel-content-padding-right, var(--dimension-scale-x16))
    var(--panel-content-padding-bottom, var(--dimension-scale-x16))
    var(--panel-content-padding-left, var(--dimension-scale-x16)) !important;
}

.p-panel-footer {
  padding: var(--panel-footer-padding-top, 0)
    var(--panel-footer-padding-right, var(--dimension-scale-x16))
    var(--panel-footer-padding-bottom, var(--dimension-scale-x16))
    var(--panel-footer-padding-left, var(--dimension-scale-x16)) !important;
}
`;
