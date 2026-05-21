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

type FormInputBlockKind = 'input-default' | 'input-float-over' | 'input-float-on' | 'input-float-in';

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

  patchInputIconLeft(kind: FormInputBlockKind, on: boolean): void {
    this.patchIx(kind, { iconLeft: on, ...(on ? { iconRight: false } : {}) });
  }

  patchInputIconRight(kind: FormInputBlockKind, on: boolean): void {
    this.patchIx(kind, { iconRight: on, ...(on ? { iconLeft: false } : {}) });
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

  inputStateValue(state: FormInputDemoState): string {
    switch (state) {
      case 'empty':
        return '';
      case 'invalid':
        return 'Error de validación';
      case 'readonly':
        return 'Solo lectura';
      case 'disabled':
        return 'No editable';
      case 'filled':
      case 'hover':
      case 'focus':
      case 'normal':
      default:
        return 'Placeholder';
    }
  }

  inputStateInvalid(state: FormInputDemoState): boolean {
    return state === 'invalid';
  }

  inputStateDisabled(state: FormInputDemoState): boolean {
    return state === 'disabled';
  }

  inputStateReadonly(state: FormInputDemoState): boolean {
    return state === 'readonly' || state === 'hover' || state === 'focus' || state === 'filled' || state === 'normal' || state === 'empty';
  }

  inputFloatFilled(state: FormInputDemoState): boolean {
    return state !== 'empty';
  }

  interactionScopeClass(kind: FormInputBlockKind): Record<string, boolean> {
    return {
      'input-variant-block': true,
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
