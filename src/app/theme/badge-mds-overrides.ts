/** Badge: fuerza tokens MDS sobre estilos runtime de PrimeNG Aura (dt('badge.*')). */
export const MDS_BADGE_OVERRIDE_STYLE_ID = 'mds-badge-overrides';

export const BADGE_MDS_OVERRIDE_CSS = `
.p-badge {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: var(--badge-min-width, var(--p-badge-min-width, 1.25rem)) !important;
  height: var(--badge-height, var(--p-badge-height, 1.25rem)) !important;
  padding: var(--badge-padding-y, var(--p-badge-padding-y))
    var(--badge-padding-x, var(--p-badge-padding-x)) !important;
  border-radius: var(--badge-border-radius, var(--p-badge-border-radius)) !important;
  border: none !important;
  font-size: var(--badge-font-size, var(--p-badge-font-size)) !important;
  font-weight: var(--badge-font-weight, var(--p-badge-font-weight)) !important;
  font-family: var(--p-font-family) !important;
}

.p-badge-sm {
  min-width: var(--badge-sm-min-width, var(--p-badge-sm-min-width, 1.125rem)) !important;
  height: var(--badge-sm-height, var(--p-badge-sm-height, 1.125rem)) !important;
  font-size: var(--badge-sm-font-size, var(--p-badge-sm-font-size, 0.5rem)) !important;
}

.p-badge-lg {
  min-width: var(--badge-lg-min-width, var(--p-badge-lg-min-width, 1.5rem)) !important;
  height: var(--badge-lg-height, var(--p-badge-lg-height, 1.5rem)) !important;
  font-size: var(--badge-lg-font-size, var(--p-badge-lg-font-size, 0.75rem)) !important;
}

.p-badge-xl {
  min-width: var(--badge-xl-min-width, var(--p-badge-xl-min-width, 1.75rem)) !important;
  height: var(--badge-xl-height, var(--p-badge-xl-height, 1.75rem)) !important;
  font-size: var(--badge-xl-font-size, var(--p-badge-xl-font-size, 0.875rem)) !important;
}

.p-badge-dot {
  width: var(--badge-dot-size, var(--p-badge-dot-size, 0.5rem)) !important;
  min-width: var(--badge-dot-size, var(--p-badge-dot-size, 0.5rem)) !important;
  height: var(--badge-dot-size, var(--p-badge-dot-size, 0.5rem)) !important;
  padding: 0 !important;
}

.p-badge-primary,
.p-badge:not(.p-badge-success):not(.p-badge-info):not(.p-badge-warn):not(.p-badge-danger):not(.p-badge-secondary):not(.p-badge-contrast) {
  background: var(--badge-primary-background, var(--p-badge-primary-background)) !important;
  color: var(--badge-primary-color, var(--p-badge-primary-color)) !important;
}

.p-badge-success {
  background: var(--badge-success-background, var(--p-badge-success-background)) !important;
  color: var(--badge-success-color, var(--p-badge-success-color)) !important;
}

.p-badge-info {
  background: var(--badge-info-background, var(--p-badge-info-background)) !important;
  color: var(--badge-info-color, var(--p-badge-info-color)) !important;
}

.p-badge-warn,
.p-badge-warning {
  background: var(--badge-warn-background, var(--p-badge-warning-background)) !important;
  color: var(--badge-warn-color, var(--p-badge-warning-color)) !important;
}

.p-badge-danger {
  background: var(--badge-danger-background, var(--p-badge-danger-background)) !important;
  color: var(--badge-danger-color, var(--p-badge-danger-color)) !important;
}

.p-badge-secondary {
  background: var(--badge-secondary-background, var(--p-badge-secondary-background)) !important;
  color: var(--badge-secondary-color, var(--p-badge-secondary-color)) !important;
}

.p-badge-contrast {
  background: var(--badge-contrast-background, var(--p-badge-contrast-background)) !important;
  color: var(--badge-contrast-color, var(--p-badge-contrast-color)) !important;
}

.p-button .p-badge {
  min-width: var(--badge-sm-min-width, var(--p-badge-sm-min-width, 1.125rem)) !important;
  height: var(--badge-sm-height, var(--p-badge-sm-height, 1.125rem)) !important;
  font-size: var(--badge-sm-font-size, var(--p-badge-sm-font-size, 0.5rem)) !important;
}

.p-overlaybadge .p-badge,
.p-overlay-badge .p-badge {
  outline-width: var(--overlaybadge-outline-width, var(--p-overlaybadge-outline-width, 0)) !important;
  outline-style: solid !important;
  outline-color: var(--overlaybadge-outline-color, var(--p-overlaybadge-outline-color, transparent)) !important;
}
`;
