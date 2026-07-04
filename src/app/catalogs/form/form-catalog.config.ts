export type FormBlockKind =
  | 'radio'
  | 'checkbox'
  | 'toggleswitch'
  | 'togglebutton'
  | 'selectbutton'
  | 'inputtext'
  | 'inputgroup'
  | 'inputnumber'
  | 'select'
  | 'cascadeselect'
  | 'password'
  | 'inputotp'
  | 'rating'
  | 'textarea';

/** Variante del showcase unificado InputText / Textarea. */
export type FormInputTextVariant = 'default' | 'floatlabel' | 'iftalabel';

export type FormTextareaVariant = FormInputTextVariant;

export type FormBlockCategory = 'choice' | 'input' | 'textarea';

export type FormInputFloatVariant = 'over' | 'on' | 'in';

export type FormInteractionSize = 'small' | 'normal' | 'large';

/** Tema visual del campo: borde (Outlined) o fondo filled (alto contraste). */
export type FormFieldTheme = 'outlined' | 'filled';

export const FORM_THEME_SELECT_OPTIONS: { label: string; value: FormFieldTheme }[] = [
  { label: 'Outlined', value: 'outlined' },
  { label: 'Filled', value: 'filled' },
];

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
}

export const FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS: {
  label: string;
  value: FormInputTextVariant;
}[] = [
  { label: 'Default', value: 'default' },
  { label: 'Float Label', value: 'floatlabel' },
  { label: 'IftaLabel', value: 'iftalabel' },
];

export interface FormInputGroupCityOption {
  name: string;
  code: string;
}

export type FormInputGroupExample =
  | 'basic'
  | 'multiple'
  | 'button'
  | 'checkbox-radio'
  | 'select'
  | 'file-upload';

export const FORM_INPUTGROUP_EXAMPLE_OPTIONS: {
  label: string;
  value: FormInputGroupExample;
}[] = [
  { label: 'Basic', value: 'basic' },
  { label: 'Multiple', value: 'multiple' },
  { label: 'Button', value: 'button' },
  { label: 'Checkbox & Radio', value: 'checkbox-radio' },
  { label: 'Select', value: 'select' },
  { label: 'File Upload', value: 'file-upload' },
];

/** Ciudades demo (InputGroup → Select, alineado con PrimeNG docs). */
export const FORM_INPUTGROUP_CITY_OPTIONS: FormInputGroupCityOption[] = [
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
];

export const FORM_SELECT_DEMO_OPTIONS = [
  { label: 'Option 1', value: 'opt-1' },
  { label: 'Option 2', value: 'opt-2' },
  { label: 'Option 3', value: 'opt-3' },
] as const;

export type FormSelectDemoValue = (typeof FORM_SELECT_DEMO_OPTIONS)[number]['value'];

/** Opciones agrupadas para overlay Group en Interaction (emoji + país, ciudades como ítems). */
export interface FormSelectDemoGroup {
  emoji: string;
  label: string;
  items: { label: string; value: string }[];
}

export const FORM_SELECT_DEMO_GROUPED_OPTIONS: FormSelectDemoGroup[] = [
  {
    emoji: '🇩🇪',
    label: '🇩🇪 Germany',
    items: [
      { label: 'Berlin', value: 'de-berlin' },
      { label: 'Frankfurt', value: 'de-frankfurt' },
      { label: 'Munich', value: 'de-munich' },
    ],
  },
  {
    emoji: '🇺🇸',
    label: '🇺🇸 USA',
    items: [
      { label: 'Chicago', value: 'us-chicago' },
      { label: 'Los Angeles', value: 'us-los-angeles' },
      { label: 'New York', value: 'us-new-york' },
    ],
  },
];

export type FormSelectOverlayOptionVariant = 'default' | 'checkmark' | 'group';

export const FORM_SELECT_OVERLAY_OPTION_VARIANT_OPTIONS: {
  label: string;
  value: FormSelectOverlayOptionVariant;
}[] = [
  { label: 'Default', value: 'default' },
  { label: 'Checkmark', value: 'checkmark' },
  { label: 'Group', value: 'group' },
];

export const FORM_SELECT_OVERLAY_FILTER_PLACEHOLDER = 'Filter...';

/** Valor seleccionado en estados Fill (Float label / IftaLabel). */
export const FORM_SELECT_STATE_FILLED_VALUE: FormSelectDemoValue = 'opt-2';

export interface FormCascadeSelectCity {
  cname: string;
  code: string;
}

export interface FormCascadeSelectState {
  name: string;
  cities: FormCascadeSelectCity[];
}

export interface FormCascadeSelectCountry {
  name: string;
  code: string;
  states: FormCascadeSelectState[];
}

export const FORM_CASCADESELECT_DEMO_OPTIONS: FormCascadeSelectCountry[] = [
  {
    name: 'Australia',
    code: 'AU',
    states: [
      {
        name: 'New South Wales',
        cities: [
          { cname: 'Sydney', code: 'A-SY' },
          { cname: 'Newcastle', code: 'A-NE' },
        ],
      },
      {
        name: 'Queensland',
        cities: [
          { cname: 'Brisbane', code: 'A-BR' },
          { cname: 'Townsville', code: 'A-TO' },
        ],
      },
    ],
  },
  {
    name: 'USA',
    code: 'US',
    states: [
      {
        name: 'California',
        cities: [
          { cname: 'Los Angeles', code: 'US-LA' },
          { cname: 'San Francisco', code: 'US-SF' },
        ],
      },
    ],
  },
];

export type FormCascadeSelectDemoValue = FormCascadeSelectCity['code'];

export const FORM_CASCADESELECT_STATE_FILLED_VALUE: FormCascadeSelectDemoValue = 'A-SY';

export const FORM_CASCADESELECT_OPTION_GROUP_CHILDREN = ['states', 'cities'] as const;

export const FORM_SELECT_VARIANT_SELECT_OPTIONS = FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS;

export const FORM_INPUTTEXT_FLOAT_POSITION_SELECT_OPTIONS: {
  label: string;
  value: FormInputFloatVariant;
}[] = [
  { label: 'Over', value: 'over' },
  { label: 'On', value: 'on' },
  { label: 'In', value: 'in' },
];

export const FORM_TEXTAREA_VARIANT_SELECT_OPTIONS: {
  label: string;
  value: FormTextareaVariant;
}[] = [
  { label: 'Default', value: 'default' },
  { label: 'Float Label', value: 'floatlabel' },
  { label: 'IftaLabel', value: 'iftalabel' },
];

export const FORM_TEXTAREA_FLOAT_POSITION_SELECT_OPTIONS =
  FORM_INPUTTEXT_FLOAT_POSITION_SELECT_OPTIONS;

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
  { key: 'small', caption: 'Small', pSize: FORM_CHOICE_SIZE_LAYOUT.small.pSize },
  { key: 'normal', caption: 'Normal' },
  { key: 'large', caption: 'Large', pSize: FORM_CHOICE_SIZE_LAYOUT.large.pSize },
];

export const FORM_SIZE_SELECT_OPTIONS: { label: string; value: FormInteractionSize }[] =
  FORM_SIZE_OPTIONS.map((o) => ({ label: o.caption, value: o.key }));

/** Etiquetas de tamaño en States/Sizes e Interaction (popover). */
export const FORM_CHOICE_SIZE_DISPLAY_LABELS: Record<FormInteractionSize, string> = {
  small: 'Small',
  normal: 'Normal',
  large: 'Large',
};

/** Posición del icono en ToggleButton (PrimeNG `iconPos`). */
export const FORM_TOGGLEBUTTON_ICON_POS_OPTIONS: { label: string; value: 'left' | 'right' }[] = [
  { label: 'Izquierda', value: 'left' },
  { label: 'Derecha', value: 'right' },
];

export const FORM_SELECTBUTTON_OPTIONS = [
  { label: 'Item 1', value: 'item-1' },
  { label: 'Item 2', value: 'item-2' },
  { label: 'Item 3', value: 'item-3' },
  { label: 'Item 4', value: 'item-4' },
] as const;

export type FormSelectButtonActiveItem = 1 | 2 | 3 | 4;

export const FORM_SELECTBUTTON_ACTIVE_ITEM_OPTIONS: {
  label: string;
  value: FormSelectButtonActiveItem;
}[] = [
  { label: 'Item 1', value: 1 },
  { label: 'Item 2', value: 2 },
  { label: 'Item 3', value: 3 },
  { label: 'Item 4', value: 4 },
];

/** Layout de botones +/- en InputNumber (PrimeNG `buttonLayout`). */
export type FormInputNumberButtonLayout = 'stacked' | 'horizontal' | 'vertical';

export const FORM_INPUTNUMBER_BUTTON_LAYOUT_OPTIONS: {
  label: string;
  value: FormInputNumberButtonLayout;
}[] = [
  { label: 'Stacked', value: 'stacked' },
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];

/** Iconos +/- en layouts horizontal y vertical (stacked mantiene chevrons por defecto). */
export const FORM_INPUTNUMBER_INCREMENT_BUTTON_ICON = 'pi pi-plus';
export const FORM_INPUTNUMBER_DECREMENT_BUTTON_ICON = 'pi pi-minus';

/** Variante de formato numérico (PrimeNG InputNumber). */
export type FormInputNumberFormatVariant = 'numerals' | 'currency' | 'prefix-suffix';

export const FORM_INPUTNUMBER_FORMAT_VARIANT_OPTIONS: {
  label: string;
  value: FormInputNumberFormatVariant;
}[] = [
  { label: 'Numerals', value: 'numerals' },
  { label: 'Currency', value: 'currency' },
  { label: 'Prefix & Suffix', value: 'prefix-suffix' },
];

export interface FormInputNumberFormatVariantPreset {
  mode?: 'decimal' | 'currency';
  currency?: string;
  locale?: string;
  prefix?: string;
  suffix?: string;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  useGrouping?: boolean;
  defaultValue: number;
}

/** Presets alineados con los ejemplos de la documentación PrimeNG InputNumber. */
export const FORM_INPUTNUMBER_FORMAT_VARIANT_PRESETS: Record<
  FormInputNumberFormatVariant,
  FormInputNumberFormatVariantPreset
> = {
  numerals: {
    mode: 'decimal',
    minFractionDigits: 2,
    maxFractionDigits: 5,
    useGrouping: true,
    defaultValue: 12345.678,
  },
  currency: {
    mode: 'currency',
    currency: 'USD',
    locale: 'en-US',
    defaultValue: 1500,
  },
  'prefix-suffix': {
    mode: 'decimal',
    prefix: 'Expires in ',
    suffix: ' months',
    defaultValue: 12,
  },
};

/** Valor numérico de demostración en InputNumber (Interaction y States). */
export const FORM_INPUT_NUMBER_DEMO_VALUE = 42;

/** Texto visible del placeholder en previews estáticos InputText default. */
export const FORM_INPUT_STATE_PLACEHOLDER = 'Placeholder';

/** Helper text bajo el campo en la sección States. */
export const FORM_INPUT_STATE_HINT = 'Helper Text';

/** Mensaje de error bajo el campo en estado Invalid (InputText default y float label). */
export const FORM_INPUT_STATE_ERROR_MESSAGE = 'Error message';

/** Valor del input en estado Readonly (InputText default). */
export const FORM_INPUT_STATE_READONLY_VALUE = 'Solo lectura';

/** Longitud por defecto del showcase InputOtp. */
export const FORM_INPUT_OTP_DEFAULT_LENGTH = 4;

export const FORM_INPUT_OTP_LENGTH_SELECT_OPTIONS: { label: string; value: number }[] = [
  { label: '4 dígitos', value: 4 },
  { label: '6 dígitos', value: 6 },
];

export type FormRatingDemoState = 'normal' | 'hover' | 'focus' | 'disabled';

export const FORM_RATING_DEMO_STATES: { key: FormRatingDemoState; caption: string }[] = [
  { key: 'normal', caption: 'Default' },
  { key: 'hover', caption: 'Hover' },
  { key: 'focus', caption: 'Focus' },
  { key: 'disabled', caption: 'Disabled' },
];

export const FORM_RATING_VALUE_SELECT_OPTIONS: { label: string; value: number }[] = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
];

/** Valor de demostración en estado Readonly (InputOtp). */
export const FORM_INPUT_OTP_STATE_READONLY_VALUE = '1234';

/** Valor del input en estado Fill (Float label, sección States). */
export const FORM_INPUT_STATE_FILLED_VALUE = 'Value';

/** Valor enmascarado en estados Fill e Invalid (Password, sección States). */
export const FORM_PASSWORD_STATE_MASKED_VALUE = '********';

/** Cabecera del overlay de feedback (variante Template). */
export const FORM_PASSWORD_FEEDBACK_HEADER = 'Reset Password';

/** Texto del medidor cuando el campo está vacío. */
export const FORM_PASSWORD_FEEDBACK_PROMPT = 'Enter a password';

export type FormPasswordStrengthRuleId = 'lowercase' | 'uppercase' | 'numeric' | 'minLength';

/** Reglas del listado bajo el medidor; cada ítem aporta 25 % al strength. */
export const FORM_PASSWORD_STRENGTH_RULES: ReadonlyArray<{
  id: FormPasswordStrengthRuleId;
  label: string;
}> = [
  { id: 'lowercase', label: 'At least one lowercase' },
  { id: 'uppercase', label: 'At least one uppercase' },
  { id: 'numeric', label: 'At least one numeric' },
  { id: 'minLength', label: 'Minimum 8 characters' },
];

/** @deprecated Usar FORM_PASSWORD_STRENGTH_RULES */
export const FORM_PASSWORD_STRENGTH_REQUIREMENTS = FORM_PASSWORD_STRENGTH_RULES.map((rule) => rule.label);

export const FORM_INPUT_DEFAULT_STATES: { key: FormInputDemoState; caption: string }[] = [
  { key: 'normal', caption: 'Default' },
  { key: 'hover', caption: 'Hover' },
  { key: 'focus', caption: 'Focus' },
  { key: 'invalid', caption: 'Invalid' },
  { key: 'disabled', caption: 'Disabled' },
  { key: 'readonly', caption: 'Readonly' },
];

export const FORM_INPUT_FLOAT_STATES: { key: FormInputDemoState; caption: string }[] = [
  { key: 'empty', caption: 'Default' },
  { key: 'filled', caption: 'Fill' },
  { key: 'hover', caption: 'Hover' },
  { key: 'focus', caption: 'Focus' },
  { key: 'invalid', caption: 'Invalid' },
  { key: 'disabled', caption: 'Disabled' },
];

export const FORM_BLOCKS: FormBlockConfig[] = [
  { kind: 'radio', title: 'RadioButton', category: 'choice' },
  { kind: 'checkbox', title: 'Checkbox', category: 'choice' },
  { kind: 'toggleswitch', title: 'ToggleSwitch', category: 'choice' },
  { kind: 'togglebutton', title: 'ToggleButton', category: 'choice' },
  { kind: 'selectbutton', title: 'SelectButton', category: 'choice' },
  { kind: 'inputtext', title: 'InputText', category: 'input' },
  { kind: 'inputgroup', title: 'InputGroup', category: 'input' },
  { kind: 'inputnumber', title: 'InputNumber', category: 'input' },
  { kind: 'select', title: 'Select', category: 'input' },
  { kind: 'cascadeselect', title: 'CascadeSelect', category: 'input' },
  { kind: 'password', title: 'Password', category: 'input' },
  { kind: 'inputotp', title: 'InputOtp', category: 'input' },
  { kind: 'rating', title: 'Rating', category: 'input' },
  { kind: 'textarea', title: 'Textarea', category: 'textarea' },
];
