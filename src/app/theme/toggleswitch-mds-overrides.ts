/** ToggleSwitch: fuerza tokens MDS sobre estilos runtime de PrimeNG Aura (dt('toggleswitch.*')). */
export const MDS_TOGGLESWITCH_OVERRIDE_STYLE_ID = 'mds-toggleswitch-overrides';

export const TOGGLESWITCH_MDS_OVERRIDE_CSS = `
/* PrimeNG v20 aplica color en .p-toggleswitch-slider / .p-toggleswitch-handle; Aura no lee tokens MDS en hover. */
.p-toggleswitch .p-toggleswitch-slider {
  background: var(--p-toggleswitch-background) !important;
  border-color: var(--p-toggleswitch-border-color) !important;
  box-shadow: var(--p-toggleswitch-shadow);
}

.p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover):not(.p-toggleswitch-checked) .p-toggleswitch-slider {
  background: var(--p-toggleswitch-hover-background) !important;
  border-color: var(--p-toggleswitch-hover-border-color) !important;
}

.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
  background: var(--p-toggleswitch-checked-background) !important;
  border-color: var(--p-toggleswitch-checked-border-color) !important;
}

.p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
  background: var(--p-toggleswitch-checked-hover-background) !important;
  border-color: var(--p-toggleswitch-checked-hover-border-color) !important;
}

.p-toggleswitch .p-toggleswitch-handle {
  background: var(--p-toggleswitch-handle-background) !important;
  color: var(--p-toggleswitch-handle-color) !important;
}

/* Off + hover: handle oscuro (igual que default); --toggleswitch-handle-hover-* en MDS no aplica al estado off */
.p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover):not(.p-toggleswitch-checked) .p-toggleswitch-handle {
  background: var(--p-toggleswitch-handle-background, var(--toggleswitch-handle-background)) !important;
  color: var(--p-toggleswitch-handle-color, var(--toggleswitch-handle-color)) !important;
}

.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
  background: var(--p-toggleswitch-handle-checked-background) !important;
  color: var(--p-toggleswitch-handle-checked-color) !important;
}

.p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
  background: var(--p-toggleswitch-handle-checked-hover-background) !important;
  color: var(--p-toggleswitch-handle-checked-hover-color) !important;
}

.p-toggleswitch.p-disabled:not(.p-toggleswitch-checked) .p-toggleswitch-slider {
  background: var(--p-toggleswitch-disabled-background) !important;
}

.p-toggleswitch.p-disabled .p-toggleswitch-handle {
  background: var(--p-toggleswitch-handle-disabled-background) !important;
}

.p-toggleswitch.p-invalid > .p-toggleswitch-slider {
  border-color: var(--p-toggleswitch-invalid-border-color) !important;
}
`;
