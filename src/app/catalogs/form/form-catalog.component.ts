import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';
import { formPlaygroundAnchorId } from '../../layout/playground-component-index';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { CatalogStateTagComponent } from '../../components/catalog/catalog-state-tag/catalog-state-tag.component';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { Divider } from 'primeng/divider';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputNumber } from 'primeng/inputnumber';
import { InputOtp } from 'primeng/inputotp';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { StarFillIcon } from 'primeng/icons/starfill';
import { StarIcon } from 'primeng/icons/star';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { Textarea } from 'primeng/textarea';
import { ToggleButton } from 'primeng/togglebutton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import {
  FORM_BLOCKS,
  FORM_CHECKBOX_OPTIONS,
  FORM_INPUT_DEFAULT_STATES,
  FORM_INPUT_FLOAT_STATES,
  FORM_INPUT_STATE_ERROR_MESSAGE,
  FORM_INPUT_STATE_PLACEHOLDER,
  FORM_INPUT_STATE_HINT,
  FORM_INPUT_STATE_FILLED_VALUE,
  FORM_INPUT_STATE_READONLY_VALUE,
  FORM_PASSWORD_STATE_MASKED_VALUE,
  FORM_PASSWORD_FEEDBACK_HEADER,
  FORM_PASSWORD_FEEDBACK_PROMPT,
  FORM_PASSWORD_STRENGTH_RULES,
  type FormPasswordStrengthRuleId,
  FORM_INPUT_NUMBER_DEMO_VALUE,
  FORM_INPUTNUMBER_BUTTON_LAYOUT_OPTIONS,
  FORM_INPUTNUMBER_DECREMENT_BUTTON_ICON,
  FORM_INPUTNUMBER_FORMAT_VARIANT_OPTIONS,
  FORM_INPUTNUMBER_FORMAT_VARIANT_PRESETS,
  FORM_INPUTNUMBER_INCREMENT_BUTTON_ICON,
  type FormInputNumberFormatVariant,
  type FormInputNumberFormatVariantPreset,
  FORM_INPUT_OTP_DEFAULT_LENGTH,
  FORM_INPUT_OTP_LENGTH_SELECT_OPTIONS,
  FORM_INPUT_OTP_STATE_READONLY_VALUE,
  FORM_INPUTTEXT_FLOAT_POSITION_SELECT_OPTIONS,
  FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS,
  FORM_RATING_DEMO_STATES,
  FORM_RATING_VALUE_SELECT_OPTIONS,
  FORM_TEXTAREA_FLOAT_POSITION_SELECT_OPTIONS,
  FORM_TEXTAREA_VARIANT_SELECT_OPTIONS,
  FORM_SELECT_DEMO_GROUPED_OPTIONS,
  FORM_SELECT_DEMO_OPTIONS,
  FORM_SELECT_OVERLAY_FILTER_PLACEHOLDER,
  FORM_SELECT_OVERLAY_OPTION_VARIANT_OPTIONS,
  FORM_SELECT_STATE_FILLED_VALUE,
  FORM_SELECT_VARIANT_SELECT_OPTIONS,
  type FormSelectOverlayOptionVariant,
  type FormSelectDemoGroup,
  FORM_RADIO_OPTIONS,
  FORM_SELECTBUTTON_ACTIVE_ITEM_OPTIONS,
  FORM_SELECTBUTTON_OPTIONS,
  FORM_CHOICE_SIZE_DISPLAY_LABELS,
  FORM_SIZE_OPTIONS,
  FORM_SIZE_SELECT_OPTIONS,
  FORM_TOGGLEBUTTON_ICON_POS_OPTIONS,
  FORM_THEME_SELECT_OPTIONS,
  type FormBlockConfig,
  type FormBlockKind,
  type FormFieldTheme,
  type FormCheckboxKey,
  type FormInputDemoState,
  type FormInputFloatVariant,
  type FormInputNumberButtonLayout,
  type FormInputTextVariant,
  type FormInteractionSize,
  type FormRatingDemoState,
  type FormSelectDemoValue,
  type FormSelectButtonActiveItem,
} from './form-catalog.config';
import { inputDemoWrapClass } from './form-catalog.demo-styles';

export interface FormSelectInteractionState {
  variant: FormInputTextVariant;
  floatPosition: FormInputFloatVariant;
  size: FormInteractionSize;
  value: FormSelectDemoValue | null;
  /** Buscador en header del overlay (PrimeNG filter). */
  showOverlayFilter: boolean;
  overlayOptionVariant: FormSelectOverlayOptionVariant;
}

export interface FormInputNumberInteractionState {
  buttonLayout: FormInputNumberButtonLayout;
  formatVariant: FormInputNumberFormatVariant;
  showHelperText: boolean;
  size: FormInteractionSize;
  value: number | null;
}

export interface FormInputTextInteractionState {
  variant: FormInputTextVariant;
  floatPosition: FormInputFloatVariant;
  /** Solo variante Default: icono de búsqueda a la izquierda. */
  iconLeft: boolean;
  iconRight: boolean;
  rounded: boolean;
  /** Muestra el helper text bajo el campo en Interaction. */
  showHelperText: boolean;
  size: FormInteractionSize;
  value: string;
}

export interface FormPasswordInteractionState {
  variant: FormInputTextVariant;
  floatPosition: FormInputFloatVariant;
  toggleMask: boolean;
  feedback: boolean;
  /** Muestra el listado de requisitos bajo el medidor (footer del overlay). */
  showStrengthList: boolean;
  showClear: boolean;
  showHelperText: boolean;
  size: FormInteractionSize;
  value: string;
}

export interface FormInputOtpInteractionState {
  length: number;
  mask: boolean;
  integerOnly: boolean;
  showHelperText: boolean;
  size: FormInteractionSize;
  value: string;
}

export interface FormRatingInteractionState {
  value: number;
  disabled: boolean;
  readonly: boolean;
}

export interface FormTextareaInteractionState {
  variant: FormInputTextVariant;
  floatPosition: FormInputFloatVariant;
  /** Muestra el helper text bajo el campo en Interaction. */
  showHelperText: boolean;
  size: FormInteractionSize;
  value: string;
}

type FormChoiceBlockKind = 'radio' | 'checkbox';

interface FormToggleButtonInteractionState {
  size: FormInteractionSize;
  withIcons: boolean;
  iconPos: 'left' | 'right';
}

interface FormSelectButtonInteractionState {
  size: FormInteractionSize;
  multiple: boolean;
  activeItem: FormSelectButtonActiveItem;
}

/** Campo al que aplican los tokens MDS de float label / ifta (input vs textarea vs password vs select). */
type FormFieldKind = 'inputtext' | 'textarea' | 'password' | 'select';

type PasswordStrengthLevel = 'none' | 'weak' | 'medium' | 'strong';

interface FormChoiceInteractionState {
  size: FormInteractionSize;
}

function defaultChoiceInteraction(): FormChoiceInteractionState {
  return { size: 'normal' };
}

function defaultInputOtpInteraction(): FormInputOtpInteractionState {
  return {
    length: FORM_INPUT_OTP_DEFAULT_LENGTH,
    mask: false,
    integerOnly: false,
    showHelperText: false,
    size: 'normal',
    value: '',
  };
}

function defaultRatingInteraction(): FormRatingInteractionState {
  return {
    value: 0,
    disabled: false,
    readonly: false,
  };
}

function defaultSelectInteraction(): FormSelectInteractionState {
  return {
    variant: 'default',
    floatPosition: 'over',
    size: 'normal',
    value: null,
    showOverlayFilter: false,
    overlayOptionVariant: 'default',
  };
}

function defaultInputNumberInteraction(): FormInputNumberInteractionState {
  const formatVariant: FormInputNumberFormatVariant = 'numerals';
  return {
    buttonLayout: 'stacked',
    formatVariant,
    showHelperText: false,
    size: 'normal',
    value: FORM_INPUTNUMBER_FORMAT_VARIANT_PRESETS[formatVariant].defaultValue,
  };
}

function defaultInputTextInteraction(): FormInputTextInteractionState {
  return {
    variant: 'default',
    floatPosition: 'over',
    iconLeft: false,
    iconRight: false,
    rounded: false,
    showHelperText: false,
    size: 'normal',
    value: '',
  };
}

function defaultPasswordInteraction(): FormPasswordInteractionState {
  return {
    variant: 'default',
    floatPosition: 'over',
    toggleMask: true,
    feedback: false,
    showStrengthList: false,
    showClear: false,
    showHelperText: false,
    size: 'normal',
    value: '',
  };
}

function defaultTextareaInteraction(): FormTextareaInteractionState {
  return {
    variant: 'default',
    floatPosition: 'over',
    showHelperText: false,
    size: 'normal',
    value: '',
  };
}

function defaultCheckboxState(): Record<FormCheckboxKey, boolean> {
  return { email: false, sms: false, push: false };
}

function defaultToggleButtonInteraction(): FormToggleButtonInteractionState {
  return { size: 'normal', withIcons: false, iconPos: 'left' };
}

function defaultSelectButtonInteraction(): FormSelectButtonInteractionState {
  return { size: 'normal', multiple: false, activeItem: 1 };
}

@Component({
  selector: 'app-form-catalog',
  standalone: true,
  imports: [
    CatalogBlockHeadTitlePipe,
    CatalogInfoBlockComponent,
    CatalogPreviewFrameComponent,
    CatalogStateTagComponent,
    Checkbox,
    Divider,
    FloatLabel,
    FormsModule,
    IconField,
    InputIcon,
    InputNumber,
    InputOtp,
    InputText,
    NgClass,
    NgTemplateOutlet,
    Password,
    RadioButton,
    Rating,
    StarFillIcon,
    StarIcon,
    Select,
    SelectButton,
    Textarea,
    ToggleButton,
    ToggleSwitch,
  ],
  templateUrl: './form-catalog.component.html',
  styleUrl: './form-catalog.component.css',
})
export class FormCatalogComponent {
  readonly formAnchorId = formPlaygroundAnchorId;
  readonly blocks = FORM_BLOCKS;
  readonly radioOptions = FORM_RADIO_OPTIONS;
  readonly checkboxOptions = FORM_CHECKBOX_OPTIONS;
  readonly sizeOptions = FORM_SIZE_OPTIONS;
  readonly sizeSelectOptions = FORM_SIZE_SELECT_OPTIONS;
  readonly inputDefaultStates = FORM_INPUT_DEFAULT_STATES;
  readonly inputFloatStates = FORM_INPUT_FLOAT_STATES;
  readonly inputnumberButtonLayoutOptions = FORM_INPUTNUMBER_BUTTON_LAYOUT_OPTIONS;
  readonly inputnumberFormatVariantOptions = FORM_INPUTNUMBER_FORMAT_VARIANT_OPTIONS;
  readonly inputotpLengthSelectOptions = FORM_INPUT_OTP_LENGTH_SELECT_OPTIONS;
  readonly ratingValueSelectOptions = FORM_RATING_VALUE_SELECT_OPTIONS;
  readonly ratingDemoStates = FORM_RATING_DEMO_STATES;
  readonly selectVariantSelectOptions = FORM_SELECT_VARIANT_SELECT_OPTIONS;
  readonly selectDemoOptions = [...FORM_SELECT_DEMO_OPTIONS];
  readonly selectDemoGroupedOptions = FORM_SELECT_DEMO_GROUPED_OPTIONS;
  readonly selectOverlayOptionVariantOptions = FORM_SELECT_OVERLAY_OPTION_VARIANT_OPTIONS;
  readonly selectOverlayFilterPlaceholder = FORM_SELECT_OVERLAY_FILTER_PLACEHOLDER;
  readonly inputtextVariantSelectOptions = FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS;
  readonly inputtextFloatPositionSelectOptions = FORM_INPUTTEXT_FLOAT_POSITION_SELECT_OPTIONS;
  readonly textareaVariantSelectOptions = FORM_TEXTAREA_VARIANT_SELECT_OPTIONS;
  readonly textareaFloatPositionSelectOptions = FORM_TEXTAREA_FLOAT_POSITION_SELECT_OPTIONS;
  readonly themeSelectOptions = FORM_THEME_SELECT_OPTIONS;
  readonly toggleButtonIconPosOptions = FORM_TOGGLEBUTTON_ICON_POS_OPTIONS;
  readonly selectButtonOptions = [...FORM_SELECTBUTTON_OPTIONS];
  readonly selectButtonActiveItemOptions = FORM_SELECTBUTTON_ACTIVE_ITEM_OPTIONS;

  private readonly formThemeByKind = signal<Record<FormBlockKind, FormFieldTheme>>({
    radio: 'outlined',
    checkbox: 'outlined',
    toggleswitch: 'outlined',
    togglebutton: 'outlined',
    selectbutton: 'outlined',
    inputtext: 'outlined',
    inputnumber: 'outlined',
    select: 'outlined',
    password: 'outlined',
    inputotp: 'outlined',
    rating: 'outlined',
    textarea: 'outlined',
  });

  readonly radioValue = signal<string | null>(null);
  readonly checkboxIx = signal<Record<FormCheckboxKey, boolean>>(defaultCheckboxState());
  readonly toggleSwitchValue = signal(false);
  readonly toggleButtonIx = signal(defaultToggleButtonInteraction());
  readonly toggleButtonValue = signal(false);
  readonly selectButtonIx = signal(defaultSelectButtonInteraction());
  /** Valor estable del showcase interactivo (evita bucle ngModel con arrays). */
  readonly selectButtonLiveValue = signal<string | string[] | null>(null);

  readonly inputtextIx = signal<FormInputTextInteractionState>(defaultInputTextInteraction());
  readonly inputnumberIx = signal<FormInputNumberInteractionState>(defaultInputNumberInteraction());
  readonly selectIx = signal<FormSelectInteractionState>(defaultSelectInteraction());
  readonly passwordIx = signal<FormPasswordInteractionState>(defaultPasswordInteraction());
  readonly inputotpIx = signal<FormInputOtpInteractionState>(defaultInputOtpInteraction());
  readonly ratingIx = signal<FormRatingInteractionState>(defaultRatingInteraction());

  /** Float Label interactivo (Select): placeholder solo con foco. */
  private readonly selectFloatIxFocused = signal(false);

  /** Select Float Label: overlay abierto mantiene label/placeholder activos (onBlur al abrir lista). */
  private readonly selectFloatOverlayOpen = signal(false);

  /** Float Label interactivo: placeholder solo mientras el campo tiene foco. */
  private readonly floatIxFocused = signal(false);

  private readonly choiceIxByKind = signal<Record<FormChoiceBlockKind, FormChoiceInteractionState>>({
    radio: defaultChoiceInteraction(),
    checkbox: defaultChoiceInteraction(),
  });

  readonly textareaIx = signal<FormTextareaInteractionState>(defaultTextareaInteraction());

  /** Float Label interactivo (Textarea): placeholder solo con foco. */
  private readonly textareaFloatIxFocused = signal(false);

  /** Float Label interactivo (Password): placeholder solo con foco. */
  private readonly passwordFloatIxFocused = signal(false);

  isChoiceBlock(block: FormBlockConfig): boolean {
    return block.category === 'choice';
  }

  isTextareaBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'textarea' } {
    return block.kind === 'textarea';
  }

  isInputTextBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'inputtext' } {
    return block.kind === 'inputtext';
  }

  isInputNumberBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'inputnumber' } {
    return block.kind === 'inputnumber';
  }

  isSelectBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'select' } {
    return block.kind === 'select';
  }

  isPasswordBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'password' } {
    return block.kind === 'password';
  }

  isInputOtpBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'inputotp' } {
    return block.kind === 'inputotp';
  }

  isRatingBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'rating' } {
    return block.kind === 'rating';
  }

  isToggleButtonBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'togglebutton' } {
    return block.kind === 'togglebutton';
  }

  isSelectButtonBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'selectbutton' } {
    return block.kind === 'selectbutton';
  }

  patchToggleButtonIx(patch: Partial<FormToggleButtonInteractionState>): void {
    this.toggleButtonIx.update((prev) => ({ ...prev, ...patch }));
  }

  patchSelectButtonIx(patch: Partial<FormSelectButtonInteractionState>): void {
    this.selectButtonIx.update((prev) => ({ ...prev, ...patch }));
    this.syncSelectButtonLiveValue();
  }

  private syncSelectButtonLiveValue(): void {
    const { multiple, activeItem } = this.selectButtonIx();
    if (multiple) {
      this.selectButtonLiveValue.set(
        FORM_SELECTBUTTON_OPTIONS.slice(0, activeItem).map((opt) => opt.value),
      );
      return;
    }
    this.selectButtonLiveValue.set(FORM_SELECTBUTTON_OPTIONS[activeItem - 1].value);
  }

  onSelectButtonValueChange(value: string | string[] | null): void {
    if (value === null || value === undefined || value === '') {
      this.selectButtonLiveValue.set(null);
      return;
    }
    this.selectButtonLiveValue.set(value);
    const ix = this.selectButtonIx();
    if (ix.multiple && Array.isArray(value)) {
      const count = Math.min(Math.max(value.length, 1), 4) as FormSelectButtonActiveItem;
      if (count !== ix.activeItem) {
        this.selectButtonIx.update((prev) => ({ ...prev, activeItem: count }));
      }
      return;
    }
    if (!ix.multiple && typeof value === 'string') {
      const idx = FORM_SELECTBUTTON_OPTIONS.findIndex((opt) => opt.value === value);
      if (idx >= 0) {
        const activeItem = (idx + 1) as FormSelectButtonActiveItem;
        if (activeItem !== ix.activeItem) {
          this.selectButtonIx.update((prev) => ({ ...prev, activeItem }));
        }
      }
    }
  }

  selectButtonPrimeSize(size: FormInteractionSize): 'small' | 'large' | undefined {
    return size === 'normal' ? undefined : size;
  }

  selectButtonHostVars(size: FormInteractionSize): Record<string, string> {
    return {
      ...this.toggleButtonHostVars(size),
      '--p-selectbutton-border-radius': 'var(--selectbutton-border-radius)',
      '--p-selectbutton-invalid-border-color': 'var(--selectbutton-invalid-border-color)',
    };
  }

  toggleButtonOnIcon(): string | undefined {
    return this.toggleButtonIx().withIcons ? 'pi pi-check' : undefined;
  }

  toggleButtonOffIcon(): string | undefined {
    return this.toggleButtonIx().withIcons ? 'pi pi-times' : undefined;
  }

  /** PrimeNG `size` en ToggleButton: solo small | large (normal = sin atributo). */
  toggleButtonPrimeSize(size: FormInteractionSize): 'small' | 'large' | undefined {
    return size === 'normal' ? undefined : size;
  }

  /**
   * Puente MDS → PrimeNG en el host de cada p-togglebutton.
   * Track (root): siempre --togglebutton-padding (2px). Área activa (.p-togglebutton-content):
   * normal / sm / lg → content-padding-* (x + y).
   */
  toggleButtonHostVars(size: FormInteractionSize): Record<string, string> {
    const base: Record<string, string> = {
      '--p-togglebutton-padding': 'var(--togglebutton-padding)',
      '--p-togglebutton-content-padding':
        'var(--togglebutton-content-padding-y) var(--togglebutton-content-padding-x)',
      '--p-togglebutton-gap': 'var(--togglebutton-gap)',
      '--p-togglebutton-font-weight': 'var(--togglebutton-font-weight)',
      '--p-togglebutton-border-radius': 'var(--togglebutton-border-radius)',
      '--p-togglebutton-content-border-radius': 'var(--togglebutton-content-border-radius)',
      '--p-togglebutton-background': 'var(--togglebutton-background)',
      '--p-togglebutton-border-color': 'var(--togglebutton-border-color)',
      '--p-togglebutton-color': 'var(--togglebutton-color)',
      '--p-togglebutton-hover-background': 'var(--togglebutton-hover-background)',
      '--p-togglebutton-hover-color': 'var(--togglebutton-hover-color)',
      '--p-togglebutton-checked-background': 'var(--togglebutton-checked-background)',
      '--p-togglebutton-checked-border-color': 'var(--togglebutton-checked-border-color)',
      '--p-togglebutton-checked-color': 'var(--togglebutton-checked-color)',
      '--p-togglebutton-content-checked-background': 'var(--togglebutton-content-checked-background)',
      '--p-togglebutton-content-checked-shadow': 'var(--togglebutton-content-shadow)',
      '--p-togglebutton-icon-color': 'var(--togglebutton-icon-color)',
      '--p-togglebutton-icon-hover-color': 'var(--togglebutton-icon-hover-color)',
      '--p-togglebutton-icon-checked-color': 'var(--togglebutton-icon-checked-color)',
      '--p-togglebutton-invalid-border-color': 'var(--togglebutton-invalid-border-color)',
      '--p-togglebutton-disabled-background': 'var(--togglebutton-disabled-background)',
      '--p-togglebutton-disabled-border-color': 'var(--togglebutton-disabled-border-color)',
      '--p-togglebutton-disabled-color': 'var(--togglebutton-disabled-color)',
    };

    if (size === 'small') {
      return {
        ...base,
        '--p-togglebutton-font-size': 'var(--togglebutton-sm-font-size)',
        '--p-togglebutton-sm-font-size': 'var(--togglebutton-sm-font-size)',
        '--p-togglebutton-sm-padding': 'var(--togglebutton-padding)',
        '--p-togglebutton-content-sm-padding':
          'var(--togglebutton-content-sm-padding-y) var(--togglebutton-content-sm-padding-x)',
      };
    }

    if (size === 'large') {
      return {
        ...base,
        '--p-togglebutton-font-size': 'var(--togglebutton-lg-font-size)',
        '--p-togglebutton-lg-font-size': 'var(--togglebutton-lg-font-size)',
        '--p-togglebutton-lg-padding': 'var(--togglebutton-padding)',
        '--p-togglebutton-content-lg-padding':
          'var(--togglebutton-content-lg-padding-y) var(--togglebutton-content-lg-padding-x)',
      };
    }

    return {
      ...base,
      '--p-togglebutton-font-size': 'var(--togglebutton-font-size)',
    };
  }

  formTheme(kind: FormBlockKind): FormFieldTheme {
    if (kind === 'toggleswitch' || kind === 'togglebutton' || kind === 'selectbutton') {
      return 'outlined';
    }
    return this.formThemeByKind()[kind];
  }

  patchFormTheme(kind: FormBlockKind, theme: FormFieldTheme): void {
    if (kind === 'toggleswitch' || kind === 'togglebutton' || kind === 'selectbutton') {
      return;
    }
    this.formThemeByKind.update((prev) => ({ ...prev, [kind]: theme }));
  }

  /** PrimeNG `variant` en InputText, InputOtp, Textarea, Checkbox y RadioButton. */
  formThemePrimeVariant(kind: FormBlockKind): 'filled' | undefined {
    return this.formTheme(kind) === 'filled' ? 'filled' : undefined;
  }

  formThemeContainerClass(kind: FormBlockKind): Record<string, boolean> {
    const theme = this.formTheme(kind);
    return {
      'form-theme-filled': theme === 'filled',
      'form-theme-outlined': theme === 'outlined',
    };
  }

  showFormSizesSection(kind: FormBlockKind): boolean {
    return kind !== 'toggleswitch' && kind !== 'rating';
  }

  inputtextIsDefault(): boolean {
    return this.inputtextIx().variant === 'default';
  }

  inputtextIsFloatLabel(): boolean {
    return this.inputtextIx().variant === 'floatlabel';
  }

  inputtextIsIftaLabel(): boolean {
    return this.inputtextIx().variant === 'iftalabel';
  }

  inputtextFloatPosition(): FormInputFloatVariant {
    return this.inputtextIx().floatPosition;
  }

  inputtextIsFloatIn(): boolean {
    return this.inputtextIsFloatLabel() && this.inputtextFloatPosition() === 'in';
  }

  inputtextIsFloatOver(): boolean {
    return this.inputtextIsFloatLabel() && this.inputtextFloatPosition() === 'over';
  }

  inputtextIsFloatOn(): boolean {
    return this.inputtextIsFloatLabel() && this.inputtextFloatPosition() === 'on';
  }

  /** Over/On comparten previews estáticos en States (label dentro vs sobre el borde). */
  inputtextIsFloatOverOrOn(): boolean {
    return this.inputtextIsFloatOver() || this.inputtextIsFloatOn();
  }

  /** Float In: label arriba siempre; Over/On solo con valor o foco. */
  inputInteractionLabelFloated(): boolean {
    if (this.inputtextIsFloatIn()) {
      return true;
    }
    if (!this.inputtextIsFloatLabel()) {
      return false;
    }
    return !!this.inputtextIx().value || this.floatIxFocused();
  }

  inputFloatStateLabelFloated(state: FormInputDemoState): boolean {
    if (this.inputtextFloatPosition() === 'in') {
      return state === 'filled' || state === 'focus' || state === 'disabled';
    }
    if (this.inputtextIsFloatOverOrOn() && state === 'disabled') {
      return true;
    }
    return state === 'focus' || state === 'filled';
  }

  /** Sizes: preview tipo Fill (label activo + valor) en todas las variantes float. */
  inputFloatSizeLabelFloated(): boolean {
    return this.inputtextIsFloatLabel();
  }

  inputFloatSizeShowsFillPreview(): boolean {
    return this.inputtextIsFloatLabel();
  }

  patchInputtext(patch: Partial<FormInputTextInteractionState>): void {
    this.inputtextIx.update((prev) => ({ ...prev, ...patch }));
  }

  patchInputnumber(patch: Partial<FormInputNumberInteractionState>): void {
    this.inputnumberIx.update((prev) => ({ ...prev, ...patch }));
  }

  patchInputnumberFormatVariant(formatVariant: FormInputNumberFormatVariant): void {
    const preset = FORM_INPUTNUMBER_FORMAT_VARIANT_PRESETS[formatVariant];
    this.patchInputnumber({ formatVariant, value: preset.defaultValue });
  }

  inputnumberFormatVariantPreset(): FormInputNumberFormatVariantPreset {
    return FORM_INPUTNUMBER_FORMAT_VARIANT_PRESETS[this.inputnumberIx().formatVariant];
  }

  inputnumberPrimeSize(size: FormInteractionSize): 'small' | 'large' | undefined {
    return size === 'normal' ? undefined : size;
  }

  inputnumberIncrementButtonIcon(layout: FormInputNumberButtonLayout): string | undefined {
    return layout === 'stacked' ? undefined : FORM_INPUTNUMBER_INCREMENT_BUTTON_ICON;
  }

  inputnumberDecrementButtonIcon(layout: FormInputNumberButtonLayout): string | undefined {
    return layout === 'stacked' ? undefined : FORM_INPUTNUMBER_DECREMENT_BUTTON_ICON;
  }

  /** Puente explícito Core MDS → PrimeNG (--p-inputnumber-* + input interno). */
  inputNumberHostVars(): Record<string, string> {
    return {
      '--p-inputnumber-button-background': 'var(--inputnumber-button-background)',
      '--p-inputnumber-button-border-color': 'var(--inputnumber-button-border-color)',
      '--p-inputnumber-button-border-radius': 'var(--inputnumber-button-border-radius)',
      '--p-inputnumber-button-color': 'var(--inputnumber-button-color)',
      '--p-inputnumber-button-disabled-background': 'var(--inputnumber-button-disabled-background)',
      '--p-inputnumber-button-disabled-color': 'var(--inputnumber-button-disabled-color)',
      '--p-inputnumber-button-hover-background': 'var(--inputnumber-button-hover-background)',
      '--p-inputnumber-button-hover-border-color': 'var(--inputnumber-button-hover-border-color)',
      '--p-inputnumber-button-hover-color': 'var(--inputnumber-button-hover-color)',
      '--p-inputnumber-button-active-background': 'var(--inputnumber-button-active-background)',
      '--p-inputnumber-button-active-border-color': 'var(--inputnumber-button-active-border-color)',
      '--p-inputnumber-button-active-color': 'var(--inputnumber-button-active-color)',
      '--p-inputnumber-button-invalid-border-color': 'var(--inputnumber-button-invalid-border-color)',
      '--p-inputnumber-button-vertical-padding': 'var(--inputnumber-button-vertical-padding)',
      '--p-inputnumber-button-width': 'var(--inputnumber-button-width)',
      '--p-inputtext-border-color': 'var(--inputtext-border-color)',
      '--p-inputtext-disabled-background': 'var(--inputtext-disabled-background)',
      '--p-inputtext-disabled-color': 'var(--inputtext-disabled-color)',
    };
  }

  inputNumberStateValue(state: FormInputDemoState): number | null {
    if (state === 'readonly') {
      return FORM_INPUT_NUMBER_DEMO_VALUE;
    }
    if (
      state === 'normal' ||
      state === 'hover' ||
      state === 'focus' ||
      state === 'invalid' ||
      state === 'disabled'
    ) {
      return null;
    }
    return FORM_INPUT_NUMBER_DEMO_VALUE;
  }

  selectIsDefault(): boolean {
    return this.selectIx().variant === 'default';
  }

  selectIsFloatLabel(): boolean {
    return this.selectIx().variant === 'floatlabel';
  }

  selectIsIftaLabel(): boolean {
    return this.selectIx().variant === 'iftalabel';
  }

  selectFloatPosition(): FormInputFloatVariant {
    return this.selectIx().floatPosition;
  }

  selectIsFloatIn(): boolean {
    return this.selectIsFloatLabel() && this.selectFloatPosition() === 'in';
  }

  selectIsFloatOverOrOn(): boolean {
    return (
      this.selectIsFloatLabel() &&
      (this.selectFloatPosition() === 'over' || this.selectFloatPosition() === 'on')
    );
  }

  selectInteractionLabelFloated(): boolean {
    if (!this.selectIsFloatLabel()) {
      return false;
    }
    return (
      !!this.selectIx().value ||
      this.selectFloatIxFocused() ||
      this.selectFloatOverlayOpen()
    );
  }

  selectFloatStateLabelFloated(state: FormInputDemoState): boolean {
    if (this.selectFloatPosition() === 'in') {
      return state === 'filled' || state === 'focus' || state === 'disabled';
    }
    if (this.selectIsFloatOverOrOn() && state === 'disabled') {
      return true;
    }
    return state === 'focus' || state === 'filled';
  }

  selectFloatSizeLabelFloated(): boolean {
    if (!this.selectIsFloatLabel()) {
      return false;
    }
    return true;
  }

  patchSelect(patch: Partial<FormSelectInteractionState>): void {
    this.selectIx.update((prev) => {
      const next = { ...prev, ...patch };
      if (
        patch.overlayOptionVariant !== undefined &&
        patch.overlayOptionVariant !== prev.overlayOptionVariant
      ) {
        next.value = null;
      }
      return next;
    });
    if (patch.variant !== undefined || patch.floatPosition !== undefined) {
      this.selectFloatIxFocused.set(false);
      this.selectFloatOverlayOpen.set(false);
    }
  }

  setSelectFloatIxFocused(focused: boolean): void {
    if (!this.selectIsFloatLabel()) {
      return;
    }
    if (!focused && this.selectFloatOverlayOpen()) {
      return;
    }
    this.selectFloatIxFocused.set(focused);
  }

  setSelectFloatOverlayOpen(open: boolean): void {
    if (!this.selectIsFloatLabel()) {
      return;
    }
    this.selectFloatOverlayOpen.set(open);
    if (open) {
      this.selectFloatIxFocused.set(true);
    } else if (!this.selectIx().value) {
      this.selectFloatIxFocused.set(false);
    }
  }

  selectFloatInteractionPlaceholder(): string | null {
    if (this.selectIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    if (!this.selectFloatIxFocused() && !this.selectFloatOverlayOpen()) {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  /** Placeholder en Interaction: Default e IftaLabel siempre; Float Label solo con foco/overlay. */
  selectInteractionPlaceholder(): string {
    if (this.selectIsDefault() || this.selectIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    return this.selectFloatInteractionPlaceholder() ?? '';
  }

  selectInteractionScopeClass(): Record<string, boolean> {
    const sx = this.selectIx();
    return {
      'input-variant-block': true,
      'form-input-interaction--stacked': sx.variant === 'floatlabel' || sx.variant === 'iftalabel',
      'floatlabel-variant-over': sx.variant === 'floatlabel' && sx.floatPosition === 'over',
      'floatlabel-variant-on': sx.variant === 'floatlabel' && sx.floatPosition === 'on',
      'floatlabel-variant-in': sx.variant === 'floatlabel' && sx.floatPosition === 'in',
      'iftalabel-variant': sx.variant === 'iftalabel',
    };
  }

  selectPrimeSize(size: FormInteractionSize): 'small' | 'large' | undefined {
    return this.inputotpPrimeSize(size);
  }

  selectInteractionOptions(): typeof this.selectDemoOptions | FormSelectDemoGroup[] {
    if (this.selectIx().overlayOptionVariant === 'group') {
      return this.selectDemoGroupedOptions;
    }
    return this.selectDemoOptions;
  }

  selectInteractionOverlayPanelClass(): string | undefined {
    return this.selectInteractionGroup() ? 'catalog-select-overlay--group' : undefined;
  }

  /** País sin emoji duplicado cuando label ya incluye el emoji (fallback PrimeNG). */
  selectGroupCountryLabel(optionGroup: FormSelectDemoGroup): string {
    const emoji = optionGroup.emoji?.trim();
    const label = optionGroup.label?.trim() ?? '';
    if (emoji && label.startsWith(emoji)) {
      return label.slice(emoji.length).trimStart();
    }
    return label;
  }

  selectInteractionCheckmark(): boolean {
    return this.selectIx().overlayOptionVariant === 'checkmark';
  }

  selectInteractionGroup(): boolean {
    return this.selectIx().overlayOptionVariant === 'group';
  }

  private selectOverlayHostVars(): Record<string, string> {
    return {
      '--p-select-overlay-background': 'var(--select-overlay-background)',
      '--p-select-overlay-border-color': 'var(--select-overlay-border-color)',
      '--p-select-overlay-border-radius': 'var(--select-overlay-border-radius)',
      '--p-select-overlay-color': 'var(--select-overlay-color)',
      '--p-select-overlay-shadow': 'var(--select-overlay-shadow)',
      '--p-select-list-padding': 'var(--list-padding, var(--dimension-scale-x4))',
      '--p-select-list-gap': 'var(--select-list-gap)',
      '--p-select-list-header-padding': 'var(--list-header-padding, var(--form-field-padding-y) var(--form-field-padding-x))',
      '--p-select-option-padding': 'var(--list-option-padding, var(--form-field-sm-padding-y) var(--form-field-padding-x))',
      '--p-select-option-border-radius': 'var(--select-option-border-radius)',
      '--p-select-option-color': 'var(--select-option-color)',
      '--p-select-option-focus-background': 'var(--select-option-focus-background)',
      '--p-select-option-focus-color': 'var(--select-option-focus-color)',
      '--p-select-option-selected-background': 'var(--select-option-selected-background)',
      '--p-select-option-selected-color': 'var(--select-option-selected-color)',
      '--p-select-option-selected-focus-background': 'var(--select-option-selected-focus-background)',
      '--p-select-option-selected-focus-color': 'var(--select-option-selected-focus-color)',
      '--p-select-option-group-padding': 'var(--list-option-group-padding, var(--form-field-sm-padding-y) var(--form-field-padding-x))',
      '--p-select-empty-message-padding': 'var(--list-option-padding, var(--form-field-sm-padding-y) var(--form-field-padding-x))',
    };
  }

  selectHostVars(size: FormInteractionSize = 'normal'): Record<string, string> {
    return {
      '--p-select-background': 'var(--select-background)',
      '--p-select-border-color': 'var(--select-border-color)',
      '--p-select-border-radius': 'var(--select-border-radius)',
      '--p-select-color': 'var(--select-color)',
      '--p-select-padding-x': `var(${this.fieldPaddingXToken('select', size)})`,
      '--p-select-padding-y': `var(${this.fieldPaddingYToken('select', size)})`,
      '--p-select-placeholder-color': 'var(--select-placeholder-color)',
      '--p-select-dropdown-color': 'var(--select-dropdown-color)',
      '--p-select-dropdown-width': 'var(--select-dropdown-width)',
      '--p-select-focus-border-color': 'var(--select-focus-border-color)',
      '--p-select-hover-border-color': 'var(--select-hover-border-color)',
      '--p-select-invalid-border-color': 'var(--select-invalid-border-color)',
      '--p-select-shadow': 'var(--select-shadow)',
      '--p-select-sm-font-size': 'var(--select-sm-font-size)',
      '--p-select-sm-padding-x': 'var(--select-sm-padding-x)',
      '--p-select-sm-padding-y': 'var(--select-sm-padding-y)',
      '--p-select-lg-font-size': 'var(--select-lg-font-size)',
      '--p-select-lg-padding-x': 'var(--select-lg-padding-x)',
      '--p-select-lg-padding-y': 'var(--select-lg-padding-y)',
      ...this.selectOverlayHostVars(),
    };
  }

  selectFloatLabelHostVars(): Record<string, string> {
    const sx = this.selectIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, sx.size, 'select');
  }

  selectIftaLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return this.iftaLabelHostVars(size, 'select');
  }

  selectFloatLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    const sx = this.selectIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, size, 'select');
  }

  selectFloatLabelStatesHostVars(): Record<string, string> {
    const sx = this.selectIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, 'normal', 'select');
  }

  selectFloatPlaceholderAttr(state: FormInputDemoState): string | null {
    if (this.selectIsIftaLabel()) {
      if (state === 'filled') {
        return null;
      }
      return this.inputStatePlaceholder;
    }
    if (this.selectIsFloatLabel()) {
      if (state === 'focus') {
        return this.inputStatePlaceholder;
      }
      return null;
    }
    if (state === 'empty' || state === 'filled') {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  selectStateValue(state: FormInputDemoState): FormSelectDemoValue | null {
    if (this.selectIsDefault()) {
      if (this.inputStateShowsPlaceholderOnly({ kind: 'select', title: 'Select', category: 'input' }, state)) {
        return null;
      }
      if (state === 'readonly') {
        return FORM_SELECT_STATE_FILLED_VALUE;
      }
      return null;
    }
    if (state === 'filled' || state === 'disabled') {
      return FORM_SELECT_STATE_FILLED_VALUE;
    }
    return null;
  }

  patchPassword(patch: Partial<FormPasswordInteractionState>): void {
    this.passwordIx.update((prev) => ({ ...prev, ...patch }));
  }

  passwordIsDefault(): boolean {
    return this.passwordIx().variant === 'default';
  }

  passwordIsFloatLabel(): boolean {
    return this.passwordIx().variant === 'floatlabel';
  }

  passwordIsIftaLabel(): boolean {
    return this.passwordIx().variant === 'iftalabel';
  }

  passwordFloatPosition(): FormInputFloatVariant {
    return this.passwordIx().floatPosition;
  }

  passwordIsFloatIn(): boolean {
    return this.passwordIsFloatLabel() && this.passwordFloatPosition() === 'in';
  }

  passwordInteractionLabelFloated(): boolean {
    if (this.passwordIsFloatIn()) {
      return true;
    }
    if (!this.passwordIsFloatLabel()) {
      return false;
    }
    return !!this.passwordIx().value || this.passwordFloatIxFocused();
  }

  passwordFloatStateLabelFloated(state: FormInputDemoState): boolean {
    if (this.passwordFloatPosition() === 'in') {
      return true;
    }
    return this.inputFloatFilled(state);
  }

  passwordFloatSizeLabelFloated(): boolean {
    if (!this.passwordIsFloatLabel()) {
      return false;
    }
    return true;
  }

  setPasswordFloatIxFocused(focused: boolean): void {
    if (!this.passwordIsFloatLabel()) {
      return;
    }
    this.passwordFloatIxFocused.set(focused);
  }

  passwordInteractionScopeClass(): Record<string, boolean> {
    const pw = this.passwordIx();
    return {
      ...this.formThemeContainerClass('password'),
      'input-variant-block': true,
      'form-input-interaction--stacked': pw.variant === 'floatlabel' || pw.variant === 'iftalabel',
      'floatlabel-variant-over': pw.variant === 'floatlabel' && pw.floatPosition === 'over',
      'floatlabel-variant-on': pw.variant === 'floatlabel' && pw.floatPosition === 'on',
      'floatlabel-variant-in': pw.variant === 'floatlabel' && pw.floatPosition === 'in',
      'iftalabel-variant': pw.variant === 'iftalabel',
      'show-right-icon': pw.toggleMask,
    };
  }

  passwordFloatLabelHostVars(): Record<string, string> {
    const ix = this.passwordIx();
    return this.floatLabelHostVarsForVariant(ix.variant, ix.floatPosition, ix.size, 'password');
  }

  passwordFloatLabelStatesHostVars(): Record<string, string> {
    const ix = this.passwordIx();
    return this.floatLabelHostVarsForVariant(ix.variant, ix.floatPosition, 'normal', 'password');
  }

  passwordFloatLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    const ix = this.passwordIx();
    return this.floatLabelHostVarsForVariant(ix.variant, ix.floatPosition, size, 'password');
  }

  passwordIftaLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return this.iftaLabelHostVars(size, 'password');
  }

  patchInputotp(patch: Partial<FormInputOtpInteractionState>): void {
    this.inputotpIx.update((prev) => {
      const next = { ...prev, ...patch };
      if (patch.length !== undefined && next.value.length > patch.length) {
        next.value = next.value.slice(0, patch.length);
      }
      return next;
    });
  }

  patchRating(patch: Partial<FormRatingInteractionState>): void {
    this.ratingIx.update((prev) => ({ ...prev, ...patch }));
  }

  /** PrimeNG `size` en InputOtp / Password: omite en Normal. */
  inputotpPrimeSize(size: FormInteractionSize): 'small' | 'large' | undefined {
    return size === 'normal' ? undefined : size;
  }

  passwordPrimeSize(size: FormInteractionSize): 'small' | 'large' | undefined {
    return this.inputotpPrimeSize(size);
  }

  /** Icono toggle mask: escala MDS alineada con IconField / InputText por tamaño. */
  private passwordMaskIconSizeMdsToken(size: FormInteractionSize): string {
    if (size === 'small') {
      return '--iconfield-figma-sm-icon-size';
    }
    if (size === 'large') {
      return '--iconfield-figma-lg-icon-size';
    }
    return '--iconfield-figma-size';
  }

  private passwordMaskIconInsetMdsToken(size: FormInteractionSize): string {
    if (size === 'small') {
      return '--inputtext-sm-padding-x';
    }
    if (size === 'large') {
      return '--inputtext-lg-padding-x';
    }
    return '--inputtext-padding-x';
  }

  private passwordInputIconPaddingEndMdsToken(size: FormInteractionSize): string {
    if (size === 'small') {
      return '--inputtext-with-icon-padding-start-sm';
    }
    if (size === 'large') {
      return '--inputtext-with-icon-padding-start-lg';
    }
    return '--inputtext-with-icon-padding-start';
  }

  /**
   * Variables en p-password: puente Core MDS → PrimeNG (--p-password-*)
   * + icono toggle mask dimensionado por size (PrimeNG usa icon.size fijo).
   */
  passwordHostVars(size: FormInteractionSize = 'normal'): Record<string, string> {
    const iconSize = `var(${this.passwordMaskIconSizeMdsToken(size)})`;
    const iconInset = `var(${this.passwordMaskIconInsetMdsToken(size)})`;
    const inputPaddingEnd = `var(${this.passwordInputIconPaddingEndMdsToken(size)})`;
    return {
      '--p-password-content-gap': 'var(--password-content-gap)',
      '--p-password-icon-color': 'var(--password-icon-color)',
      '--p-password-meter-background': 'var(--password-meter-background)',
      '--p-password-meter-border-radius': 'var(--password-meter-border-radius)',
      '--p-password-meter-height': 'var(--password-meter-height)',
      '--p-password-overlay-background': 'var(--password-overlay-background)',
      '--p-password-overlay-border-color': 'var(--password-overlay-border-color)',
      '--p-password-overlay-border-radius': 'var(--password-overlay-border-radius)',
      '--p-password-overlay-color': 'var(--password-overlay-color)',
      '--p-password-overlay-padding': 'var(--password-overlay-padding)',
      '--p-password-overlay-shadow': 'var(--password-overlay-shadow)',
      '--p-password-strength-weak-background': 'var(--password-strength-week-background)',
      '--p-password-strength-medium-background': 'var(--password-strength-medium-background)',
      '--p-password-strength-strong-background': 'var(--password-strength-strong-background)',
      '--catalog-password-mask-icon-size': iconSize,
      '--catalog-password-mask-icon-inset': iconInset,
      '--catalog-password-input-icon-padding-end': inputPaddingEnd,
    };
  }

  readonly passwordStrengthRules = FORM_PASSWORD_STRENGTH_RULES;

  passwordStrengthRuleMet(ruleId: FormPasswordStrengthRuleId, value: string): boolean {
    switch (ruleId) {
      case 'lowercase':
        return /[a-z]/.test(value);
      case 'uppercase':
        return /[A-Z]/.test(value);
      case 'numeric':
        return /\d/.test(value);
      case 'minLength':
        return value.length >= 8;
    }
  }

  passwordStrengthMetCount(value: string): number {
    return FORM_PASSWORD_STRENGTH_RULES.filter((rule) => this.passwordStrengthRuleMet(rule.id, value)).length;
  }

  passwordStrengthLevel(value: string): PasswordStrengthLevel {
    const met = this.passwordStrengthMetCount(value);
    if (met === 0) {
      return 'none';
    }
    if (met <= 2) {
      return 'weak';
    }
    if (met === 3) {
      return 'medium';
    }
    return 'strong';
  }

  passwordStrengthMeterWidth(value: string): number {
    return (this.passwordStrengthMetCount(value) / FORM_PASSWORD_STRENGTH_RULES.length) * 100;
  }

  passwordStrengthMeterLabel(value: string): string {
    switch (this.passwordStrengthLevel(value)) {
      case 'weak':
        return 'Weak';
      case 'medium':
        return 'Medium';
      case 'strong':
        return 'Strong';
      default:
        return FORM_PASSWORD_FEEDBACK_PROMPT;
    }
  }

  /** Token MDS de lado de celda OTP (ancho = alto) según tamaño. */
  private inputOtpCellWidthMdsToken(size: FormInteractionSize): string {
    if (size === 'small') {
      return '--inputotp-input-sm-width';
    }
    if (size === 'large') {
      return '--inputotp-input-lg-width';
    }
    return '--inputotp-input-width';
  }

  /**
   * Variables en p-inputotp: puente explícito Core MDS → PrimeNG (--p-inputotp-*)
   * y tamaño cuadrado compartido por las celdas.
   */
  inputOtpHostVars(size: FormInteractionSize): Record<string, string> {
    const cell = `var(${this.inputOtpCellWidthMdsToken(size)})`;
    return {
      '--catalog-inputotp-cell-size': cell,
      '--p-inputotp-gap': 'var(--inputotp-input-gap)',
      '--p-inputotp-input-width': 'var(--inputotp-input-width)',
      '--p-inputotp-input-sm-width': 'var(--inputotp-input-sm-width)',
      '--p-inputotp-input-lg-width': 'var(--inputotp-input-lg-width)',
    };
  }

  /**
   * Variables en p-rating: puente explícito Core MDS → PrimeNG (--p-rating-*).
   */
  ratingHostVars(): Record<string, string> {
    return {
      '--p-rating-gap': 'var(--rating-gap)',
      '--p-rating-icon-size': 'var(--rating-icon-size)',
      '--p-rating-icon-color': 'var(--rating-icon-color)',
      '--p-rating-icon-hover-color': 'var(--rating-icon-hover-color)',
      '--p-rating-icon-active-color': 'var(--rating-icon-active-color)',
      '--p-rating-icon-disabled-color': 'var(--rating-icon-disabled-color)',
      '--p-rating-focus-ring-width': 'var(--rating-focus-ring-width)',
      '--p-rating-focus-ring-color': 'var(--rating-focus-ring-color)',
      '--p-rating-focus-ring-offset': 'var(--rating-focus-ring-offset)',
      '--p-rating-focus-ring-shadow': 'var(--rating-focus-ring-shadow)',
    };
  }

  ratingStateDisabled(state: FormRatingDemoState): boolean {
    return state === 'disabled';
  }

  /** States: icono relleno solo en Disabled; resto usa estrella vacía. */
  ratingIconActive(state: FormRatingDemoState): boolean {
    return state === 'disabled';
  }

  ratingIconStateWrapClass(state: FormRatingDemoState): string {
    return state === 'hover' ? 'p-input-demo-wrap p-input-demo--hover' : '';
  }

  inputOtpDemoValue(length: number, state: FormInputDemoState): string {
    if (state === 'readonly') {
      const seed = FORM_INPUT_OTP_STATE_READONLY_VALUE;
      return seed.slice(0, length).padEnd(length, seed.slice(-1));
    }
    return '';
  }

  setFloatIxFocused(focused: boolean): void {
    if (!this.inputtextIsFloatLabel()) {
      return;
    }
    this.floatIxFocused.set(focused);
  }

  textareaIsDefault(): boolean {
    return this.textareaIx().variant === 'default';
  }

  textareaIsFloatLabel(): boolean {
    return this.textareaIx().variant === 'floatlabel';
  }

  textareaIsIftaLabel(): boolean {
    return this.textareaIx().variant === 'iftalabel';
  }

  textareaFloatPosition(): FormInputFloatVariant {
    return this.textareaIx().floatPosition;
  }

  textareaIsFloatIn(): boolean {
    return this.textareaIsFloatLabel() && this.textareaFloatPosition() === 'in';
  }

  /** Float In: label arriba siempre; Over/On solo con valor o foco. */
  textareaInteractionLabelFloated(): boolean {
    if (this.textareaIsFloatIn()) {
      return true;
    }
    if (!this.textareaIsFloatLabel()) {
      return false;
    }
    return !!this.textareaIx().value || this.textareaFloatIxFocused();
  }

  textareaFloatStateLabelFloated(state: FormInputDemoState): boolean {
    if (this.textareaFloatPosition() === 'in') {
      return true;
    }
    return this.inputFloatFilled(state);
  }

  /** Sizes: Over/On elevan label; In siempre arriba. */
  textareaFloatSizeLabelFloated(): boolean {
    if (!this.textareaIsFloatLabel()) {
      return false;
    }
    return true;
  }

  patchTextarea(patch: Partial<FormTextareaInteractionState>): void {
    this.textareaIx.update((prev) => ({ ...prev, ...patch }));
  }

  /**
   * Altura dinámica controlada por nosotros:
   * - crece con el contenido
   * - pero NO fuerza cambios cuando el usuario solo redimensiona manualmente
   */
  private textareaResizeToContent(el: HTMLTextAreaElement): void {
    // Permite "medir" el contenido sin el height anterior.
    el.style.height = 'auto';
    const minHeightPx = parseFloat(getComputedStyle(el).minHeight || '0') || 0;
    const nextHeightPx = Math.max(el.scrollHeight, minHeightPx);
    el.style.height = `${nextHeightPx}px`;
  }

  /** Auto-grow al escribir (sin PrimeNG autoResize; el usuario puede redimensionar con el asa). */
  onTextareaInput(e: Event): void {
    const el = e.target as HTMLTextAreaElement | null;
    if (!el) return;
    requestAnimationFrame(() => this.textareaResizeToContent(el));
  }

  setTextareaFloatIxFocused(focused: boolean): void {
    if (!this.textareaIsFloatLabel()) {
      return;
    }
    this.textareaFloatIxFocused.set(focused);
  }

  textareaFloatInteractionPlaceholder(): string | null {
    if (this.textareaIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    if (!this.textareaFloatIxFocused()) {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  textareaInteractionScopeClass(): Record<string, boolean> {
    const tx = this.textareaIx();
    return {
      'input-variant-block': true,
      'form-input-interaction--stacked': tx.variant === 'floatlabel' || tx.variant === 'iftalabel',
      'floatlabel-variant-over': tx.variant === 'floatlabel' && tx.floatPosition === 'over',
      'floatlabel-variant-on': tx.variant === 'floatlabel' && tx.floatPosition === 'on',
      'floatlabel-variant-in': tx.variant === 'floatlabel' && tx.floatPosition === 'in',
      'iftalabel-variant': tx.variant === 'iftalabel',
    };
  }

  /** Token MDS de inset-inline-start del label según tamaño (popover Interaction). */
  floatLabelPositionMdsToken(size: FormInteractionSize): string {
    if (size === 'small') {
      return '--floatlabel-position-sm-x';
    }
    if (size === 'large') {
      return '--floatlabel-position-lg-x';
    }
    return '--floatlabel-position-x';
  }

  /** Token MDS de inset vertical del label in-field (Float In / Ifta). */
  private floatLabelPositionYMdsToken(size: FormInteractionSize): string {
    if (size === 'small') {
      return '--form-field-sm-position-y';
    }
    if (size === 'large') {
      return '--form-field-lg-padding-y';
    }
    return '--form-field-padding-y';
  }

  /** Tipografía del valor en el campo (label in-field en float; placeholder en ifta). */
  private fieldInfieldFontSizeMdsToken(field: FormFieldKind, size: FormInteractionSize): string {
    if (field === 'textarea') {
      if (size === 'small') {
        return '--textarea-sm-font-size';
      }
      if (size === 'large') {
        return '--textarea-lg-font-size';
      }
      return '--textarea-font-size';
    }
    if (field === 'select') {
      if (size === 'small') {
        return '--select-sm-font-size';
      }
      if (size === 'large') {
        return '--select-lg-font-size';
      }
      return '--inputtext-font-size';
    }
    if (size === 'small') {
      return '--inputtext-sm-font-size';
    }
    if (size === 'large') {
      return '--inputtext-lg-font-size';
    }
    return '--inputtext-font-size';
  }

  private fieldPaddingXToken(field: FormFieldKind, size: FormInteractionSize): string {
    if (field === 'textarea') {
      if (size === 'small') {
        return '--textarea-sm-padding-x';
      }
      if (size === 'large') {
        return '--textarea-lg-padding-x';
      }
      return '--textarea-padding-x';
    }
    if (field === 'select') {
      if (size === 'small') {
        return '--select-sm-padding-x';
      }
      if (size === 'large') {
        return '--select-lg-padding-x';
      }
      return '--select-padding-x';
    }
    if (size === 'small') {
      return '--inputtext-sm-padding-x';
    }
    if (size === 'large') {
      return '--inputtext-lg-padding-x';
    }
    return '--inputtext-padding-x';
  }

  private fieldPaddingYToken(field: FormFieldKind, size: FormInteractionSize): string {
    if (field === 'textarea') {
      if (size === 'small') {
        return '--textarea-sm-padding-y';
      }
      if (size === 'large') {
        return '--textarea-lg-padding-y';
      }
      return '--textarea-padding-y';
    }
    if (field === 'select') {
      if (size === 'small') {
        return '--select-sm-padding-y';
      }
      if (size === 'large') {
        return '--select-lg-padding-y';
      }
      return '--select-padding-y';
    }
    if (size === 'small') {
      return '--inputtext-sm-padding-y';
    }
    if (size === 'large') {
      return '--inputtext-lg-padding-y';
    }
    return '--inputtext-padding-y';
  }

  private floatIconSizeMdsToken(size: FormInteractionSize): string {
    if (size === 'small') {
      return '--iconfield-figma-sm-icon-size';
    }
    if (size === 'large') {
      return '--iconfield-figma-lg-icon-size';
    }
    return '--iconfield-figma-size';
  }

  private floatLabelFieldStyleVars(
    size: FormInteractionSize,
    field: FormFieldKind,
  ): Record<string, string> {
    const positionValue = `var(${this.floatLabelPositionMdsToken(size)})`;
    const fontValue = `var(${this.fieldInfieldFontSizeMdsToken(field, size)})`;
    const positionYValue = `var(${this.floatLabelPositionYMdsToken(size)})`;
    const overActiveBackground =
      field === 'textarea'
        ? 'var(--textarea-background, var(--p-textarea-background, var(--form-field-background)))'
        : field === 'select'
          ? 'var(--select-background, var(--p-select-background, var(--form-field-background)))'
          : 'var(--inputtext-background, var(--p-inputtext-background, var(--form-field-background)))';
    return {
      '--p-floatlabel-position-x': positionValue,
      '--catalog-floatlabel-position-x': positionValue,
      '--p-floatlabel-position-y': positionYValue,
      '--catalog-floatlabel-position-y': positionYValue,
      '--p-floatlabel-infield-font-size': fontValue,
      '--catalog-floatlabel-infield-font-size': fontValue,
      '--p-floatlabel-over-active-background': overActiveBackground,
      '--p-floatlabel-over-active-top':
        'var(--floatlabel-over-active-top, calc(-1 * (var(--floatlabel-active-font-size, var(--form-field-xs-font-size)) + var(--floatlabel-over-active-gap, var(--dimension-scale-x6))))',
      '--catalog-floatlabel-over-active-top':
        'var(--floatlabel-over-active-top, calc(-1 * (var(--floatlabel-active-font-size, var(--form-field-xs-font-size)) + var(--floatlabel-over-active-gap, var(--dimension-scale-x6))))',
    };
  }

  /** Altura Float In con cadena MDS → puente PrimeNG → px (tokens sm/lg no vienen en export). */
  private floatLabelInMinHeightExpr(size: FormInteractionSize): string {
    if (size === 'small') {
      return 'var(--floatlabel-in-input-min-height-sm, var(--iftalabel-input-min-height-sm, 45px))';
    }
    if (size === 'large') {
      return 'var(--floatlabel-in-input-min-height-lg, var(--iftalabel-input-min-height-lg, 49px))';
    }
    return 'var(--floatlabel-in-input-min-height, var(--iftalabel-input-min-height, 47px))';
  }

  /** Gap label xs ↔ valor en Float In (2px normal/sm; lg x4). */
  private floatLabelInGapExpr(size: FormInteractionSize): string {
    if (size === 'large') {
      return 'var(--dimension-scale-x4)';
    }
    return 'var(--dimension-scale-x2)';
  }

  /** Layout vertical Float In: Normal tokens estáticos MDS; sm/lg centran label xs + gap + valor en min-height. */
  private floatLabelInVerticalLayout(
    size: FormInteractionSize,
    field: FormFieldKind,
    minHeight: string,
    gap: string,
  ): { activeTop: string; paddingTop: string; paddingBottom: string } {
    if (size === 'normal') {
      return {
        activeTop: 'var(--floatlabel-in-active-top, var(--form-field-padding-y))',
        paddingTop: 'var(--floatlabel-in-input-padding-top, var(--iftalabel-input-padding-top))',
        paddingBottom: 'var(--floatlabel-in-input-padding-bottom, var(--form-field-padding-y))',
      };
    }

    const activeFont = 'var(--floatlabel-active-font-size)';
    const infieldFont = this.fieldInfieldFontSizeMdsToken(field, size);
    const lineHeightVar =
      field === 'textarea' ? '--textarea-line-height' : '--inputtext-line-height';
    const activeTopExpr = `((${minHeight} - ${activeFont} - ${gap} - (var(${infieldFont}) * var(${lineHeightVar}, 1.25))) / 2)`;

    return {
      activeTop: `calc(${activeTopExpr})`,
      paddingTop: `calc(${activeTopExpr} + ${activeFont} + ${gap})`,
      paddingBottom: `calc(${activeTopExpr})`,
    };
  }

  /**
   * Float In: Normal usa tokens estáticos del core MDS; sm/lg centran label xs + gap + valor
   * dentro de min-height (misma lógica que IftaLabel).
   */
  private floatLabelInHostVars(size: FormInteractionSize, field: FormFieldKind): Record<string, string> {
    const pick = (normal: string, small: string, large: string): string => {
      if (size === 'small') {
        return small;
      }
      if (size === 'large') {
        return large;
      }
      return normal;
    };
    const cssVar = (token: string) => `var(${token})`;

    const minHeight = this.floatLabelInMinHeightExpr(size);
    const gap = this.floatLabelInGapExpr(size);
    const { activeTop, paddingTop, paddingBottom } = this.floatLabelInVerticalLayout(size, field, minHeight, gap);

    const paddingX = this.fieldPaddingXToken(field, size);
    const iconPaddingEnd =
      field === 'textarea'
        ? paddingX
        : field === 'select'
          ? `calc(var(${paddingX}) + var(--select-dropdown-width, var(--p-select-dropdown-width, var(--dimension-scale-x32, 32px))))`
          : pick(
              '--inputtext-with-icon-padding-start',
              '--inputtext-with-icon-padding-start-sm',
              '--inputtext-with-icon-padding-start-lg',
            );

    const vars: Record<string, string> = {
      '--catalog-floatlabel-in-input-padding-top': paddingTop,
      '--p-floatlabel-in-input-padding-top': paddingTop,
      '--catalog-floatlabel-in-input-min-height': minHeight,
      '--p-floatlabel-in-input-min-height': minHeight,
      '--catalog-floatlabel-in-input-padding-bottom': paddingBottom,
      '--p-floatlabel-in-input-padding-bottom': paddingBottom,
      '--catalog-floatlabel-in-active-top': activeTop,
      '--p-floatlabel-in-active-top': activeTop,
      '--catalog-floatlabel-in-input-padding-x': cssVar(paddingX),
      '--catalog-floatlabel-in-icon-padding-end': cssVar(iconPaddingEnd),
    };

    if (size === 'small') {
      vars['--p-floatlabel-in-input-min-height-sm'] = minHeight;
      vars['--p-floatlabel-in-input-padding-top-sm'] = paddingTop;
      vars['--p-floatlabel-in-input-padding-bottom-sm'] = paddingBottom;
    } else if (size === 'large') {
      vars['--p-floatlabel-in-input-min-height-lg'] = minHeight;
      vars['--p-floatlabel-in-input-padding-top-lg'] = paddingTop;
      vars['--p-floatlabel-in-input-padding-bottom-lg'] = paddingBottom;
    }

    return vars;
  }

  /** Textarea + label in-field (IftaLabel / Float In): padding-top bajo label xs + gap. */
  private textareaInfieldLabelHostVars(size: FormInteractionSize): Record<string, string> {
    const paddingY = `var(${this.fieldPaddingYToken('textarea', size)})`;
    const paddingX = `var(${this.fieldPaddingXToken('textarea', size)})`;
    const minHeight = this.floatLabelInMinHeightExpr(size);
    const gap = this.floatLabelInGapExpr(size);
    const { activeTop: labelTop, paddingTop, paddingBottom } = this.floatLabelInVerticalLayout(
      size,
      'textarea',
      minHeight,
      gap,
    );

    return {
      '--catalog-floatlabel-in-active-top': labelTop,
      '--p-floatlabel-in-active-top': labelTop,
      '--catalog-iftalabel-top': labelTop,
      '--p-iftalabel-top': labelTop,
      '--catalog-floatlabel-in-input-padding-top': paddingTop,
      '--p-floatlabel-in-input-padding-top': paddingTop,
      '--p-iftalabel-input-padding-top': paddingTop,
      '--catalog-floatlabel-in-input-padding-bottom': paddingBottom,
      '--p-floatlabel-in-input-padding-bottom': paddingBottom,
      '--p-iftalabel-input-padding-bottom': paddingY,
      '--catalog-floatlabel-in-input-padding-x': paddingX,
    };
  }

  /**
   * IftaLabel + Textarea: label en padding-y; valor/placeholder debajo (label xs + 2px gap).
   */
  private iftaLabelTextareaHostVars(size: FormInteractionSize): Record<string, string> {
    const field = this.floatLabelFieldStyleVars(size, 'textarea');
    return {
      ...field,
      ...this.textareaInfieldLabelHostVars(size),
      '--p-iftalabel-font-size': 'var(--floatlabel-active-font-size)',
      '--p-iftalabel-font-weight': 'var(--floatlabel-active-font-weight)',
      '--p-iftalabel-position-x': field['--p-floatlabel-position-x'],
    };
  }

  /**
   * IftaLabel + InputText / Password: label en --iftalabel-top (position-y); valor debajo con
   * --iftalabel-input-padding-top (22px normal) o position-y + label xs + gap (sm/lg).
   */
  private iftaLabelInputtextHostVars(
    size: FormInteractionSize,
    field: 'inputtext' | 'password' | 'select' = 'inputtext',
  ): Record<string, string> {
    const fieldVars = this.floatLabelFieldStyleVars(size, field);
    const paddingYToken = this.fieldPaddingYToken(field, size);
    const paddingY = `var(${paddingYToken})`;
    const paddingX = `var(${this.fieldPaddingXToken(field, size)})`;
    const minHeight = this.floatLabelInMinHeightExpr(size);
    const gap = this.floatLabelInGapExpr(size);
    const { activeTop: labelTop, paddingTop, paddingBottom } = this.floatLabelInVerticalLayout(
      size,
      field,
      minHeight,
      gap,
    );

    return {
      ...fieldVars,
      '--catalog-iftalabel-top': labelTop,
      '--p-iftalabel-top': labelTop,
      '--catalog-floatlabel-in-active-top': labelTop,
      '--p-floatlabel-in-active-top': labelTop,
      '--catalog-floatlabel-in-input-padding-top': paddingTop,
      '--p-floatlabel-in-input-padding-top': paddingTop,
      '--p-iftalabel-input-padding-top': paddingTop,
      '--catalog-floatlabel-in-input-padding-bottom': paddingBottom,
      '--p-floatlabel-in-input-padding-bottom': paddingBottom,
      '--p-iftalabel-input-padding-bottom': 'var(--iftalabel-input-padding-bottom, var(--form-field-padding-y))',
      '--catalog-floatlabel-in-input-min-height': minHeight,
      '--p-floatlabel-in-input-min-height': minHeight,
      '--p-iftalabel-input-min-height': minHeight,
      '--catalog-floatlabel-in-input-padding-x': paddingX,
      '--p-iftalabel-font-size': 'var(--floatlabel-active-font-size)',
      '--p-iftalabel-font-weight': 'var(--floatlabel-active-font-weight)',
      '--p-iftalabel-position-x': fieldVars['--p-floatlabel-position-x'],
    };
  }

  private iftaLabelHostVars(size: FormInteractionSize, fieldKind: FormFieldKind): Record<string, string> {
    const iconVars = {
      '--p-iconfield-icon-size': `var(${this.floatIconSizeMdsToken(size)})`,
      '--p-iconfield-sm-icon-size': 'var(--iconfield-figma-sm-icon-size)',
      '--p-iconfield-lg-icon-size': 'var(--iconfield-figma-lg-icon-size)',
    };
    if (fieldKind === 'textarea') {
      return { ...this.iftaLabelTextareaHostVars(size), ...iconVars };
    }
    if (fieldKind === 'select') {
      return { ...this.iftaLabelInputtextHostVars(size, 'select'), ...iconVars };
    }
    return {
      ...this.iftaLabelInputtextHostVars(size, fieldKind === 'password' ? 'password' : 'inputtext'),
      ...iconVars,
    };
  }

  /** Variables en p-floatlabel / p-iftalabel (PrimeNG 20 + catálogo MDS). */
  private floatLabelHostVarsForVariant(
    variant: FormInputTextVariant,
    floatPosition: FormInputFloatVariant,
    size: FormInteractionSize,
    field: FormFieldKind,
  ): Record<string, string> {
    if (variant === 'iftalabel') {
      return this.iftaLabelHostVars(size, field);
    }
    const vars = this.floatLabelFieldStyleVars(size, field);
    if (variant !== 'floatlabel') {
      return vars;
    }
    const iconSize = `var(${this.floatIconSizeMdsToken(size)})`;
    const shared = {
      ...vars,
      '--p-iconfield-icon-size': iconSize,
      '--p-iconfield-sm-icon-size': 'var(--iconfield-figma-sm-icon-size)',
      '--p-iconfield-lg-icon-size': 'var(--iconfield-figma-lg-icon-size)',
    };
    if (floatPosition === 'in') {
      if (field === 'textarea') {
        return {
          ...shared,
          ...this.textareaInfieldLabelHostVars(size),
        };
      }
      return { ...shared, ...this.floatLabelInHostVars(size, field) };
    }
    return shared;
  }

  floatLabelHostVars(): Record<string, string> {
    const ix = this.inputtextIx();
    return this.floatLabelHostVarsForVariant(ix.variant, ix.floatPosition, ix.size, 'inputtext');
  }

  textareaFloatLabelHostVars(): Record<string, string> {
    const tx = this.textareaIx();
    return this.floatLabelHostVarsForVariant(tx.variant, tx.floatPosition, tx.size, 'textarea');
  }

  iftaLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return this.iftaLabelHostVars(size, 'inputtext');
  }

  textareaIftaLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return this.iftaLabelHostVars(size, 'textarea');
  }

  floatLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    const ix = this.inputtextIx();
    return this.floatLabelHostVarsForVariant(ix.variant, ix.floatPosition, size, 'inputtext');
  }

  textareaFloatLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    const tx = this.textareaIx();
    return this.floatLabelHostVarsForVariant(tx.variant, tx.floatPosition, size, 'textarea');
  }

  /** Fila States: siempre tamaño Normal (no sigue el selector Size de Interacción). */
  floatLabelStatesHostVars(): Record<string, string> {
    const ix = this.inputtextIx();
    return this.floatLabelHostVarsForVariant(ix.variant, ix.floatPosition, 'normal', 'inputtext');
  }

  textareaFloatLabelStatesHostVars(): Record<string, string> {
    const tx = this.textareaIx();
    return this.floatLabelHostVarsForVariant(tx.variant, tx.floatPosition, 'normal', 'textarea');
  }

  /** Placeholder en foco (token --p-inputtext-placeholder-color); sin foco y vacío, sin atributo. */
  floatInteractionPlaceholder(): string | null {
    if (this.inputtextIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    if (!this.floatIxFocused()) {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  choiceIx(kind: FormChoiceBlockKind): FormChoiceInteractionState {
    return this.choiceIxByKind()[kind];
  }

  patchChoiceIx(kind: FormChoiceBlockKind, patch: Partial<FormChoiceInteractionState>): void {
    this.choiceIxByKind.update((all) => ({
      ...all,
      [kind]: { ...all[kind], ...patch },
    }));
  }

  /** PrimeNG `size` en Radio/Checkbox: omite en Normal; usa tokens --p-*-sm / --p-*-lg. */
  choicePrimeSize(size: FormInteractionSize): 'small' | 'large' | undefined {
    return size === 'normal' ? undefined : size;
  }

  /** Label + gap del texto junto al control (tokens form-field-*-font-size). */
  choiceSizeClass(size: FormInteractionSize): Record<string, boolean> {
    return {
      'form-choice--sm': size === 'small',
      'form-choice--lg': size === 'large',
    };
  }

  choiceSizeDisplayLabel(size: FormInteractionSize): string {
    return FORM_CHOICE_SIZE_DISPLAY_LABELS[size];
  }

  inputtextRounded(): boolean {
    return this.inputtextIx().rounded;
  }

  inputtextShowIcon(): boolean {
    const ix = this.inputtextIx();
    if (ix.variant === 'default') {
      return ix.iconLeft || ix.iconRight;
    }
    return ix.iconRight;
  }

  inputtextIconPosition(): 'left' | 'right' {
    const ix = this.inputtextIx();
    if (ix.variant === 'default' && ix.iconLeft && !ix.iconRight) {
      return 'left';
    }
    return 'right';
  }

  inputtextDualIcons(): boolean {
    const ix = this.inputtextIx();
    return ix.variant === 'default' && ix.iconLeft && ix.iconRight;
  }

  inputtextShowIconLeft(): boolean {
    return this.inputtextIsDefault() && this.inputtextIx().iconLeft;
  }

  inputtextShowIconRight(): boolean {
    return this.inputtextIx().iconRight;
  }

  inputStates(block: FormBlockConfig): { key: FormInputDemoState; caption: string }[] {
    if (this.isSelectBlock(block)) {
      return this.selectIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
    }
    if (this.isTextareaBlock(block)) {
      return this.textareaIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
    }
    if (this.isInputTextBlock(block)) {
      return this.inputtextIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
    }
    if (this.isPasswordBlock(block)) {
      return this.passwordIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
    }
    if (this.isInputOtpBlock(block)) {
      return this.inputDefaultStates;
    }
    if (this.isInputNumberBlock(block)) {
      return this.inputDefaultStates;
    }
    return this.inputDefaultStates;
  }

  textareaSizeClass(size: FormInteractionSize): Record<string, boolean> {
    return {
      'p-textarea-sm': size === 'small',
      'p-textarea-lg': size === 'large',
    };
  }

  inputDemoWrap(state: FormInputDemoState | FormRatingDemoState): string {
    return inputDemoWrapClass(state as FormInputDemoState);
  }

  checkboxChecked(key: FormCheckboxKey): boolean {
    return this.checkboxIx()[key];
  }

  patchCheckbox(key: FormCheckboxKey, checked: boolean): void {
    this.checkboxIx.update((all) => ({ ...all, [key]: checked }));
  }

  readonly inputStatePlaceholder = FORM_INPUT_STATE_PLACEHOLDER;
  readonly inputStateHint = FORM_INPUT_STATE_HINT;
  readonly inputStateErrorMessage = FORM_INPUT_STATE_ERROR_MESSAGE;
  readonly inputStateReadonlyValue = FORM_INPUT_STATE_READONLY_VALUE;
  readonly inputStateFilledValue = FORM_INPUT_STATE_FILLED_VALUE;
  readonly inputOtpStateReadonlyValue = FORM_INPUT_OTP_STATE_READONLY_VALUE;
  readonly passwordFeedbackHeader = FORM_PASSWORD_FEEDBACK_HEADER;

  /** Preview estático: el input no lleva valor, solo placeholder (tokens). */
  inputStateShowsPlaceholderOnly(block: FormBlockConfig, state: FormInputDemoState): boolean {
    const isDefaultField =
      (this.isSelectBlock(block) && this.selectIsDefault()) ||
      (this.isTextareaBlock(block) && this.textareaIsDefault()) ||
      (this.isInputTextBlock(block) && this.inputtextIsDefault());
    if (isDefaultField) {
      return (
        state === 'normal' ||
        state === 'hover' ||
        state === 'focus' ||
        state === 'invalid' ||
        state === 'disabled'
      );
    }
    if (this.isInputOtpBlock(block)) {
      return (
        state === 'normal' ||
        state === 'hover' ||
        state === 'focus' ||
        state === 'invalid' ||
        state === 'disabled'
      );
    }
    if (this.isInputNumberBlock(block)) {
      return (
        state === 'normal' ||
        state === 'hover' ||
        state === 'focus' ||
        state === 'invalid' ||
        state === 'disabled'
      );
    }
    if (this.isTextareaBlock(block) || this.isInputTextBlock(block) || this.isSelectBlock(block)) {
      if (this.isInputTextBlock(block) && this.inputtextIsFloatOverOrOn() && (state === 'disabled' || state === 'focus')) {
        return false;
      }
      if (this.isInputTextBlock(block) && this.inputtextIsFloatIn() && (state === 'disabled' || state === 'focus')) {
        return false;
      }
      return state === 'hover' || state === 'focus' || state === 'invalid' || state === 'disabled';
    }
    return false;
  }

  /**
   * FloatLabel estático (InputText): sin placeholder en vacío/fill.
   */
  inputFloatPlaceholderAttr(state: FormInputDemoState): string | null {
    if (this.inputtextIsIftaLabel()) {
      if (state === 'filled') {
        return null;
      }
      return this.inputStatePlaceholder;
    }
    if (this.inputtextIsFloatOverOrOn() || this.inputtextIsFloatIn()) {
      return null;
    }
    if (state === 'empty' || state === 'filled') {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  /** FloatLabel estático (Textarea). */
  textareaFloatPlaceholderAttr(state: FormInputDemoState): string | null {
    if (this.textareaIsIftaLabel()) {
      if (state === 'filled') {
        return null;
      }
      return this.inputStatePlaceholder;
    }
    if (state === 'empty' || state === 'filled') {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  inputStateShowErrorMessage(block: FormBlockConfig, state: FormInputDemoState): boolean {
    if (state !== 'invalid') {
      return false;
    }
    return this.isTextareaBlock(block) || this.isInputTextBlock(block) || this.isSelectBlock(block) || this.isPasswordBlock(block) || this.isInputOtpBlock(block) || this.isInputNumberBlock(block);
  }

  inputStateShowHint(block: FormBlockConfig, state: FormInputDemoState): boolean {
    return !this.inputStateShowErrorMessage(block, state);
  }

  inputStateValue(state: FormInputDemoState, block: FormBlockConfig): string {
    if (this.isPasswordBlock(block)) {
      if (state === 'filled' || state === 'invalid') {
        return FORM_PASSWORD_STATE_MASKED_VALUE;
      }
      if (state === 'readonly') {
        return this.inputStateReadonlyValue;
      }
      return '';
    }
    if (this.inputStateShowsPlaceholderOnly(block, state)) {
      return '';
    }
    if (this.isTextareaBlock(block) && !this.textareaIsDefault() && state === 'filled') {
      return FORM_INPUT_STATE_FILLED_VALUE;
    }
    if (this.isTextareaBlock(block) && !this.textareaIsDefault()) {
      return '';
    }
    if (this.isInputTextBlock(block) && !this.inputtextIsDefault() && state === 'filled') {
      return FORM_INPUT_STATE_FILLED_VALUE;
    }
    if (this.isInputTextBlock(block) && this.inputtextIsFloatOverOrOn() && (state === 'disabled' || state === 'focus')) {
      return FORM_INPUT_STATE_FILLED_VALUE;
    }
    if (this.isInputTextBlock(block) && this.inputtextIsFloatIn() && (state === 'disabled' || state === 'focus')) {
      return FORM_INPUT_STATE_FILLED_VALUE;
    }
    if (this.isInputTextBlock(block) && !this.inputtextIsDefault()) {
      return '';
    }
    if (this.isInputOtpBlock(block)) {
      return this.inputOtpDemoValue(this.inputotpIx().length, state);
    }
    switch (state) {
      case 'readonly':
        return this.inputStateReadonlyValue;
      default:
        return '';
    }
  }

  inputStateInvalid(state: FormInputDemoState): boolean {
    return state === 'invalid';
  }

  inputStateDisabled(state: FormInputDemoState): boolean {
    return state === 'disabled';
  }

  /** Preview estático: solo Disabled queda editable en el DOM (atributo disabled). */
  inputStateReadonly(state: FormInputDemoState): boolean {
    return state !== 'disabled';
  }

  inputFloatFilled(state: FormInputDemoState): boolean {
    return state !== 'empty';
  }

  interactionScopeClass(): Record<string, boolean> {
    const ix = this.inputtextIx();
    return {
      'input-variant-block': true,
      'form-input-interaction--stacked': ix.variant === 'floatlabel' || ix.variant === 'iftalabel',
      'floatlabel-variant-over': ix.variant === 'floatlabel' && ix.floatPosition === 'over',
      'floatlabel-variant-on': ix.variant === 'floatlabel' && ix.floatPosition === 'on',
      'floatlabel-variant-in': ix.variant === 'floatlabel' && ix.floatPosition === 'in',
      'iftalabel-variant': ix.variant === 'iftalabel',
      'show-left-icon': ix.variant === 'default' && ix.iconLeft,
      'show-right-icon': ix.iconRight,
    };
  }

  inputSizeClass(size: FormInteractionSize): Record<string, boolean> {
    return {
      'p-inputtext-sm': size === 'small',
      'p-inputtext-lg': size === 'large',
    };
  }
}
