/** Tooltip: padding desde tokens de componente MDS (--tooltip-padding-x/y). */
export const MDS_TOOLTIP_OVERRIDE_STYLE_ID = 'mds-tooltip-overrides';

export const TOOLTIP_MDS_OVERRIDE_CSS = `
.p-tooltip .p-tooltip-text {
  padding: var(--tooltip-padding-y, var(--dimension-scale-x8, 8px))
    var(--tooltip-padding-x, var(--dimension-scale-x8, 8px)) !important;
}
`;
