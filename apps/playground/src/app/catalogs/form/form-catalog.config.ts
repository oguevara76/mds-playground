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

export const FORM_SIZE_OPTIONS: {
  key: FormInteractionSize;
  caption: string;
  pSize?: 'small' | 'large';
}[] = [
  { key: 'small', caption: 'Small', pSize: 'small' },
  { key: 'normal', caption: 'Normal' },
  { key: 'large', caption: 'Large', pSize: 'large' },
];

export const FORM_SIZE_SELECT_OPTIONS: { label: string; value: FormInteractionSize }[] =
  FORM_SIZE_OPTIONS.map((o) => ({ label: o.caption, value: o.key }));

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
