/** Paginator: padding desde tokens MDS (--paginator-padding-x/y). */
export const MDS_PAGINATOR_OVERRIDE_STYLE_ID = 'mds-paginator-overrides';

export const PAGINATOR_MDS_OVERRIDE_CSS = `
.p-paginator.p-component {
  padding-block: var(--paginator-padding-y, var(--p-paginator-padding-y, var(--dimension-scale-x8))) !important;
  padding-inline: var(--paginator-padding-x, var(--p-paginator-padding-x, var(--dimension-scale-x14))) !important;
}
`;
