/** Tag: fuerza tokens MDS sobre estilos runtime de PrimeNG Aura (dt('tag.*')). */
export const MDS_TAG_OVERRIDE_STYLE_ID = 'mds-tag-overrides';

export const TAG_MDS_OVERRIDE_CSS = `
.p-tag {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: var(--tag-gap, var(--p-tag-gap, var(--dimension-scale-x4, 4px))) !important;
  padding: var(--tag-padding-y) var(--tag-padding-x) !important;
  border-radius: var(--tag-border-radius, var(--p-tag-border-radius)) !important;
  font-size: var(--tag-font-size, var(--p-tag-font-size, 14px)) !important;
  font-weight: var(--tag-font-weight, var(--p-tag-font-weight, 700)) !important;
  font-family: var(--p-font-family) !important;
}

.p-tag-rounded {
  border-radius: var(--tag-rounded-border-radius, var(--p-tag-rounded-border-radius)) !important;
}

.p-tag-icon,
.p-tag .p-tag-icon,
.p-tag > .pi {
  font-size: var(--tag-icon-size, var(--p-tag-icon-size, var(--dimension-scale-x12, 12px))) !important;
  width: auto !important;
  height: auto !important;
  line-height: 1 !important;
}

.p-tag-label {
  color: inherit !important;
  font-size: inherit !important;
  font-weight: inherit !important;
  line-height: 1.2 !important;
}

.p-tag-primary,
.p-tag:not(.p-tag-success):not(.p-tag-info):not(.p-tag-warn):not(.p-tag-danger):not(.p-tag-secondary):not(.p-tag-contrast) {
  background: var(--tag-primary-background, var(--p-tag-primary-background)) !important;
  color: var(--tag-primary-color, var(--p-tag-primary-color)) !important;
}

.p-tag-success {
  background: var(--tag-success-background, var(--p-tag-success-background)) !important;
  color: var(--tag-success-color, var(--p-tag-success-color)) !important;
}

.p-tag-info {
  background: var(--tag-info-background, var(--p-tag-info-background)) !important;
  color: var(--tag-info-color, var(--p-tag-info-color)) !important;
}

.p-tag-warn,
.p-tag-warning {
  background: var(--tag-warn-background, var(--p-tag-warning-background)) !important;
  color: var(--tag-warn-color, var(--p-tag-warning-color)) !important;
}

.p-tag-danger {
  background: var(--tag-danger-background, var(--p-tag-danger-background)) !important;
  color: var(--tag-danger-color, var(--p-tag-danger-color)) !important;
}

.p-tag-secondary {
  background: var(--tag-secondary-background, var(--p-tag-secondary-background)) !important;
  color: var(--tag-secondary-color, var(--p-tag-secondary-color)) !important;
}

.p-tag-contrast {
  background: var(--tag-contrast-background, var(--p-tag-contrast-background)) !important;
  color: var(--tag-contrast-color, var(--p-tag-contrast-color)) !important;
}

.p-tag.catalog-state-tag.p-tag-sm {
  gap: var(--tag-sm-gap, var(--dimension-scale-x2, 2px)) !important;
  padding: var(--tag-sm-padding-y, var(--dimension-scale-x2, 2px))
    var(--tag-sm-padding-x, var(--dimension-scale-x6, 6px)) !important;
  font-size: var(--tag-sm-font-size, var(--form-field-sm-font-size, 12px)) !important;
  font-weight: 400 !important;
}

.p-tag.catalog-state-tag.p-tag-sm .p-tag-label {
  font-size: inherit !important;
  font-weight: 400 !important;
}

.p-tag.catalog-state-tag.p-tag-sm .p-tag-icon,
.p-tag.catalog-state-tag.p-tag-sm > .pi {
  font-size: var(--tag-sm-icon-size, var(--dimension-scale-x10, 10px)) !important;
}
`;
