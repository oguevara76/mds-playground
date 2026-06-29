/** SplitButton: pill + raised shadow tras estilos lazy de PrimeNG (@primeuix/styles/splitbutton). */
export const MDS_SPLITBUTTON_OVERRIDE_STYLE_ID = 'mds-splitbutton-overrides';

export const SPLITBUTTON_MDS_OVERRIDE_CSS = `
.p-splitbutton {
  display: inline-flex !important;
  position: relative !important;
  isolation: isolate !important;
}

.p-splitbutton:not(.p-splitbutton-rounded) {
  border-radius: var(--p-splitbutton-border-radius, var(--p-border-radius)) !important;
}

.p-splitbutton.p-splitbutton-rounded {
  border-radius: var(
    --p-splitbutton-rounded-border-radius,
    var(--splitbutton-rounded-border-radius, var(--border-radius-pill, 999px))
  ) !important;
}

.p-splitbutton-button.p-button {
  border-start-end-radius: 0 !important;
  border-end-end-radius: 0 !important;
  border-inline-end: 0 none !important;
}

.p-splitbutton-button.p-button:not(:disabled):hover,
.p-splitbutton-button.p-button:not(:disabled):active {
  border-inline-end: 0 none !important;
}

.p-splitbutton-dropdown.p-button {
  border-start-start-radius: 0 !important;
  border-end-start-radius: 0 !important;
}

.p-splitbutton:not(.p-splitbutton-rounded) .p-splitbutton-button.p-button {
  border-start-start-radius: var(--p-splitbutton-border-radius, var(--p-border-radius)) !important;
  border-end-start-radius: var(--p-splitbutton-border-radius, var(--p-border-radius)) !important;
}

.p-splitbutton:not(.p-splitbutton-rounded) .p-splitbutton-dropdown.p-button {
  border-start-end-radius: var(--p-splitbutton-border-radius, var(--p-border-radius)) !important;
  border-end-end-radius: var(--p-splitbutton-border-radius, var(--p-border-radius)) !important;
}

.p-splitbutton-rounded .p-splitbutton-button.p-button {
  border-radius: var(
      --p-splitbutton-rounded-border-radius,
      var(--splitbutton-rounded-border-radius, var(--border-radius-pill, 999px))
    )
    0 0
    var(
      --p-splitbutton-rounded-border-radius,
      var(--splitbutton-rounded-border-radius, var(--border-radius-pill, 999px))
    ) !important;
}

.p-splitbutton-rounded .p-splitbutton-dropdown.p-button {
  border-radius: 0
    var(
      --p-splitbutton-rounded-border-radius,
      var(--splitbutton-rounded-border-radius, var(--border-radius-pill, 999px))
    )
    var(
      --p-splitbutton-rounded-border-radius,
      var(--splitbutton-rounded-border-radius, var(--border-radius-pill, 999px))
    )
    0 !important;
}

.p-splitbutton.p-splitbutton-raised {
  box-shadow: none !important;
  filter: none !important;
}

.p-splitbutton.p-splitbutton-raised::after {
  content: '' !important;
  position: absolute !important;
  inset: 0 !important;
  border-radius: inherit !important;
  box-shadow: var(
    --p-splitbutton-raised-shadow,
    var(--splitbutton-raised-shadow, var(--button-raised-shadow))
  ) !important;
  pointer-events: none !important;
  z-index: 0 !important;
}

.p-splitbutton.p-splitbutton-raised .p-splitbutton-button.p-button,
.p-splitbutton.p-splitbutton-raised .p-splitbutton-dropdown.p-button {
  position: relative !important;
  z-index: 1 !important;
  box-shadow: none !important;
}

.p-splitbutton-outlined .p-splitbutton-dropdown.p-button {
  border-inline-start-width: 1px !important;
  border-inline-start-style: solid !important;
  border-inline-start-color: inherit !important;
  opacity: 1 !important;
}

.p-splitbutton-outlined .p-splitbutton-dropdown.p-button.p-button-text {
  opacity: 0.85 !important;
}
`;
