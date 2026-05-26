/** Tabs: PrimeNG Aura define gap en .p-tab pero no display:flex; sin flex el gap no aplica. */
export const MDS_TABS_OVERRIDE_STYLE_ID = 'mds-tabs-overrides';

export const TABS_MDS_OVERRIDE_CSS = `
button.p-tab.p-component,
.p-tablist-tab-list > .p-tab,
.p-tablist-tab-list > button.p-tab {
  display: inline-flex !important;
  align-items: center !important;
  box-sizing: border-box;
  height: auto !important;
  min-height: unset !important;
}
`;
