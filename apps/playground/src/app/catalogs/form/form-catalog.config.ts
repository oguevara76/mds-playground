export type FormBlockKind =
  | 'radio'
  | 'checkbox'
  | 'toggleswitch'
  | 'input-default'
  | 'input-float-over'
  | 'input-float-on'
  | 'input-float-in';

export type FormBlockCategory = 'choice' | 'input';

export type FormInputFloatVariant = 'over' | 'on' | 'in';

export type FormInteractionSize = 'small' | 'normal' | 'large';

export type FormInputDemoState =
  | 'normal'
  | 'empty'
  | 'filled'
  | 'hover'
  | 'focus'
  | 'invalid'
  | 'disabled'
  | 'readonly';

export interface FormBlockConfig {
  kind: FormBlockKind;
  title: string;
  category: FormBlockCategory;
  floatVariant?: FormInputFloatVariant;
}

export const FORM_RADIO_OPTIONS = [
  { label: 'Visa', value: 'visa' },
  { label: 'Mastercard', value: 'mastercard' },
  { label: 'Amex', value: 'amex' },
] as const;

export const FORM_CHECKBOX_OPTIONS = [
  { key: 'email', label: 'Email' },
  { key: 'sms', label: 'SMS' },
  { key: 'push', label: 'Push' },
] as const;

export type FormCheckboxKey = (typeof FORM_CHECKBOX_OPTIONS)[number]['key'];

/** Layout MDS por tamaño: control (PrimeNG), texto y gaps (form-field + dimension-scale). */
export const FORM_CHOICE_SIZE_LAYOUT: Record<
  FormInteractionSize,
  {
    pSize?: 'small' | 'large';
    labelFont: string;
    labelGap: string;
    rowGapY: string;
    rowGapX: string;
  }
> = {
  small: {
    pSize: 'small',
    labelFont: '--form-field-sm-font-size',
    labelGap: '--form-field-sm-gap-scale',
    rowGapY: '--dimension-scale-x12',
    rowGapX: '--dimension-scale-x16',
  },
  normal: {
    labelFont: '--form-field-font-size',
    labelGap: '--form-field-gap-space',
    rowGapY: '--dimension-scale-x16',
    rowGapX: '--dimension-scale-x20',
  },
  large: {
    pSize: 'large',
    labelFont: '--form-field-lg-font-size',
    labelGap: '--form-field-lg-gap-space',
    rowGapY: '--dimension-scale-x20',
    rowGapX: '--dimension-scale-x24',
  },
};

export const FORM_SIZE_OPTIONS: {
  key: FormInteractionSize;
  caption: string;
  pSize?: 'small' | 'large';
}[] = [
  { key: 'small', caption: 'sm', pSize: FORM_CHOICE_SIZE_LAYOUT.small.pSize },
  { key: 'normal', caption: 'md' },
  { key: 'large', caption: 'lg', pSize: FORM_CHOICE_SIZE_LAYOUT.large.pSize },
];

export const FORM_SIZE_SELECT_OPTIONS: { label: string; value: FormInteractionSize }[] =
  FORM_SIZE_OPTIONS.map((o) => ({ label: o.caption, value: o.key }));

/** Etiquetas de tamaño en States/Sizes (Interaction sigue usando sm/md/lg en el toggle). */
export const FORM_CHOICE_SIZE_DISPLAY_LABELS: Record<FormInteractionSize, string> = {
  small: 'Small',
  normal: 'Normal',
  large: 'Large',
};

export const FORM_INPUT_DEFAULT_STATES: { key: FormInputDemoState; caption: string }[] = [
  { key: 'normal', caption: 'Normal' },
  { key: 'hover', caption: 'Hover' },
  { key: 'focus', caption: 'Focus' },
  { key: 'invalid', caption: 'Invalid' },
  { key: 'disabled', caption: 'Disabled' },
  { key: 'readonly', caption: 'Readonly' },
];

export const FORM_INPUT_FLOAT_STATES: { key: FormInputDemoState; caption: string }[] = [
  { key: 'empty', caption: 'Vacío' },
  { key: 'filled', caption: 'Relleno' },
  { key: 'hover', caption: 'Hover' },
  { key: 'focus', caption: 'Focus' },
  { key: 'invalid', caption: 'Invalid' },
  { key: 'disabled', caption: 'Disabled' },
];

export const FORM_BLOCKS: FormBlockConfig[] = [
  { kind: 'radio', title: 'RadioButton', category: 'choice' },
  { kind: 'checkbox', title: 'Checkbox', category: 'choice' },
  { kind: 'toggleswitch', title: 'ToggleSwitch', category: 'choice' },
  { kind: 'input-default', title: 'InputText default', category: 'input' },
  { kind: 'input-float-over', title: 'InputText float label Over', category: 'input', floatVariant: 'over' },
  { kind: 'input-float-on', title: 'InputText float label On', category: 'input', floatVariant: 'on' },
  { kind: 'input-float-in', title: 'InputText float label In', category: 'input', floatVariant: 'in' },
];
