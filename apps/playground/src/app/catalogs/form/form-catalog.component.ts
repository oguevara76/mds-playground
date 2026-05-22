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
  iconLeft: boolean;
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
    iconLeft: false,
    iconRight: false,
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
    'input-float-over': defaultInputInteraction(),
    'input-float-on': defaultInputInteraction(),
    'input-float-in': defaultInputInteraction(),
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

  private floatLabelPositionStyleVars(size: FormInteractionSize): Record<string, string> {
    const mdsToken = this.floatLabelPositionMdsToken(size);
    const value = `var(${mdsToken})`;
    return {
      '--p-floatlabel-position-x': value,
      '--catalog-floatlabel-position-x': value,
    };
  }

  /** Variables en p-floatlabel para dt('floatlabel.position.x') de PrimeNG 20. */
  floatLabelHostVars(kind: FormInputBlockKind): Record<string, string> {
    return this.floatLabelPositionStyleVars(this.ix(kind).size);
  }

  floatLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return this.floatLabelPositionStyleVars(size);
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
    const { iconLeft, iconRight } = this.ix(kind);
    return iconLeft || iconRight;
  }

  inputIconPosition(kind: FormInputBlockKind): 'left' | 'right' {
    const { iconLeft, iconRight } = this.ix(kind);
    return iconRight && !iconLeft ? 'right' : 'left';
  }

  inputDualIcons(kind: FormInputBlockKind): boolean {
    const { iconLeft, iconRight } = this.ix(kind);
    return iconLeft && iconRight;
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
  inputFloatPlaceholderAttr(state: FormInputDemoState): string | null {
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
      'show-left-icon': ix.iconLeft,
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
