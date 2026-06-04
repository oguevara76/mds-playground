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
.p-popover .button-config-size-field,
.form-config-aside-inline .button-config-size-field {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: 100%;
}

.p-popover .button-config-size-field > .input-config-label,
.form-config-aside-inline .button-config-size-field > .input-config-label {
  display: block;
  width: 100%;
}

.p-popover .button-config-size-toggle-wrap,
.p-popover .button-config-select-wrap {
  width: 100%;
  min-width: 0;
}

.form-config-aside-inline .button-config-size-toggle-wrap {
  width: auto;
  min-width: 0;
}

.p-popover .button-config-select-wrap .p-select {
  width: 100%;
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
  padding: var(--togglebutton-content-sm-padding-y) var(--togglebutton-content-sm-padding-x) !important;
  border-radius: var(--togglebutton-content-border-radius) !important;
  background: transparent !important;
  color: inherit !important;
  box-shadow: none !important;
  border-radius: inherit !important;
}

.form-config-aside-inline .button-config-size-toggle-wrap .p-selectbutton {
  display: flex !important;
  width: auto;
  max-width: max-content;
  gap: 2px;
  padding: 3px;
  background: var(--togglebutton-background, var(--surface-context-subtle, var(--p-surface-100))) !important;
  border: 1px solid var(--form-field-border-color, var(--p-input-border-color)) !important;
  border-radius: var(--border-radius-sm, 4px) !important;
}

.form-config-aside-inline .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton {
  flex: 0 1 auto;
  min-width: 2.125rem;
  margin: 0 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--togglebutton-color, var(--p-surface-500)) !important;
  font-weight: var(--togglebutton-font-weight, 500);
  font-size: 11px;
  line-height: 1.1;
  border-radius: calc(var(--border-radius-sm, 4px) - 1px) !important;
}

.form-config-aside-inline .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton .p-togglebutton-content {
  width: auto;
  justify-content: center;
  padding: 4px 7px !important;
  background: transparent !important;
  color: inherit !important;
  box-shadow: none !important;
  border-radius: inherit !important;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton:not(.p-togglebutton-checked):hover,
.form-config-aside-inline .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton:not(.p-togglebutton-checked):hover {
  background: transparent !important;
  color: var(--togglebutton-hover-color, var(--p-content-color)) !important;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton.p-togglebutton-checked,
.form-config-aside-inline .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton.p-togglebutton-checked {
  background: transparent !important;
  border: none !important;
  color: var(--togglebutton-checked-color, var(--p-content-color)) !important;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton.p-togglebutton-checked .p-togglebutton-content,
.form-config-aside-inline .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton.p-togglebutton-checked .p-togglebutton-content {
  background: var(--togglebutton-content-checked-background) !important;
  color: var(--togglebutton-checked-color) !important;
  box-shadow: var(--togglebutton-content-shadow) !important;
  border-radius: var(--togglebutton-content-border-radius) !important;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton:not(.p-togglebutton-checked):hover .p-togglebutton-icon,
.form-config-aside-inline .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton:not(.p-togglebutton-checked):hover .p-togglebutton-icon {
  color: var(--togglebutton-icon-hover-color) !important;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton.p-togglebutton-checked .p-togglebutton-icon,
.form-config-aside-inline .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton.p-togglebutton-checked .p-togglebutton-icon {
  color: var(--togglebutton-icon-checked-color) !important;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton {
  min-width: 2.125rem;
}

.p-popover .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton .p-togglebutton-label {
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
}

.form-config-aside-inline .button-config-size-toggle-wrap .p-selectbutton .p-togglebutton .p-togglebutton-label {
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
}

/* ToggleSwitch en panel de configuración — tokens MDS vía --p-toggleswitch-* */
.p-popover .p-toggleswitch .p-toggleswitch-slider {
  background: var(--p-toggleswitch-background) !important;
  border-color: var(--p-toggleswitch-border-color) !important;
  box-shadow: var(--p-toggleswitch-shadow);
}

.p-popover .p-toggleswitch:hover:not(.p-disabled):not(.p-toggleswitch-checked) .p-toggleswitch-slider {
  background: var(--p-toggleswitch-hover-background) !important;
  border-color: var(--p-toggleswitch-hover-border-color) !important;
}

.p-popover .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
  background: var(--p-toggleswitch-checked-background) !important;
  border-color: var(--p-toggleswitch-checked-border-color) !important;
}

.p-popover .p-toggleswitch.p-toggleswitch-checked:hover:not(.p-disabled) .p-toggleswitch-slider {
  background: var(--p-toggleswitch-checked-hover-background) !important;
  border-color: var(--p-toggleswitch-checked-hover-border-color) !important;
}

.p-popover .p-toggleswitch .p-toggleswitch-handle {
  background: var(--p-toggleswitch-handle-background) !important;
}

.p-popover .p-toggleswitch:hover:not(.p-disabled):not(.p-toggleswitch-checked) .p-toggleswitch-handle {
  background: var(--p-toggleswitch-handle-hover-background) !important;
}

.p-popover .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
  background: var(--p-toggleswitch-handle-checked-background) !important;
}

.p-popover .p-toggleswitch.p-toggleswitch-checked:hover:not(.p-disabled) .p-toggleswitch-handle {
  background: var(--p-toggleswitch-handle-checked-hover-background) !important;
}

.p-popover .p-toggleswitch.p-disabled:not(.p-toggleswitch-checked) .p-toggleswitch-slider {
  background: var(--p-toggleswitch-disabled-background) !important;
}

.p-popover .p-toggleswitch.p-disabled .p-toggleswitch-handle {
  background: var(--p-toggleswitch-handle-disabled-background) !important;
}

/* p-select overlay (configuradores: appendTo="body") — padding en lista y opciones */
.p-select-overlay {
  background: var(--select-overlay-background, var(--p-select-overlay-background)) !important;
  border: 1px solid var(--select-overlay-border-color, var(--p-select-overlay-border-color)) !important;
  color: var(--select-overlay-color, var(--p-select-overlay-color)) !important;
  border-radius: var(--select-overlay-border-radius, var(--p-select-overlay-border-radius)) !important;
  box-shadow: var(--select-overlay-shadow, var(--p-select-overlay-shadow)) !important;
}

.p-select-overlay .p-select-list-container,
.p-select-overlay .p-select-list {
  padding: var(--list-padding, var(--p-select-list-padding, 8px)) !important;
}

.p-select-overlay .p-select-list {
  display: flex !important;
  flex-direction: column !important;
  gap: var(--select-list-gap, var(--list-gap, var(--p-select-list-gap, 2px))) !important;
}

.p-select-overlay .p-select-option {
  padding: var(
    --select-option-padding,
    var(--p-select-option-padding, var(--list-option-padding, 6px 12px))
  ) !important;
  border-radius: var(
    --select-option-border-radius,
    var(--p-select-option-border-radius, var(--list-option-border-radius))
  ) !important;
  background: transparent !important;
  color: var(--select-option-color, var(--p-select-option-color)) !important;
  outline: none !important;
  box-shadow: none !important;
  cursor: pointer;
  transition:
    background var(--p-transition-duration, 0.2s),
    color var(--p-transition-duration, 0.2s);
}

.p-select-overlay .p-select-option-label {
  line-height: 1.25 !important;
}

/* Solo HOVER y ACTIVE: sin estilos extra de focus / selected+focus de PrimeNG */
.p-select-overlay .p-select-option:not(.p-disabled):not(.p-select-option-selected).p-focus,
.p-select-overlay .p-select-option:not(.p-disabled):not(.p-select-option-selected):focus,
.p-select-overlay .p-select-option:not(.p-disabled):not(.p-select-option-selected):focus-visible {
  background: transparent !important;
  color: var(--select-option-color, var(--p-select-option-color)) !important;
  box-shadow: none !important;
}

/* HOVER — opciones no seleccionadas (tokens MDS list-option-focus = superficie hover) */
.p-select-overlay .p-select-option:not(.p-disabled):not(.p-select-option-selected):hover {
  background: var(--select-option-focus-background, var(--p-select-option-focus-background)) !important;
  color: var(--select-option-focus-color, var(--p-select-option-focus-color)) !important;
}

/* ACTIVE — valor seleccionado en el desplegable */
.p-select-overlay .p-select-option.p-select-option-selected,
.p-select-overlay .p-select-option.p-select-option-selected.p-focus,
.p-select-overlay .p-select-option.p-select-option-selected:focus,
.p-select-overlay .p-select-option.p-select-option-selected:focus-visible {
  background: var(--select-option-selected-background, var(--p-select-option-selected-background)) !important;
  color: var(--select-option-selected-color, var(--p-select-option-selected-color)) !important;
  box-shadow: none !important;
}

.p-select-overlay .p-select-option.p-select-option-selected:hover {
  background: var(--select-option-selected-background, var(--p-select-option-selected-background)) !important;
  color: var(--select-option-selected-color, var(--p-select-option-selected-color)) !important;
}

.p-select-overlay .p-select-option-group,
.p-select-overlay .p-select-option-group-label {
  padding: var(
    --list-option-group-padding,
    var(--p-select-option-group-padding, var(--list-option-padding, 6px 12px))
  ) !important;
}

.p-select-overlay .p-select-empty-message {
  padding: var(--list-option-padding, var(--p-select-empty-message-padding, 6px 12px)) !important;
}
`;
