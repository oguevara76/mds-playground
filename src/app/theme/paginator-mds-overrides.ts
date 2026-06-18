/** Paginator: padding desde tokens MDS (--paginator-padding-x/y). */
export const MDS_PAGINATOR_OVERRIDE_STYLE_ID = 'mds-paginator-overrides';

export const PAGINATOR_MDS_OVERRIDE_CSS = `
.p-paginator.p-component {
  padding-block: var(--paginator-padding-y, 7px) !important;
  padding-inline: var(--paginator-padding-x, 14px) !important;
}
`;
