import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { formPlaygroundAnchorId } from '../../layout/playground-component-index';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { Divider } from 'primeng/divider';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputOtp } from 'primeng/inputotp';
import { InputText } from 'primeng/inputtext';
import { Popover } from 'primeng/popover';
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
  FORM_INPUT_OTP_DEFAULT_LENGTH,
  FORM_INPUT_OTP_LENGTH_SELECT_OPTIONS,
  FORM_INPUT_OTP_STATE_READONLY_VALUE,
  FORM_INPUTTEXT_FLOAT_POSITION_SELECT_OPTIONS,
  FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS,
  FORM_RATING_DEMO_STATES,
  FORM_RATING_VALUE_SELECT_OPTIONS,
  FORM_TEXTAREA_FLOAT_POSITION_SELECT_OPTIONS,
  FORM_TEXTAREA_VARIANT_SELECT_OPTIONS,
  FORM_RADIO_OPTIONS,
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
  type FormInputTextVariant,
  type FormInteractionSize,
  type FormRatingDemoState,
} from './form-catalog.config';
import { inputDemoWrapClass } from './form-catalog.demo-styles';

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

/** Campo al que aplican los tokens MDS de float label / ifta (input vs textarea). */
type FormFieldKind = 'inputtext' | 'textarea';

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
    value: 3,
    disabled: false,
    readonly: false,
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
  return { email: true, sms: false, push: true };
}

function defaultToggleButtonInteraction(): FormToggleButtonInteractionState {
  return { size: 'normal', withIcons: false, iconPos: 'left' };
}

@Component({
  selector: 'app-form-catalog',
  standalone: true,
  imports: [
    Checkbox,
    Divider,
    FloatLabel,
    FormsModule,
    IconField,
    InputIcon,
    InputOtp,
    InputText,
    NgClass,
    Popover,
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
  readonly inputotpLengthSelectOptions = FORM_INPUT_OTP_LENGTH_SELECT_OPTIONS;
  readonly ratingValueSelectOptions = FORM_RATING_VALUE_SELECT_OPTIONS;
  readonly ratingDemoStates = FORM_RATING_DEMO_STATES;
  readonly inputtextVariantSelectOptions = FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS;
  readonly inputtextFloatPositionSelectOptions = FORM_INPUTTEXT_FLOAT_POSITION_SELECT_OPTIONS;
  readonly textareaVariantSelectOptions = FORM_TEXTAREA_VARIANT_SELECT_OPTIONS;
  readonly textareaFloatPositionSelectOptions = FORM_TEXTAREA_FLOAT_POSITION_SELECT_OPTIONS;
  readonly themeSelectOptions = FORM_THEME_SELECT_OPTIONS;
  readonly toggleButtonIconPosOptions = FORM_TOGGLEBUTTON_ICON_POS_OPTIONS;

  private readonly formThemeByKind = signal<Record<FormBlockKind, FormFieldTheme>>({
    radio: 'outlined',
    checkbox: 'outlined',
    toggleswitch: 'outlined',
    togglebutton: 'outlined',
    inputtext: 'outlined',
    inputotp: 'outlined',
    rating: 'outlined',
    textarea: 'outlined',
  });

  readonly radioValue = signal('visa');
  readonly checkboxIx = signal<Record<FormCheckboxKey, boolean>>(defaultCheckboxState());
  readonly toggleOff = signal(false);
  readonly toggleOn = signal(true);
  readonly toggleButtonIx = signal(defaultToggleButtonInteraction());
  readonly toggleButtonOff = signal(false);
  readonly toggleButtonOn = signal(true);

  readonly inputtextIx = signal<FormInputTextInteractionState>(defaultInputTextInteraction());
  readonly inputotpIx = signal<FormInputOtpInteractionState>(defaultInputOtpInteraction());
  readonly ratingIx = signal<FormRatingInteractionState>(defaultRatingInteraction());

  /** Float Label interactivo: placeholder solo mientras el campo tiene foco. */
  private readonly floatIxFocused = signal(false);

  private readonly choiceIxByKind = signal<Record<FormChoiceBlockKind, FormChoiceInteractionState>>({
    radio: defaultChoiceInteraction(),
    checkbox: defaultChoiceInteraction(),
  });

  readonly textareaIx = signal<FormTextareaInteractionState>(defaultTextareaInteraction());

  /** Float Label interactivo (Textarea): placeholder solo con foco. */
  private readonly textareaFloatIxFocused = signal(false);

  isChoiceBlock(block: FormBlockConfig): boolean {
    return block.category === 'choice';
  }

  isTextareaBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'textarea' } {
    return block.kind === 'textarea';
  }

  isInputTextBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'inputtext' } {
    return block.kind === 'inputtext';
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

  patchToggleButtonIx(patch: Partial<FormToggleButtonInteractionState>): void {
    this.toggleButtonIx.update((prev) => ({ ...prev, ...patch }));
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
    if (kind === 'toggleswitch' || kind === 'togglebutton') {
      return 'outlined';
    }
    return this.formThemeByKind()[kind];
  }

  patchFormTheme(kind: FormBlockKind, theme: FormFieldTheme): void {
    if (kind === 'toggleswitch' || kind === 'togglebutton') {
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
      return true;
    }
    return this.inputFloatFilled(state);
  }

  /** Sizes: Over/On elevan label; In siempre arriba. */
  inputFloatSizeLabelFloated(): boolean {
    if (!this.inputtextIsFloatLabel()) {
      return false;
    }
    return true;
  }

  patchInputtext(patch: Partial<FormInputTextInteractionState>): void {
    this.inputtextIx.update((prev) => ({ ...prev, ...patch }));
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

  /** PrimeNG `size` en InputOtp: omite en Normal. */
  inputotpPrimeSize(size: FormInteractionSize): 'small' | 'large' | undefined {
    return size === 'normal' ? undefined : size;
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
    const positionYValue = `var(${this.fieldPaddingYToken(field, size)})`;
    const overActiveBackground =
      field === 'textarea'
        ? 'var(--textarea-background, var(--p-textarea-background, var(--form-field-background)))'
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

  /**
   * Float In: altura MDS (45 / 47 / 49 px) y bloque label+valor centrado verticalmente.
   * padding-top/bottom simétricos; gap 2px entre label xs y línea de valor.
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

    const minHeight = pick(
      '--floatlabel-in-input-min-height',
      '--floatlabel-in-input-min-height-sm',
      '--floatlabel-in-input-min-height-lg',
    );
    const infieldFont = this.fieldInfieldFontSizeMdsToken(field, size);
    const lineHeightVar = field === 'textarea' ? '--textarea-line-height' : '--inputtext-line-height';
    const valueLine = `calc(var(${infieldFont}) * var(${lineHeightVar}, 1.25))`;
    const contentBlock = `calc(var(--floatlabel-active-font-size) + 2px + ${valueLine})`;
    const activeTop = `calc((${cssVar(minHeight)} - ${contentBlock}) / 2)`;
    const paddingTop = `calc(${activeTop} + var(--floatlabel-active-font-size) + 2px)`;
    const paddingBottom = activeTop;
    const paddingX = this.fieldPaddingXToken(field, size);
    const iconPaddingEnd =
      field === 'textarea'
        ? paddingX
        : pick(
            '--inputtext-with-icon-padding-start',
            '--inputtext-with-icon-padding-start-sm',
            '--inputtext-with-icon-padding-start-lg',
          );

    return {
      '--catalog-floatlabel-in-input-padding-top': paddingTop,
      '--p-floatlabel-in-input-padding-top': paddingTop,
      '--catalog-floatlabel-in-input-min-height': cssVar(minHeight),
      '--p-floatlabel-in-input-min-height': cssVar(minHeight),
      '--catalog-floatlabel-in-input-padding-bottom': paddingBottom,
      '--p-floatlabel-in-input-padding-bottom': paddingBottom,
      '--catalog-floatlabel-in-active-top': activeTop,
      '--p-floatlabel-in-active-top': activeTop,
      '--catalog-floatlabel-in-input-padding-x': cssVar(paddingX),
      '--catalog-floatlabel-in-icon-padding-end': cssVar(iconPaddingEnd),
    };
  }

  /** Textarea + label in-field (IftaLabel / Float In): padding-top bajo label xs + gap. */
  private textareaInfieldLabelHostVars(size: FormInteractionSize): Record<string, string> {
    const paddingY = `var(${this.fieldPaddingYToken('textarea', size)})`;
    const paddingX = `var(${this.fieldPaddingXToken('textarea', size)})`;
    const activeFont = 'var(--floatlabel-active-font-size)';
    const labelTop = paddingY;
    const paddingTop = `calc(${labelTop} + ${activeFont} + 2px)`;

    return {
      '--catalog-floatlabel-in-active-top': labelTop,
      '--p-floatlabel-in-active-top': labelTop,
      '--catalog-iftalabel-top': labelTop,
      '--p-iftalabel-top': labelTop,
      '--catalog-floatlabel-in-input-padding-top': paddingTop,
      '--p-floatlabel-in-input-padding-top': paddingTop,
      '--p-iftalabel-input-padding-top': paddingTop,
      '--catalog-floatlabel-in-input-padding-bottom': paddingY,
      '--p-floatlabel-in-input-padding-bottom': paddingY,
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
   * IftaLabel + InputText: label en --iftalabel-top (padding-y); valor debajo con
   * --iftalabel-input-padding-top (22px normal) o padding-y + label xs + gap x4 (sm/lg).
   */
  private iftaLabelInputtextHostVars(size: FormInteractionSize): Record<string, string> {
    const field = this.floatLabelFieldStyleVars(size, 'inputtext');
    const paddingYToken = this.fieldPaddingYToken('inputtext', size);
    const paddingY = `var(${paddingYToken})`;
    const paddingX = `var(${this.fieldPaddingXToken('inputtext', size)})`;
    const labelTop = `var(--iftalabel-top, ${paddingY})`;
    const gap = 'var(--dimension-scale-x4)';
    const activeFont = 'var(--floatlabel-active-font-size)';
    const paddingTop =
      size === 'normal'
        ? 'var(--iftalabel-input-padding-top)'
        : `calc(${paddingY} + ${activeFont} + ${gap})`;

    const pick = (normal: string, small: string, large: string): string => {
      if (size === 'small') {
        return small;
      }
      if (size === 'large') {
        return large;
      }
      return normal;
    };
    const minHeight = `var(${pick(
      '--iftalabel-input-min-height',
      '--iftalabel-input-min-height-sm',
      '--iftalabel-input-min-height-lg',
    )})`;

    return {
      ...field,
      '--catalog-iftalabel-top': labelTop,
      '--p-iftalabel-top': labelTop,
      '--catalog-floatlabel-in-active-top': labelTop,
      '--p-floatlabel-in-active-top': labelTop,
      '--catalog-floatlabel-in-input-padding-top': paddingTop,
      '--p-floatlabel-in-input-padding-top': paddingTop,
      '--p-iftalabel-input-padding-top': paddingTop,
      '--catalog-floatlabel-in-input-padding-bottom': paddingY,
      '--p-floatlabel-in-input-padding-bottom': paddingY,
      '--p-iftalabel-input-padding-bottom': 'var(--iftalabel-input-padding-bottom, var(--form-field-padding-y))',
      '--catalog-floatlabel-in-input-min-height': minHeight,
      '--p-floatlabel-in-input-min-height': minHeight,
      '--p-iftalabel-input-min-height': minHeight,
      '--catalog-floatlabel-in-input-padding-x': paddingX,
      '--p-iftalabel-font-size': activeFont,
      '--p-iftalabel-font-weight': 'var(--floatlabel-active-font-weight)',
      '--p-iftalabel-position-x': field['--p-floatlabel-position-x'],
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
    return {
      ...this.iftaLabelInputtextHostVars(size),
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
    if (this.isTextareaBlock(block)) {
      return this.textareaIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
    }
    if (this.isInputTextBlock(block)) {
      return this.inputtextIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
    }
    if (this.isInputOtpBlock(block)) {
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
  readonly inputOtpStateReadonlyValue = FORM_INPUT_OTP_STATE_READONLY_VALUE;

  /** Preview estático: el input no lleva valor, solo placeholder (tokens). */
  inputStateShowsPlaceholderOnly(block: FormBlockConfig, state: FormInputDemoState): boolean {
    const isDefaultField =
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
    if (this.isTextareaBlock(block) || this.isInputTextBlock(block)) {
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
    return this.isTextareaBlock(block) || this.isInputTextBlock(block) || this.isInputOtpBlock(block);
  }

  inputStateShowHint(block: FormBlockConfig, state: FormInputDemoState): boolean {
    return !this.inputStateShowErrorMessage(block, state);
  }

  inputStateValue(state: FormInputDemoState, block: FormBlockConfig): string {
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
