/** ConfirmPopup: overlay anclado al target; tokens MDS en dark (paridad con Popover). */
export const MDS_CONFIRMPOPUP_OVERRIDE_STYLE_ID = 'mds-confirmpopup-overrides';

export const CONFIRMPOPUP_MDS_OVERRIDE_CSS = `
.p-confirmpopup {
  background: var(--confirmpopup-overlay-background, var(--p-confirmpopup-background, var(--overlay-popover-background))) !important;
  border-color: var(--confirmpopup-overlay-border-color, var(--p-confirmpopup-border-color, var(--overlay-popover-border-color))) !important;
  color: var(--confirmpopup-overlay-color, var(--p-confirmpopup-color, var(--overlay-popover-color))) !important;
  border-radius: var(--confirmpopup-overlay-border-radius, var(--p-confirmpopup-border-radius, var(--overlay-popover-border-radius))) !important;
  box-shadow: var(--confirmpopup-shadow, var(--p-confirmpopup-shadow, var(--overlay-popover-shadow))) !important;
}

.p-confirmpopup-content {
  gap: var(--confirmpopup-content-gap, var(--p-confirmpopup-content-gap)) !important;
  padding: var(--confirmpopup-content-padding, var(--p-confirmpopup-content-padding, var(--overlay-popover-padding))) !important;
}

.p-confirmpopup-icon {
  color: var(--confirmpopup-icon-color, var(--p-confirmpopup-icon-color)) !important;
  font-size: var(--confirmpopup-icon-size, var(--p-confirmpopup-icon-size)) !important;
  width: var(--confirmpopup-icon-size, var(--p-confirmpopup-icon-size)) !important;
  height: var(--confirmpopup-icon-size, var(--p-confirmpopup-icon-size)) !important;
}

.p-confirmpopup-footer {
  gap: var(--confirmpopup-footer-gap, var(--p-confirmpopup-footer-gap)) !important;
}

.p-confirmpopup:after {
  border-bottom-color: var(--confirmpopup-overlay-background, var(--p-confirmpopup-background, var(--overlay-popover-background))) !important;
}

.p-confirmpopup:before {
  border-bottom-color: var(--confirmpopup-overlay-border-color, var(--p-confirmpopup-border-color, var(--overlay-popover-border-color))) !important;
}

.p-confirmpopup-flipped:after {
  border-top-color: var(--confirmpopup-overlay-background, var(--p-confirmpopup-background, var(--overlay-popover-background))) !important;
}

.p-confirmpopup-flipped:before {
  border-top-color: var(--confirmpopup-overlay-border-color, var(--p-confirmpopup-border-color, var(--overlay-popover-border-color))) !important;
}
`;
