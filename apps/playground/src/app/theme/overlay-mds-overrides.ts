/** Popover / select overlay: inyectado en document (appendTo="body"), requiere CSS global. */
export const MDS_OVERLAY_OVERRIDE_STYLE_ID = 'mds-overlay-overrides';

export const OVERLAY_MDS_OVERRIDE_CSS = `
/* Popover configuración (PrimeNG Aura no usa tokens MDS en dark) */
.p-popover {
  background: var(--popover-background, var(--overlay-popover-background)) !important;
  border: 1px solid var(--popover-border-color, var(--overlay-popover-border-color)) !important;
  color: var(--popover-color, var(--overlay-popover-color)) !important;
  border-radius: var(--popover-border-radius, var(--border-radius-md)) !important;
  box-shadow: var(--popover-shadow, var(--overlay-popover-shadow, 0 4px 12px rgba(0, 0, 0, 0.12))) !important;
}

.p-popover .p-popover-content {
  background: transparent !important;
  color: inherit !important;
  padding: var(--popover-content-padding, var(--overlay-popover-padding, 12px)) !important;
}

.button-config-popover-body .input-config-label,
.p-popover .input-config-label {
  color: var(--text-color, var(--p-content-color)) !important;
}

.p-popover .button-config-divider.p-divider {
  margin: 2px 0 0;
}

.p-popover .button-config-divider.p-divider::before {
  border-block-start-color: var(--p-content-border, var(--surface-border)) !important;
}

/* Size — label arriba, segmented control abajo */
.p-popover .button-config-size-field {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: 100%;
}

.p-popover .button-config-size-field > .input-config-label {
  display: block;
  width: 100%;
}

.p-popover .button-config-size-toggle-wrap {
  width: 100%;
  min-width: 0;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton {
  display: flex !important;
  width: 100%;
  gap: 2px;
  padding: 3px;
  background: var(--togglebutton-background, var(--surface-context-subtle, var(--p-surface-100))) !important;
  border: 1px solid var(--form-field-border-color, var(--p-input-border-color)) !important;
  border-radius: var(--selectbutton-border-radius, var(--form-field-border-radius, var(--border-radius-md))) !important;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton {
  flex: 1 1 0;
  min-width: 0;
  margin: 0 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--togglebutton-color, var(--p-surface-500)) !important;
  font-weight: var(--togglebutton-font-weight, 500);
  font-size: var(--togglebutton-sm-font-size, 12px);
  line-height: 1.2;
  border-radius: calc(var(--border-radius-md, 6px) - 2px) !important;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton .p-togglebutton-content {
  width: 100%;
  justify-content: center;
  padding: var(--togglebutton-sm-padding-y, 6px) var(--togglebutton-sm-padding-x, 8px) !important;
  background: transparent !important;
  color: inherit !important;
  box-shadow: none !important;
  border-radius: inherit !important;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton:not(.p-togglebutton-checked):hover {
  background: transparent !important;
  color: var(--togglebutton-hover-color, var(--p-content-color)) !important;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton.p-togglebutton-checked {
  background: transparent !important;
  border: none !important;
  color: var(--togglebutton-checked-color, var(--p-content-color)) !important;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton.p-togglebutton-checked .p-togglebutton-content {
  background: var(--togglebutton-content-checked-background, var(--primary-color)) !important;
  color: var(--primary-contrast-color, var(--p-primary-color-text, #fff)) !important;
  box-shadow: var(--togglebutton-content-shadow, 0 1px 2px rgba(0, 0, 0, 0.08)) !important;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton .p-togglebutton-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ToggleSwitch en panel de configuración */
.p-popover .p-toggleswitch .p-toggleswitch-slider {
  background: var(--toggleswitch-background, var(--p-surface-300)) !important;
  border-color: var(--toggleswitch-border-color, transparent) !important;
}

.p-popover .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
  background: var(--toggleswitch-checked-background, var(--primary-color)) !important;
  border-color: var(--toggleswitch-checked-border-color, transparent) !important;
}

.p-popover .p-toggleswitch .p-toggleswitch-handle {
  background: var(--toggleswitch-handle-background, var(--neutral-white, #fff)) !important;
}

.p-popover .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
  background: var(--toggleswitch-handle-checked-background, var(--surface-context-minimal, #fff)) !important;
}
`;
