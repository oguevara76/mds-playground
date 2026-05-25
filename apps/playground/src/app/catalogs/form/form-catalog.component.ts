import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { Divider } from 'primeng/divider';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Popover } from 'primeng/popover';
import { RadioButton } from 'primeng/radiobutton';
import { SelectButton } from 'primeng/selectbutton';
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
  FORM_RADIO_OPTIONS,
  FORM_CHOICE_SIZE_DISPLAY_LABELS,
  FORM_SIZE_OPTIONS,
  FORM_SIZE_SELECT_OPTIONS,
  type FormBlockConfig,
  type FormBlockKind,
  type FormCheckboxKey,
  type FormInputDemoState,
  type FormInputFloatVariant,
  type FormInteractionSize,
} from './form-catalog.config';
import { inputDemoWrapClass } from './form-catalog.demo-styles';

export interface FormInputInteractionState {
  iconRight: boolean;
  rounded: boolean;
  size: FormInteractionSize;
  value: string;
}

type FormInputBlockKind =
  | 'input-default'
  | 'input-float-over'
  | 'input-float-on'
  | 'input-float-in'
  | 'input-iftalabel';

type FormChoiceBlockKind = 'radio' | 'checkbox';

interface FormChoiceInteractionState {
  size: FormInteractionSize;
}

function defaultChoiceInteraction(): FormChoiceInteractionState {
  return { size: 'normal' };
}

const INPUT_BLOCK_KINDS: FormInputBlockKind[] = [
  'input-default',
  'input-float-over',
  'input-float-on',
  'input-float-in',
  'input-iftalabel',
];

function defaultInputInteraction(): FormInputInteractionState {
  return {
    iconRight: false,
    rounded: false,
    size: 'normal',
    value: '',
  };
}

/** FloatLabel (Over/On/In): solo icono derecho en el configurador. */
function defaultFloatInputInteraction(): FormInputInteractionState {
  return {
    iconRight: true,
    rounded: false,
    size: 'normal',
    value: '',
  };
}

function defaultCheckboxState(): Record<FormCheckboxKey, boolean> {
  return { email: true, sms: false, push: true };
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
    InputText,
    NgClass,
    Popover,
    RadioButton,
    SelectButton,
    ToggleSwitch,
  ],
  templateUrl: './form-catalog.component.html',
  styleUrl: './form-catalog.component.css',
})
export class FormCatalogComponent {
  readonly blocks = FORM_BLOCKS;
  readonly radioOptions = FORM_RADIO_OPTIONS;
  readonly checkboxOptions = FORM_CHECKBOX_OPTIONS;
  readonly sizeOptions = FORM_SIZE_OPTIONS;
  readonly sizeSelectOptions = FORM_SIZE_SELECT_OPTIONS;
  readonly inputDefaultStates = FORM_INPUT_DEFAULT_STATES;
  readonly inputFloatStates = FORM_INPUT_FLOAT_STATES;

  readonly radioValue = signal('visa');
  readonly checkboxIx = signal<Record<FormCheckboxKey, boolean>>(defaultCheckboxState());
  readonly toggleOff = signal(false);
  readonly toggleOn = signal(true);

  private readonly inputIxByKind = signal<Record<FormInputBlockKind, FormInputInteractionState>>({
    'input-default': defaultInputInteraction(),
    'input-float-over': defaultFloatInputInteraction(),
    'input-float-on': defaultFloatInputInteraction(),
    'input-float-in': defaultFloatInputInteraction(),
    'input-iftalabel': defaultInputInteraction(),
  });

  /** FloatLabel Interaction: placeholder solo mientras el campo tiene foco. */
  private readonly floatIxFocused = signal<Record<FormInputBlockKind, boolean>>({
    'input-default': false,
    'input-float-over': false,
    'input-float-on': false,
    'input-float-in': false,
    'input-iftalabel': false,
  });

  private readonly choiceIxByKind = signal<Record<FormChoiceBlockKind, FormChoiceInteractionState>>({
    radio: defaultChoiceInteraction(),
    checkbox: defaultChoiceInteraction(),
  });

  isChoiceBlock(block: FormBlockConfig): boolean {
    return block.category === 'choice';
  }

  isInputBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: FormInputBlockKind } {
    return block.category === 'input';
  }

  floatVariant(block: FormBlockConfig): FormInputFloatVariant | null {
    return block.floatVariant ?? null;
  }

  hasFloatLabel(block: FormBlockConfig): boolean {
    return block.kind !== 'input-default';
  }

  isIftaLabelBlock(block: FormBlockConfig): boolean {
    return block.kind === 'input-iftalabel';
  }

  isPrimeFloatLabelBlock(block: FormBlockConfig): boolean {
    return block.floatVariant != null;
  }

  isFloatInputKind(kind: FormInputBlockKind): boolean {
    return (
      kind === 'input-float-over' || kind === 'input-float-on' || kind === 'input-float-in'
    );
  }

  setFloatIxFocused(kind: FormInputBlockKind, focused: boolean): void {
    if (kind === 'input-default' || kind === 'input-iftalabel') {
      return;
    }
    this.floatIxFocused.update((all) => ({ ...all, [kind]: focused }));
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

  /** Tipografía del label dentro del campo (misma cadena que placeholder / valor del input). */
  floatLabelInfieldFontSizeMdsToken(size: FormInteractionSize): string {
    if (size === 'small') {
      return '--inputtext-sm-font-size';
    }
    if (size === 'large') {
      return '--inputtext-lg-font-size';
    }
    return '--inputtext-font-size';
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

  private floatLabelFieldStyleVars(size: FormInteractionSize): Record<string, string> {
    const positionValue = `var(${this.floatLabelPositionMdsToken(size)})`;
    const fontValue = `var(${this.floatLabelInfieldFontSizeMdsToken(size)})`;
    return {
      '--p-floatlabel-position-x': positionValue,
      '--catalog-floatlabel-position-x': positionValue,
      '--p-floatlabel-infield-font-size': fontValue,
      '--catalog-floatlabel-infield-font-size': fontValue,
    };
  }

  /**
   * Float In: altura MDS (45 / 47 / 49 px) y bloque label+valor centrado verticalmente.
   * padding-top/bottom simétricos; gap 2px entre label xs y línea de valor.
   */
  private floatLabelInHostVars(size: FormInteractionSize): Record<string, string> {
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
    const valueLine = pick(
      'calc(var(--form-field-font-size) * var(--inputtext-line-height, 1.25))',
      'calc(var(--form-field-sm-font-size) * var(--inputtext-line-height, 1.25))',
      'calc(var(--form-field-lg-font-size) * var(--inputtext-line-height, 1.25))',
    );
    const contentBlock = `calc(var(--floatlabel-active-font-size) + 2px + ${valueLine})`;
    const activeTop = `calc((${cssVar(minHeight)} - ${contentBlock}) / 2)`;
    const paddingTop = `calc(${activeTop} + var(--floatlabel-active-font-size) + 2px)`;
    const paddingBottom = activeTop;
    const paddingX = pick(
      '--inputtext-padding-x',
      '--inputtext-sm-padding-x',
      '--inputtext-lg-padding-x',
    );
    const iconPaddingEnd = pick(
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

  /**
   * IftaLabel: misma geometría que Float IN (fill) — label fijo arriba, placeholder en la línea de valor.
   * Reutiliza --catalog-floatlabel-in-* y los expone también como --p-iftalabel-*.
   */
  private iftaLabelHostVars(size: FormInteractionSize): Record<string, string> {
    const field = this.floatLabelFieldStyleVars(size);
    const inVars = this.floatLabelInHostVars(size);
    const iconSize = `var(${this.floatIconSizeMdsToken(size)})`;
    return {
      ...field,
      ...inVars,
      '--p-iftalabel-top': inVars['--catalog-floatlabel-in-active-top'],
      '--catalog-iftalabel-top': inVars['--catalog-floatlabel-in-active-top'],
      '--p-iftalabel-font-size': 'var(--floatlabel-active-font-size)',
      '--p-iftalabel-font-weight': 'var(--floatlabel-active-font-weight)',
      '--p-iftalabel-input-padding-top': inVars['--p-floatlabel-in-input-padding-top'],
      '--p-iftalabel-input-padding-bottom': inVars['--p-floatlabel-in-input-padding-bottom'],
      '--p-iftalabel-input-min-height': inVars['--p-floatlabel-in-input-min-height'],
      '--p-iftalabel-position-x': field['--p-floatlabel-position-x'],
      '--p-iconfield-icon-size': iconSize,
      '--p-iconfield-sm-icon-size': 'var(--iconfield-figma-sm-icon-size)',
      '--p-iconfield-lg-icon-size': 'var(--iconfield-figma-lg-icon-size)',
    };
  }

  /** Variables en p-floatlabel / p-iftalabel (PrimeNG 20 + catálogo MDS). */
  floatLabelHostVars(kind: FormInputBlockKind): Record<string, string> {
    if (kind === 'input-iftalabel') {
      return this.iftaLabelHostVars(this.ix(kind).size);
    }
    const size = this.ix(kind).size;
    const vars = this.floatLabelFieldStyleVars(size);
    if (!this.isFloatInputKind(kind)) {
      return vars;
    }
    const iconSize = `var(${this.floatIconSizeMdsToken(size)})`;
    const shared = {
      ...vars,
      '--p-iconfield-icon-size': iconSize,
      '--p-iconfield-sm-icon-size': 'var(--iconfield-figma-sm-icon-size)',
      '--p-iconfield-lg-icon-size': 'var(--iconfield-figma-lg-icon-size)',
    };
    if (kind === 'input-float-in') {
      return { ...shared, ...this.floatLabelInHostVars(size) };
    }
    return shared;
  }

  iftaLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return this.iftaLabelHostVars(size);
  }

  floatLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return {
      ...this.floatLabelFieldStyleVars(size),
      ...this.floatLabelInHostVars(size),
    };
  }

  /** Fila States: siempre tamaño Normal (no sigue el selector Size de Interacción). */
  floatLabelStatesHostVars(kind: FormInputBlockKind): Record<string, string> {
    const size: FormInteractionSize = 'normal';
    if (kind === 'input-iftalabel') {
      return this.iftaLabelHostVars(size);
    }
    const vars = this.floatLabelFieldStyleVars(size);
    if (kind === 'input-float-in') {
      return { ...vars, ...this.floatLabelInHostVars(size) };
    }
    return vars;
  }

  /** Placeholder en foco (token --p-inputtext-placeholder-color); sin foco y vacío, sin atributo. */
  floatInteractionPlaceholder(kind: FormInputBlockKind): string | null {
    if (kind === 'input-iftalabel') {
      return this.inputStatePlaceholder;
    }
    if (kind === 'input-default' || !this.floatIxFocused()[kind]) {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  ix(kind: FormInputBlockKind): FormInputInteractionState {
    return this.inputIxByKind()[kind];
  }

  patchIx(kind: FormInputBlockKind, patch: Partial<FormInputInteractionState>): void {
    this.inputIxByKind.update((all) => ({
      ...all,
      [kind]: { ...all[kind], ...patch },
    }));
  }

  inputPrimeSize(kind: FormInputBlockKind): 'small' | 'large' | undefined {
    const size = this.ix(kind).size;
    return size === 'normal' ? undefined : size;
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

  inputRounded(kind: FormInputBlockKind): boolean {
    return this.ix(kind).rounded;
  }

  inputShowIcon(kind: FormInputBlockKind): boolean {
    return this.ix(kind).iconRight;
  }

  inputIconPosition(_kind: FormInputBlockKind): 'left' | 'right' {
    return 'right';
  }

  inputDualIcons(_kind: FormInputBlockKind): boolean {
    return false;
  }

  inputStates(block: FormBlockConfig): { key: FormInputDemoState; caption: string }[] {
    return this.hasFloatLabel(block) ? this.inputFloatStates : this.inputDefaultStates;
  }

  inputDemoWrap(state: FormInputDemoState): string {
    return inputDemoWrapClass(state);
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

  /** Preview estático: el input no lleva valor, solo placeholder (tokens). */
  inputStateShowsPlaceholderOnly(block: FormBlockConfig, state: FormInputDemoState): boolean {
    if (block.kind === 'input-default') {
      return (
        state === 'normal' ||
        state === 'hover' ||
        state === 'focus' ||
        state === 'invalid' ||
        state === 'disabled'
      );
    }
    if (this.hasFloatLabel(block)) {
      return state === 'hover' || state === 'focus' || state === 'invalid' || state === 'disabled';
    }
    return false;
  }

  /**
   * FloatLabel interactivo: sin atributo placeholder (PrimeNG 20 flota el label si existe
   * `placeholder`, aunque sea un espacio). Estados estáticos vacíos tampoco llevan placeholder.
   */
  inputFloatPlaceholderAttr(state: FormInputDemoState, block: FormBlockConfig): string | null {
    if (this.isIftaLabelBlock(block)) {
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
    return state === 'invalid' && (block.kind === 'input-default' || this.hasFloatLabel(block));
  }

  inputStateShowHint(block: FormBlockConfig, state: FormInputDemoState): boolean {
    return !this.inputStateShowErrorMessage(block, state);
  }

  inputStateValue(state: FormInputDemoState, block: FormBlockConfig): string {
    if (this.inputStateShowsPlaceholderOnly(block, state)) {
      return '';
    }
    if (this.hasFloatLabel(block) && state === 'filled') {
      return FORM_INPUT_STATE_FILLED_VALUE;
    }
    if (this.hasFloatLabel(block)) {
      return '';
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

  interactionScopeClass(kind: FormInputBlockKind): Record<string, boolean> {
    const ix = this.ix(kind);
    return {
      'input-variant-block': true,
      'floatlabel-variant-over': kind === 'input-float-over',
      'floatlabel-variant-on': kind === 'input-float-on',
      'floatlabel-variant-in': kind === 'input-float-in',
      'iftalabel-variant': kind === 'input-iftalabel',
      'show-right-icon': ix.iconRight,
    };
  }

  inputSizeClass(size: FormInteractionSize): Record<string, boolean> {
    return {
      'p-inputtext-sm': size === 'small',
      'p-inputtext-lg': size === 'large',
    };
  }

  asInputKind(kind: FormBlockKind): FormInputBlockKind {
    return kind as FormInputBlockKind;
  }
}
