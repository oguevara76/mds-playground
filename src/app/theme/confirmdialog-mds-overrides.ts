/** ConfirmDialog: gap, icono y mensaje desde tokens MDS de componente. */
export const MDS_CONFIRMDIALOG_OVERRIDE_STYLE_ID = 'mds-confirmdialog-overrides';

export const CONFIRMDIALOG_MDS_OVERRIDE_CSS = `
.p-confirmdialog .p-dialog-content {
  display: flex;
  align-items: flex-start;
  gap: var(--confirmdialog-content-gap, var(--p-confirmdialog-content-gap)) !important;
}

.p-confirmdialog-icon {
  flex-shrink: 0;
  color: var(--confirmdialog-icon-color, var(--p-confirmdialog-icon-color)) !important;
  font-size: var(--confirmdialog-icon-size, var(--p-confirmdialog-icon-size)) !important;
}

.p-confirmdialog-message {
  color: var(--confirmdialog-message-color, var(--p-confirmdialog-message-color)) !important;
}
`;
