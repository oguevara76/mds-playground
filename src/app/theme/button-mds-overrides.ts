/** Button: fuerza tokens MDS en hover/active de severidades filled (Aura fija #ffffff en hover). */
export const MDS_BUTTON_OVERRIDE_STYLE_ID = 'mds-button-overrides';

export const BUTTON_MDS_OVERRIDE_CSS = `
.p-button-success:not(:disabled):hover {
  background: var(--p-button-success-hover-background) !important;
  border-color: var(--p-button-success-hover-border-color, var(--p-button-success-hover-background)) !important;
  color: var(--p-button-success-hover-color, var(--p-button-success-color)) !important;
}

.p-button-success:not(:disabled):active {
  background: var(--p-button-success-active-background) !important;
  border-color: var(--p-button-success-active-border-color, var(--p-button-success-active-background)) !important;
  color: var(--p-button-success-active-color, var(--p-button-success-color)) !important;
}

.p-button-info:not(:disabled):hover {
  background: var(--p-button-info-hover-background) !important;
  border-color: var(--p-button-info-hover-border-color, var(--p-button-info-hover-background)) !important;
  color: var(--p-button-info-hover-color, var(--p-button-info-color)) !important;
}

.p-button-info:not(:disabled):active {
  background: var(--p-button-info-active-background) !important;
  border-color: var(--p-button-info-active-border-color, var(--p-button-info-active-background)) !important;
  color: var(--p-button-info-active-color, var(--p-button-info-color)) !important;
}

.p-button-warn:not(:disabled):hover,
.p-button-warning:not(:disabled):hover {
  background: var(--p-button-warn-hover-background, var(--p-button-warning-hover-background)) !important;
  border-color: var(
    --p-button-warn-hover-border-color,
    var(--p-button-warning-hover-border-color, var(--p-button-warn-hover-background))
  ) !important;
  color: var(--p-button-warn-hover-color, var(--p-button-warning-hover-color, var(--p-button-warn-color))) !important;
}

.p-button-warn:not(:disabled):active,
.p-button-warning:not(:disabled):active {
  background: var(--p-button-warn-active-background, var(--p-button-warning-active-background)) !important;
  border-color: var(
    --p-button-warn-active-border-color,
    var(--p-button-warning-active-border-color, var(--p-button-warn-active-background))
  ) !important;
  color: var(--p-button-warn-active-color, var(--p-button-warning-active-color, var(--p-button-warn-color))) !important;
}

.p-button-help:not(:disabled):hover {
  background: var(--p-button-help-hover-background) !important;
  border-color: var(--p-button-help-hover-border-color, var(--p-button-help-hover-background)) !important;
  color: var(--p-button-help-hover-color, var(--p-button-help-color)) !important;
}

.p-button-help:not(:disabled):active {
  background: var(--p-button-help-active-background) !important;
  border-color: var(--p-button-help-active-border-color, var(--p-button-help-active-background)) !important;
  color: var(--p-button-help-active-color, var(--p-button-help-color)) !important;
}
`;
