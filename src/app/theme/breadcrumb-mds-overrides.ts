/** Breadcrumb: fuerza tokens MDS sobre estilos runtime de PrimeNG Aura (dt('breadcrumb.*')). */
export const MDS_BREADCRUMB_OVERRIDE_STYLE_ID = 'mds-breadcrumb-overrides';

export const BREADCRUMB_MDS_OVERRIDE_CSS = `
.p-breadcrumb {
  background: var(--breadcrumb-background, var(--p-breadcrumb-background)) !important;
  padding: var(--breadcrumb-padding, var(--p-breadcrumb-padding)) !important;
  border-radius: var(--breadcrumb-border-radius, var(--p-breadcrumb-border-radius)) !important;
}

.p-breadcrumb-list {
  gap: var(--breadcrumb-gap, var(--p-breadcrumb-gap)) !important;
}

.p-breadcrumb-separator {
  color: var(--breadcrumb-separator-color, var(--p-breadcrumb-separator-color)) !important;
}

.p-breadcrumb-item-link {
  gap: var(--breadcrumb-item-gap, var(--p-breadcrumb-item-gap)) !important;
  border-radius: var(--breadcrumb-item-border-radius, var(--p-breadcrumb-item-border-radius)) !important;
  color: var(--breadcrumb-item-color, var(--p-breadcrumb-item-color)) !important;
}

.p-breadcrumb-item-link:focus-visible {
  box-shadow: var(--breadcrumb-item-focus-ring-shadow, var(--p-breadcrumb-item-focus-ring-shadow)) !important;
  outline: var(--breadcrumb-item-focus-ring-width, var(--p-breadcrumb-item-focus-ring-width))
    var(--p-breadcrumb-item-focus-ring-style, solid)
    var(--breadcrumb-item-focus-ring-color, var(--p-breadcrumb-item-focus-ring-color)) !important;
  outline-offset: var(--breadcrumb-item-focus-ring-offset, var(--p-breadcrumb-item-focus-ring-offset)) !important;
}

.p-breadcrumb-item-link:hover .p-breadcrumb-item-label {
  color: var(--breadcrumb-item-hover-color, var(--p-breadcrumb-item-hover-color)) !important;
}

.p-breadcrumb-item-icon {
  color: var(--breadcrumb-item-icon-color, var(--p-breadcrumb-item-icon-color)) !important;
}

.p-breadcrumb-item-link:hover .p-breadcrumb-item-icon {
  color: var(--breadcrumb-item-icon-hover-color, var(--p-breadcrumb-item-icon-hover-color)) !important;
}
`;
