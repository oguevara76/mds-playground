/** Stepper: vertical panel indent + template steplist a ancho completo. */
export const MDS_STEPPER_OVERRIDE_STYLE_ID = 'mds-stepper-overrides';

export const STEPPER_MDS_OVERRIDE_CSS = `
.p-stepitem .p-steppanel-content {
  margin-inline-start: var(--p-stepper-steppanel-indent) !important;
}

.p-stepper.stepper-catalog-live--template p-step-list.p-steplist,
.p-stepper.stepper-catalog-live--template .p-steplist {
  display: flex !important;
  width: 100% !important;
}

.p-stepper.stepper-catalog-live--template p-step.stepper-catalog-template-step {
  display: flex !important;
  flex: 1 1 auto !important;
  align-items: center !important;
  gap: var(--p-stepper-step-gap, 14px) !important;
  min-width: 0 !important;
}

.p-stepper.stepper-catalog-live--template p-step.stepper-catalog-template-step:last-of-type {
  flex: 0 0 auto !important;
}

.p-stepper.stepper-catalog-live--template p-step.stepper-catalog-template-step .p-stepper-separator {
  flex: 1 1 0 !important;
  min-width: 1.5rem !important;
  margin-inline-end: var(--p-stepper-step-gap, 14px) !important;
  width: auto !important;
  height: var(--p-stepper-separator-size, 2px) !important;
}
`;
