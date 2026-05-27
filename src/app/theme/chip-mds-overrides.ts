/** Chip: fuerza tokens MDS sobre estilos runtime de PrimeNG Aura (dt('chip.*')). */
export const MDS_CHIP_OVERRIDE_STYLE_ID = 'mds-chip-overrides';

export const CHIP_MDS_OVERRIDE_CSS = `
.p-chip {
  display: inline-flex !important;
  align-items: center !important;
  gap: var(--chip-gap, var(--p-chip-gap)) !important;
  padding: var(--chip-padding-y, var(--p-chip-padding-y))
    var(--chip-padding-x, var(--p-chip-padding-x)) !important;
  border-radius: var(--chip-border-radius, var(--p-chip-border-radius)) !important;
  background: var(--chip-background, var(--p-chip-background)) !important;
  color: var(--chip-color, var(--p-chip-color)) !important;
  font-size: var(--chip-font-size, var(--p-chip-font-size, var(--p-font-size))) !important;
  font-family: var(--p-font-family) !important;
  border: none !important;
}

.p-chip-icon {
  color: var(--chip-icon-color, var(--p-chip-icon-color)) !important;
  font-size: var(--chip-icon-size, var(--p-chip-icon-size)) !important;
  width: var(--chip-icon-size, var(--p-chip-icon-size)) !important;
  height: var(--chip-icon-size, var(--p-chip-icon-size)) !important;
  line-height: 1 !important;
}

.p-chip-image {
  border-radius: 50% !important;
  width: var(--chip-image-width, var(--p-chip-image-width)) !important;
  height: var(--chip-image-height, var(--p-chip-image-height)) !important;
  object-fit: cover !important;
}

.p-chip-label {
  color: inherit !important;
  line-height: 1.25 !important;
}

.p-chip-remove-icon {
  color: var(--chip-remove-icon-color, var(--p-chip-remove-icon-color)) !important;
  font-size: var(--chip-remove-icon-size, var(--p-chip-remove-icon-size)) !important;
  width: var(--chip-remove-icon-size, var(--p-chip-remove-icon-size)) !important;
  height: var(--chip-remove-icon-size, var(--p-chip-remove-icon-size)) !important;
}

.p-chip-remove-icon:focus-visible {
  outline: var(--chip-remove-icon-focus-ring-width, var(--p-chip-remove-icon-focus-ring-width))
    solid var(--chip-remove-icon-focus-ring-color, var(--p-chip-remove-icon-focus-ring-color)) !important;
  outline-offset: var(
    --chip-remove-icon-focus-ring-offset,
    var(--p-chip-remove-icon-focus-ring-offset)
  ) !important;
  box-shadow: var(--chip-remove-icon-shadow, var(--p-chip-remove-icon-shadow)) !important;
}
`;
