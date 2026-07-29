import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, inject, Injector, signal } from '@angular/core';
import { formPlaygroundAnchorId } from '../../layout/playground-component-index';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { CatalogStateTagComponent } from '../../components/catalog/catalog-state-tag/catalog-state-tag.component';
import { createCatalogSectionBoot } from '../../components/ui/catalog-section-loader/catalog-section-boot';
import { CatalogSectionLoaderComponent } from '../../components/ui/catalog-section-loader/catalog-section-loader.component';
import { FormsModule } from '@angular/forms';
import { CascadeSelect } from 'primeng/cascadeselect';
import { TreeNode } from 'primeng/api';
import { TreeSelect } from 'primeng/treeselect';
import { DatePicker } from 'primeng/datepicker';
import { Checkbox } from 'primeng/checkbox';
import { Divider } from 'primeng/divider';
import { FloatLabel } from 'primeng/floatlabel';
import { Button } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputNumber } from 'primeng/inputnumber';
import { InputOtp } from 'primeng/inputotp';
import { InputText } from 'primeng/inputtext';
import { Listbox } from 'primeng/listbox';
import { Password } from 'primeng/password';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { Slider } from 'primeng/slider';
import { StarFillIcon } from 'primeng/icons/starfill';
import { StarIcon } from 'primeng/icons/star';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
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
  type FormListboxTemplateCountry,
  type FormListboxVariant,
  FORM_INPUT_OTP_DEFAULT_LENGTH,
  FORM_INPUT_OTP_LENGTH_SELECT_OPTIONS,
  FORM_INPUT_OTP_STATE_READONLY_VALUE,
  FORM_INPUTTEXT_FLOAT_POSITION_SELECT_OPTIONS,
  FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS,
  FORM_INPUTGROUP_CITY_OPTIONS,
  FORM_INPUTGROUP_EXAMPLE_OPTIONS,
  FORM_LISTBOX_FLAG_PLACEHOLDER_URL,
  FORM_LISTBOX_SCROLL_HEIGHT,
  FORM_LISTBOX_TEMPLATE_COUNTRIES,
  FORM_LISTBOX_VARIANT_SELECT_OPTIONS,
  type FormInputGroupCityOption,
  type FormInputGroupExample,
  FORM_RATING_DEMO_STATES,
  FORM_RATING_VALUE_SELECT_OPTIONS,
  FORM_SLIDER_DEFAULT_RANGE_VALUE,
  FORM_SLIDER_DEFAULT_VALUE,
  FORM_SLIDER_CATALOG_DEMO_HEIGHT,
  FORM_SLIDER_DIRECTION_SELECT_OPTIONS,
  FORM_SLIDER_VARIANT_SELECT_OPTIONS,
  FORM_TEXTAREA_FLOAT_POSITION_SELECT_OPTIONS,
  FORM_TEXTAREA_VARIANT_SELECT_OPTIONS,
  FORM_CASCADESELECT_DEMO_OPTIONS,
  FORM_CASCADESELECT_OPTION_GROUP_CHILDREN,
  FORM_CASCADESELECT_STATE_FILLED_VALUE,
  FORM_TREESELECT_DEMO_NODES,
  FORM_TREESELECT_STATE_FILLED_VALUE,
  FORM_TREESELECT_CHECKBOX_STATE_FILLED_VALUE,
  FORM_TREESELECT_TREE_OPTION_OPTIONS,
  type FormTreeSelectTreeOption,
  FORM_DATEPICKER_STATE_FILLED_VALUE,
  FORM_DATEPICKER_RANGE_DEMO_VALUE,
  FORM_DATEPICKER_OVERLAY_INFO_OPTIONS,
  FORM_DATEPICKER_VARIANT_SELECT_OPTIONS,
  type FormDatepickerOverlayInfo,
  FORM_MULTISELECT_DISPLAY_OPTIONS,
  FORM_MULTISELECT_OVERLAY_OPTION_VARIANT_OPTIONS,
  FORM_MULTISELECT_STATE_FILLED_VALUE,
  FORM_MULTISELECT_VARIANT_SELECT_OPTIONS,
  FORM_SELECT_DEMO_GROUPED_OPTIONS,
  FORM_SELECT_DEMO_OPTIONS,
  FORM_SELECT_OVERLAY_FILTER_PLACEHOLDER,
  FORM_SELECT_OVERLAY_OPTION_VARIANT_OPTIONS,
  FORM_SELECT_STATE_FILLED_VALUE,
  FORM_SELECT_VARIANT_SELECT_OPTIONS,
  type FormCascadeSelectDemoValue,
  type FormCascadeSelectCountry,
  type FormTreeSelectCheckboxValue,
  type FormMultiselectDisplay,
  type FormMultiselectOverlayOptionVariant,
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
  type FormSliderDirection,
  type FormSliderVariant,
} from './form-catalog.config';
import { inputDemoWrapClass } from './form-catalog.demo-styles';

export interface FormListboxInteractionState {
  size: FormInteractionSize;
  value: FormSelectDemoValue | FormSelectDemoValue[] | FormListboxTemplateCountry | null;
  variant: FormListboxVariant;
  filter: boolean;
}

export interface FormSelectInteractionState {
  variant: FormInputTextVariant;
  floatPosition: FormInputFloatVariant;
  size: FormInteractionSize;
  value: FormSelectDemoValue | null;
  /** Buscador en header del overlay (PrimeNG filter). */
  showOverlayFilter: boolean;
  overlayOptionVariant: FormSelectOverlayOptionVariant;
}

export interface FormMultiselectInteractionState {
  variant: FormInputTextVariant;
  floatPosition: FormInputFloatVariant;
  size: FormInteractionSize;
  value: FormSelectDemoValue[];
  display: FormMultiselectDisplay;
  /** Buscador en header del overlay (PrimeNG filter). */
  showOverlayFilter: boolean;
  overlayOptionVariant: FormMultiselectOverlayOptionVariant;
}

export interface FormCascadeSelectInteractionState {
  variant: FormInputTextVariant;
  floatPosition: FormInputFloatVariant;
  size: FormInteractionSize;
  value: FormCascadeSelectDemoValue | null;
}

export type FormTreeSelectInteractionValue = TreeNode | FormTreeSelectCheckboxValue | null;

export interface FormTreeSelectInteractionState {
  variant: FormInputTextVariant;
  floatPosition: FormInputFloatVariant;
  size: FormInteractionSize;
  treeOption: FormTreeSelectTreeOption;
  value: FormTreeSelectInteractionValue;
}

export interface FormDatepickerInteractionState {
  variant: FormInputTextVariant;
  floatPosition: FormInputFloatVariant;
  size: FormInteractionSize;
  overlayInfo: FormDatepickerOverlayInfo;
  /** Icono de calendario dentro del input (PrimeNG showIcon). */
  showIcon: boolean;
  value: Date | Date[] | null;
}

export interface FormInputNumberInteractionState {
  buttonLayout: FormInputNumberButtonLayout;
  formatVariant: FormInputNumberFormatVariant;
  showHelperText: boolean;
  size: FormInteractionSize;
  value: number | null;
}

export interface FormInputGroupInteractionState {
  variant: FormInputTextVariant;
  floatPosition: FormInputFloatVariant;
  example: FormInputGroupExample;
  value: string;
}

export interface FormInputTextInteractionState {
  variant: FormInputTextVariant;
  floatPosition: FormInputFloatVariant;
  size: FormInteractionSize;
  /** Solo variante Default: icono de búsqueda a la izquierda. */
  iconLeft: boolean;
  iconRight: boolean;
  rounded: boolean;
  /** Muestra el helper text bajo el campo en Interaction. */
  showHelperText: boolean;
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

export interface FormSliderInteractionState {
  variant: FormSliderVariant;
  direction: FormSliderDirection;
  range: boolean;
  value: number;
  rangeValue: number[];
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
type FormFieldKind = 'inputtext' | 'textarea' | 'password' | 'select' | 'multiselect' | 'cascadeselect' | 'treeselect' | 'listbox';

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

function defaultSliderInteraction(): FormSliderInteractionState {
  return {
    variant: 'basic',
    direction: 'horizontal',
    range: false,
    value: FORM_SLIDER_DEFAULT_VALUE,
    rangeValue: [...FORM_SLIDER_DEFAULT_RANGE_VALUE],
  };
}

function defaultListboxInteraction(): FormListboxInteractionState {
  return {
    size: 'normal',
    value: null,
    variant: 'basic',
    filter: true,
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

function defaultMultiselectInteraction(): FormMultiselectInteractionState {
  return {
    variant: 'default',
    floatPosition: 'over',
    size: 'normal',
    value: [],
    display: 'chip',
    showOverlayFilter: true,
    overlayOptionVariant: 'default',
  };
}

function defaultCascadeSelectInteraction(): FormCascadeSelectInteractionState {
  return {
    variant: 'default',
    floatPosition: 'over',
    size: 'normal',
    value: null,
  };
}

function defaultTreeSelectInteraction(): FormTreeSelectInteractionState {
  return {
    variant: 'default',
    floatPosition: 'over',
    size: 'normal',
    treeOption: 'default',
    value: null,
  };
}

function defaultDatepickerInteraction(): FormDatepickerInteractionState {
  return {
    variant: 'default',
    floatPosition: 'over',
    size: 'normal',
    overlayInfo: 'default',
    showIcon: true,
    value: null,
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

function defaultInputGroupInteraction(): FormInputGroupInteractionState {
  return {
    variant: 'default',
    floatPosition: 'over',
    example: 'basic',
    value: '',
  };
}

function defaultInputTextInteraction(): FormInputTextInteractionState {
  return {
    variant: 'default',
    floatPosition: 'over',
    size: 'normal',
    iconLeft: false,
    iconRight: false,
    rounded: false,
    showHelperText: false,
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
    CatalogSectionLoaderComponent,
    CatalogStateTagComponent,
    CascadeSelect,
    TreeSelect,
    DatePicker,
    Button,
    Checkbox,
    Divider,
    FloatLabel,
    FormsModule,
    IconField,
    InputGroup,
    InputGroupAddon,
    InputIcon,
    InputNumber,
    InputOtp,
    Listbox,
    InputText,
    NgClass,
    NgTemplateOutlet,
    Password,
    RadioButton,
    Rating,
    StarFillIcon,
    StarIcon,
    Select,
    MultiSelect,
    SelectButton,
    Slider,
    Textarea,
    ToggleButton,
    ToggleSwitch,
  ],
  templateUrl: './form-catalog.component.html',
  styleUrl: './form-catalog.component.css',
})
export class FormCatalogComponent {
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sectionBoot = createCatalogSectionBoot(this.injector, this.destroyRef);

  /** Loader de pantalla hasta que el catálogo Form (muy pesado) pinta por completo. */
  readonly sectionContentMounted = this.sectionBoot.contentMounted;
  readonly sectionReady = this.sectionBoot.ready;

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
  readonly sliderVariantSelectOptions = FORM_SLIDER_VARIANT_SELECT_OPTIONS;
  readonly sliderDirectionSelectOptions = FORM_SLIDER_DIRECTION_SELECT_OPTIONS;
  readonly sliderDemoHeight = FORM_SLIDER_CATALOG_DEMO_HEIGHT;
  readonly selectVariantSelectOptions = FORM_SELECT_VARIANT_SELECT_OPTIONS;
  readonly multiselectVariantSelectOptions = FORM_MULTISELECT_VARIANT_SELECT_OPTIONS;
  readonly multiselectDisplayOptions = FORM_MULTISELECT_DISPLAY_OPTIONS;
  readonly multiselectOverlayOptionVariantOptions = FORM_MULTISELECT_OVERLAY_OPTION_VARIANT_OPTIONS;
  readonly listboxVariantSelectOptions = FORM_LISTBOX_VARIANT_SELECT_OPTIONS;
  readonly listboxScrollHeight = FORM_LISTBOX_SCROLL_HEIGHT;
  readonly listboxTemplateCountries = FORM_LISTBOX_TEMPLATE_COUNTRIES;
  readonly listboxFlagPlaceholderUrl = FORM_LISTBOX_FLAG_PLACEHOLDER_URL;
  readonly selectDemoOptions = [...FORM_SELECT_DEMO_OPTIONS];
  /** Referencia estable para previews estáticos MultiSelect (evita bucle ngModel). */
  readonly multiselectDemoEmptyValue: FormSelectDemoValue[] = [];
  readonly multiselectDemoFilledValue = FORM_MULTISELECT_STATE_FILLED_VALUE;
  readonly cascadeSelectDemoOptions: FormCascadeSelectCountry[] = FORM_CASCADESELECT_DEMO_OPTIONS;
  /** Opciones anidadas expuestas a PrimeNG (tipado del componente limitado a string). */
  readonly cascadeSelectPrimeOptions = FORM_CASCADESELECT_DEMO_OPTIONS as any;
  readonly cascadeSelectOptionGroupChildren = [...FORM_CASCADESELECT_OPTION_GROUP_CHILDREN];
  readonly treeSelectDemoNodes: TreeNode[] = structuredClone(
    FORM_TREESELECT_DEMO_NODES,
  ) as unknown as TreeNode[];
  readonly treeSelectTreeOptionOptions = FORM_TREESELECT_TREE_OPTION_OPTIONS;
  readonly selectDemoGroupedOptions = FORM_SELECT_DEMO_GROUPED_OPTIONS;
  readonly selectOverlayOptionVariantOptions = FORM_SELECT_OVERLAY_OPTION_VARIANT_OPTIONS;
  readonly selectOverlayFilterPlaceholder = FORM_SELECT_OVERLAY_FILTER_PLACEHOLDER;
  readonly inputgroupCityOptions: FormInputGroupCityOption[] = FORM_INPUTGROUP_CITY_OPTIONS;
  readonly inputgroupExampleSelectOptions = FORM_INPUTGROUP_EXAMPLE_OPTIONS;
  readonly inputtextVariantSelectOptions = FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS;
  readonly datepickerVariantSelectOptions = FORM_DATEPICKER_VARIANT_SELECT_OPTIONS;
  readonly datepickerOverlayInfoOptions = FORM_DATEPICKER_OVERLAY_INFO_OPTIONS;
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
    inputgroup: 'outlined',
    inputnumber: 'outlined',
    select: 'outlined',
    multiselect: 'outlined',
    listbox: 'outlined',
    cascadeselect: 'outlined',
    treeselect: 'outlined',
    datepicker: 'outlined',
    password: 'outlined',
    inputotp: 'outlined',
    rating: 'outlined',
    slider: 'outlined',
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
  readonly inputgroupIx = signal<FormInputGroupInteractionState>(defaultInputGroupInteraction());
  readonly inputnumberIx = signal<FormInputNumberInteractionState>(defaultInputNumberInteraction());
  readonly selectIx = signal<FormSelectInteractionState>(defaultSelectInteraction());
  readonly multiselectIx = signal<FormMultiselectInteractionState>(defaultMultiselectInteraction());
  readonly listboxIx = signal<FormListboxInteractionState>(defaultListboxInteraction());
  readonly cascadeSelectIx = signal<FormCascadeSelectInteractionState>(defaultCascadeSelectInteraction());
  readonly treeSelectIx = signal<FormTreeSelectInteractionState>(defaultTreeSelectInteraction());
  readonly datepickerIx = signal<FormDatepickerInteractionState>(defaultDatepickerInteraction());
  readonly passwordIx = signal<FormPasswordInteractionState>(defaultPasswordInteraction());
  readonly inputotpIx = signal<FormInputOtpInteractionState>(defaultInputOtpInteraction());
  readonly ratingIx = signal<FormRatingInteractionState>(defaultRatingInteraction());
  readonly sliderIx = signal<FormSliderInteractionState>(defaultSliderInteraction());

  /** Float Label interactivo (Select): placeholder solo con foco. */
  private readonly selectFloatIxFocused = signal(false);

  /** Select Float Label: overlay abierto mantiene label/placeholder activos (onBlur al abrir lista). */
  private readonly selectFloatOverlayOpen = signal(false);

  /** Float Label interactivo (MultiSelect). */
  private readonly multiselectFloatIxFocused = signal(false);

  /** MultiSelect Float Label: overlay abierto mantiene label/placeholder activos. */
  private readonly multiselectFloatOverlayOpen = signal(false);

  /** Float Label interactivo (CascadeSelect). */
  private readonly cascadeSelectFloatIxFocused = signal(false);

  /** CascadeSelect Float Label: overlay abierto mantiene label/placeholder activos. */
  private readonly cascadeSelectFloatOverlayOpen = signal(false);

  /** Float Label interactivo (TreeSelect). */
  private readonly treeSelectFloatIxFocused = signal(false);

  /** TreeSelect Float Label: overlay abierto mantiene label/placeholder activos. */
  private readonly treeSelectFloatOverlayOpen = signal(false);

  /** Float Label interactivo (DatePicker). */
  private readonly datepickerFloatIxFocused = signal(false);

  /** DatePicker Float Label: overlay abierto mantiene label/placeholder activos. */
  private readonly datepickerFloatOverlayOpen = signal(false);

  /** Fuerza remount del p-datepicker al cambiar overlay (view, range, time…). */
  readonly datepickerOverlayMountKey = signal(0);

  /** Float Label interactivo: placeholder solo mientras el campo tiene foco. */
  private readonly floatIxFocused = signal(false);
  private readonly inputgroupFloatBasicUsernameFocused = signal(false);
  private readonly inputgroupFloatBasicPriceFocused = signal(false);

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

  /** Valores demo estáticos (Examples → PrimeNG InputGroup docs). */
  inputgroupExBasicUsername = '';
  inputgroupExBasicPrice: number | null = null;
  inputgroupExBasicWebsite = '';
  inputgroupExBasicCity: FormInputGroupCityOption | null = null;
  inputgroupExMultiplePrice = '';
  inputgroupExMultipleTags = '';
  inputgroupExButtonKeyword = '';
  inputgroupExButtonVote = '';
  inputgroupExCheckboxRadioPrice = '';
  inputgroupExCheckboxRadioValue = '';
  inputgroupExCheckboxUsername = '';
  inputgroupExCheckboxChecked1 = false;
  inputgroupExCheckboxWebsite = '';
  inputgroupExCheckboxChecked2 = false;
  inputgroupExCheckboxCategory = 'rb2';
  inputgroupExSelectCity: FormInputGroupCityOption | null = null;
  inputgroupExSelectWwwCity: FormInputGroupCityOption | null = null;
  inputgroupExFileUploadName1 = '';
  inputgroupExFileUploadName2 = '';

  isInputTextBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'inputtext' } {
    return block.kind === 'inputtext';
  }

  isInputGroupBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'inputgroup' } {
    return block.kind === 'inputgroup';
  }

  isInputNumberBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'inputnumber' } {
    return block.kind === 'inputnumber';
  }

  isSelectBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'select' } {
    return block.kind === 'select';
  }

  isMultiselectBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'multiselect' } {
    return block.kind === 'multiselect';
  }

  isListboxBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'listbox' } {
    return block.kind === 'listbox';
  }

  isCascadeSelectBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'cascadeselect' } {
    return block.kind === 'cascadeselect';
  }

  isTreeSelectBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'treeselect' } {
    return block.kind === 'treeselect';
  }

  isDatepickerBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'datepicker' } {
    return block.kind === 'datepicker';
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

  isSliderBlock(block: FormBlockConfig): block is FormBlockConfig & { kind: 'slider' } {
    return block.kind === 'slider';
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
    return kind !== 'toggleswitch' && kind !== 'rating' && kind !== 'inputgroup' && kind !== 'slider';
  }

  patchInputgroup(patch: Partial<FormInputGroupInteractionState>): void {
    this.inputgroupIx.update((prev) => ({ ...prev, ...patch }));
  }

  inputgroupIsDefault(): boolean {
    return this.inputgroupIx().variant === 'default';
  }

  inputgroupIsFloatLabel(): boolean {
    return this.inputgroupIx().variant === 'floatlabel';
  }

  inputgroupIsIftaLabel(): boolean {
    return this.inputgroupIx().variant === 'iftalabel';
  }

  inputgroupFloatPosition(): FormInputFloatVariant {
    return this.inputgroupIx().floatPosition;
  }

  inputgroupIsFloatIn(): boolean {
    return this.inputgroupIsFloatLabel() && this.inputgroupFloatPosition() === 'in';
  }

  inputgroupIsFloatOver(): boolean {
    return this.inputgroupIsFloatLabel() && this.inputgroupFloatPosition() === 'over';
  }

  inputgroupIsFloatOn(): boolean {
    return this.inputgroupIsFloatLabel() && this.inputgroupFloatPosition() === 'on';
  }

  inputgroupIsFloatOverOrOn(): boolean {
    return this.inputgroupIsFloatOver() || this.inputgroupIsFloatOn();
  }

  inputgroupHostVars(): Record<string, string> {
    return {
      '--p-inputgroup-addon-background': 'var(--inputgroup-addon-background)',
      '--p-inputgroup-addon-border-color': 'var(--inputgroup-addon-border-color)',
      '--p-inputgroup-addon-border-radius': 'var(--inputgroup-addon-border-radius)',
      '--p-inputgroup-addon-color': 'var(--inputgroup-addon-color)',
      '--p-inputgroup-addon-min-width': 'var(--inputgroup-addon-min-width)',
      '--p-inputgroup-addon-padding': 'var(--inputgroup-addon-padding)',
      '--p-inputgroup-gap': 'var(--inputgroup-gap)',
      '--p-inputtext-disabled-background': 'var(--inputtext-disabled-background)',
      '--p-inputtext-disabled-color': 'var(--inputtext-disabled-color)',
    };
  }

  inputgroupFloatLabelHostVars(): Record<string, string> {
    const ix = this.inputgroupIx();
    return this.floatLabelHostVarsForVariant(ix.variant, ix.floatPosition, 'normal', 'inputtext');
  }

  inputgroupFloatLabelStatesHostVars(): Record<string, string> {
    const ix = this.inputgroupIx();
    return this.floatLabelHostVarsForVariant(ix.variant, ix.floatPosition, 'normal', 'inputtext');
  }

  inputgroupFloatStateLabelFloated(state: FormInputDemoState): boolean {
    if (this.inputgroupFloatPosition() === 'in') {
      return state === 'filled' || state === 'focus' || state === 'disabled';
    }
    if (this.inputgroupIsFloatOverOrOn() && state === 'disabled') {
      return true;
    }
    return state === 'focus' || state === 'filled';
  }

  inputgroupFloatPlaceholderAttr(state: FormInputDemoState): string | null {
    if (this.inputgroupIsIftaLabel()) {
      if (state === 'filled') {
        return null;
      }
      return this.inputStatePlaceholder;
    }
    if (this.inputgroupIsFloatOverOrOn() || this.inputgroupIsFloatIn()) {
      return null;
    }
    if (state === 'empty' || state === 'filled') {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  inputgroupExampleInputVariant(): 'filled' | undefined {
    return this.formThemePrimeVariant('inputgroup');
  }

  inputgroupExampleSelectVariant(): 'filled' | undefined {
    return this.formThemePrimeVariant('inputgroup');
  }

  inputgroupOnFileInputChange(event: Event, slot: 1 | 2): void {
    const input = event.target as HTMLInputElement;
    const name = input.files?.[0]?.name ?? '';
    if (slot === 1) {
      this.inputgroupExFileUploadName1 = name;
      return;
    }
    this.inputgroupExFileUploadName2 = name;
  }

  setInputgroupFloatBasicUsernameFocused(focused: boolean): void {
    if (!this.inputgroupIsFloatLabel()) {
      return;
    }
    this.inputgroupFloatBasicUsernameFocused.set(focused);
  }

  setInputgroupFloatBasicPriceFocused(focused: boolean): void {
    if (!this.inputgroupIsFloatLabel()) {
      return;
    }
    this.inputgroupFloatBasicPriceFocused.set(focused);
  }

  inputgroupBasicUsernameLabelFloated(): boolean {
    if (this.inputgroupIsFloatIn()) {
      return true;
    }
    return !!this.inputgroupExBasicUsername || this.inputgroupFloatBasicUsernameFocused();
  }

  inputgroupBasicPriceLabelFloated(): boolean {
    if (this.inputgroupIsFloatIn()) {
      return true;
    }
    return this.inputgroupExBasicPrice != null || this.inputgroupFloatBasicPriceFocused();
  }

  inputgroupBasicUsernamePlaceholder(): string | null {
    if (this.inputgroupIsIftaLabel()) {
      return this.inputgroupExBasicUsername ? null : 'Username';
    }
    if (!this.inputgroupFloatBasicUsernameFocused()) {
      return null;
    }
    return 'Username';
  }

  inputgroupBasicPricePlaceholder(): string | null {
    if (this.inputgroupIsIftaLabel()) {
      return this.inputgroupExBasicPrice != null ? null : 'Price';
    }
    if (!this.inputgroupFloatBasicPriceFocused()) {
      return null;
    }
    return 'Price';
  }

  inputgroupPreviewDemoClass(): Record<string, boolean> {
    const ix = this.inputgroupIx();
    return {
      ...this.formThemeContainerClass('inputgroup'),
      'form-input-interaction--stacked': ix.variant === 'floatlabel' || ix.variant === 'iftalabel',
      'floatlabel-variant-over': ix.variant === 'floatlabel' && ix.floatPosition === 'over',
      'floatlabel-variant-on': ix.variant === 'floatlabel' && ix.floatPosition === 'on',
      'floatlabel-variant-in': ix.variant === 'floatlabel' && ix.floatPosition === 'in',
      'iftalabel-variant': ix.variant === 'iftalabel',
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

  multiselectIsDefault(): boolean {
    return this.multiselectIx().variant === 'default';
  }

  multiselectIsFloatLabel(): boolean {
    return this.multiselectIx().variant === 'floatlabel';
  }

  multiselectIsIftaLabel(): boolean {
    return this.multiselectIx().variant === 'iftalabel';
  }

  multiselectFloatPosition(): FormInputFloatVariant {
    return this.multiselectIx().floatPosition;
  }

  multiselectIsFloatIn(): boolean {
    return this.multiselectIsFloatLabel() && this.multiselectFloatPosition() === 'in';
  }

  multiselectIsFloatOverOrOn(): boolean {
    return (
      this.multiselectIsFloatLabel() &&
      (this.multiselectFloatPosition() === 'over' || this.multiselectFloatPosition() === 'on')
    );
  }

  multiselectInteractionLabelFloated(): boolean {
    if (!this.multiselectIsFloatLabel()) {
      return false;
    }
    return (
      this.multiselectIx().value.length > 0 ||
      this.multiselectFloatIxFocused() ||
      this.multiselectFloatOverlayOpen()
    );
  }

  multiselectFloatStateLabelFloated(state: FormInputDemoState): boolean {
    if (this.multiselectFloatPosition() === 'in') {
      return state === 'filled' || state === 'focus' || state === 'disabled';
    }
    if (this.multiselectIsFloatOverOrOn() && state === 'disabled') {
      return true;
    }
    return state === 'focus' || state === 'filled';
  }

  multiselectFloatSizeLabelFloated(): boolean {
    return this.multiselectIsFloatLabel();
  }

  patchMultiselect(patch: Partial<FormMultiselectInteractionState>): void {
    this.multiselectIx.update((prev) => {
      const next = { ...prev, ...patch };
      if (
        patch.overlayOptionVariant !== undefined &&
        patch.overlayOptionVariant !== prev.overlayOptionVariant
      ) {
        next.value = [];
      }
      return next;
    });
    if (patch.variant !== undefined || patch.floatPosition !== undefined) {
      this.multiselectFloatIxFocused.set(false);
      this.multiselectFloatOverlayOpen.set(false);
    }
  }

  setMultiselectFloatIxFocused(focused: boolean): void {
    if (!this.multiselectIsFloatLabel()) {
      return;
    }
    if (!focused && this.multiselectFloatOverlayOpen()) {
      return;
    }
    this.multiselectFloatIxFocused.set(focused);
  }

  setMultiselectFloatOverlayOpen(open: boolean): void {
    if (!this.multiselectIsFloatLabel()) {
      return;
    }
    this.multiselectFloatOverlayOpen.set(open);
    if (open) {
      this.multiselectFloatIxFocused.set(true);
    } else if (this.multiselectIx().value.length === 0) {
      this.multiselectFloatIxFocused.set(false);
    }
  }

  multiselectFloatInteractionPlaceholder(): string | null {
    if (this.multiselectIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    if (!this.multiselectFloatIxFocused() && !this.multiselectFloatOverlayOpen()) {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  multiselectInteractionPlaceholder(): string {
    if (this.multiselectIsDefault() || this.multiselectIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    return this.multiselectFloatInteractionPlaceholder() ?? '';
  }

  multiselectInteractionScopeClass(): Record<string, boolean> {
    const sx = this.multiselectIx();
    return {
      'input-variant-block': true,
      'form-input-interaction--stacked': sx.variant === 'floatlabel' || sx.variant === 'iftalabel',
      'floatlabel-variant-over': sx.variant === 'floatlabel' && sx.floatPosition === 'over',
      'floatlabel-variant-on': sx.variant === 'floatlabel' && sx.floatPosition === 'on',
      'floatlabel-variant-in': sx.variant === 'floatlabel' && sx.floatPosition === 'in',
      'iftalabel-variant': sx.variant === 'iftalabel',
    };
  }

  multiselectPrimeSize(size: FormInteractionSize): 'small' | 'large' | undefined {
    return this.inputotpPrimeSize(size);
  }

  multiselectInteractionOptions(): typeof this.selectDemoOptions | FormSelectDemoGroup[] {
    if (this.multiselectIx().overlayOptionVariant === 'group') {
      return this.selectDemoGroupedOptions;
    }
    return this.selectDemoOptions;
  }

  multiselectInteractionOverlayPanelClass(): string | undefined {
    return undefined;
  }

  multiselectInteractionGroup(): boolean {
    return this.multiselectIx().overlayOptionVariant === 'group';
  }

  private multiselectOverlayHostVars(): Record<string, string> {
    return {
      '--p-multiselect-overlay-background': 'var(--multiselect-overlay-background)',
      '--p-multiselect-overlay-border-color': 'var(--multiselect-overlay-border-color)',
      '--p-multiselect-overlay-border-radius': 'var(--multiselect-overlay-border-radius)',
      '--p-multiselect-overlay-color': 'var(--multiselect-overlay-color)',
      '--p-multiselect-overlay-shadow': 'var(--multiselect-overlay-shadow)',
      '--p-multiselect-list-padding': 'var(--multiselect-list-padding-y) var(--multiselect-list-padding-x)',
      '--p-multiselect-list-gap': 'var(--multiselect-list-gap)',
      '--p-multiselect-list-header-padding':
        'var(--multiselect-list-header-padding-top) var(--multiselect-list-header-padding-right) var(--multiselect-list-header-padding-bottom) var(--multiselect-list-header-padding-left)',
      '--p-multiselect-option-padding': 'var(--multiselect-option-padding-y) var(--multiselect-option-padding-x)',
      '--p-multiselect-option-border-radius': 'var(--multiselect-option-border-radius)',
      '--p-multiselect-option-color': 'var(--multiselect-option-color)',
      '--p-multiselect-option-focus-background': 'var(--multiselect-option-focus-background)',
      '--p-multiselect-option-focus-color': 'var(--multiselect-option-focus-color)',
      '--p-multiselect-option-selected-background': 'var(--multiselect-option-selected-background)',
      '--p-multiselect-option-selected-color': 'var(--multiselect-option-selected-color)',
      '--p-multiselect-option-selected-focus-background': 'var(--multiselect-option-selected-focus-background)',
      '--p-multiselect-option-selected-focus-color': 'var(--multiselect-option-selected-focus-color)',
      '--p-multiselect-option-group-padding': 'var(--list-option-group-padding, var(--form-field-sm-padding-y) var(--form-field-padding-x))',
      '--p-multiselect-empty-message-padding': 'var(--multiselect-option-padding-y) var(--multiselect-option-padding-x)',
    };
  }

  multiselectHostVars(size: FormInteractionSize = 'normal'): Record<string, string> {
    return {
      '--p-multiselect-background': 'var(--multiselect-background)',
      '--p-multiselect-border-color': 'var(--multiselect-border-color)',
      '--p-multiselect-border-radius': 'var(--multiselect-border-radius)',
      '--p-multiselect-color': 'var(--multiselect-color)',
      '--p-multiselect-padding-x': `var(${this.fieldPaddingXToken('multiselect', size)})`,
      '--p-multiselect-padding-y': `var(${this.fieldPaddingYToken('multiselect', size)})`,
      '--p-multiselect-placeholder-color': 'var(--multiselect-placeholder-color)',
      '--p-multiselect-dropdown-color': 'var(--multiselect-dropdown-color)',
      '--p-multiselect-dropdown-width': 'var(--multiselect-dropdown-width)',
      '--p-multiselect-focus-border-color': 'var(--multiselect-focus-border-color)',
      '--p-multiselect-hover-border-color': 'var(--multiselect-hover-border-color)',
      '--p-multiselect-invalid-border-color': 'var(--multiselect-invalid-border-color)',
      '--p-multiselect-shadow': 'var(--multiselect-shadow)',
      '--p-multiselect-sm-font-size': 'var(--multiselect-sm-font-size)',
      '--p-multiselect-sm-padding-x': 'var(--multiselect-sm-padding-x)',
      '--p-multiselect-sm-padding-y': 'var(--multiselect-sm-padding-y)',
      '--p-multiselect-lg-font-size': 'var(--multiselect-lg-font-size)',
      '--p-multiselect-lg-padding-x': 'var(--multiselect-lg-padding-x)',
      '--p-multiselect-lg-padding-y': 'var(--multiselect-lg-padding-y)',
      '--p-multiselect-chip-border-radius': 'var(--multiselect-chip-border-radius)',
      ...this.multiselectOverlayHostVars(),
    };
  }

  multiselectFloatLabelHostVars(): Record<string, string> {
    const sx = this.multiselectIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, sx.size, 'multiselect');
  }

  multiselectIftaLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return this.iftaLabelHostVars(size, 'multiselect');
  }

  multiselectFloatLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    const sx = this.multiselectIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, size, 'multiselect');
  }

  multiselectFloatLabelStatesHostVars(): Record<string, string> {
    const sx = this.multiselectIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, 'normal', 'multiselect');
  }

  multiselectFloatPlaceholderAttr(state: FormInputDemoState): string | null {
    if (this.multiselectIsIftaLabel()) {
      if (state === 'filled') {
        return null;
      }
      return this.inputStatePlaceholder;
    }
    if (this.multiselectIsFloatLabel()) {
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

  multiselectStateValue(state: FormInputDemoState): FormSelectDemoValue[] {
    if (this.multiselectIsDefault()) {
      if (
        this.inputStateShowsPlaceholderOnly(
          { kind: 'multiselect', title: 'MultiSelect', category: 'input' },
          state,
        )
      ) {
        return this.multiselectDemoEmptyValue;
      }
      if (state === 'readonly') {
        return this.multiselectDemoFilledValue;
      }
      return this.multiselectDemoEmptyValue;
    }
    if (state === 'filled' || state === 'disabled') {
      return this.multiselectDemoFilledValue;
    }
    return this.multiselectDemoEmptyValue;
  }

  patchListbox(patch: Partial<FormListboxInteractionState>): void {
    this.listboxIx.update((prev) => {
      const next = { ...prev, ...patch };
      if (patch.variant !== undefined && patch.variant !== prev.variant) {
        next.value = patch.variant === 'checkbox' ? [] : null;
      }
      return next;
    });
  }

  listboxIsCheckbox(): boolean {
    return this.listboxIx().variant === 'checkbox';
  }

  listboxInteractionCheckmark(): boolean {
    return this.listboxIx().variant === 'checkmark';
  }

  listboxInteractionScopeClass(): Record<string, boolean> {
    return {
      'listbox-variant-checkmark': this.listboxInteractionCheckmark(),
      'listbox-variant-group': this.listboxInteractionGroup(),
      'listbox-variant-checkbox': this.listboxIsCheckbox(),
    };
  }

  listboxInteractionGroup(): boolean {
    return this.listboxIx().variant === 'group';
  }

  listboxIsBasic(): boolean {
    return this.listboxIx().variant === 'basic';
  }

  listboxInteractionOptions(): typeof this.selectDemoOptions | FormSelectDemoGroup[] {
    if (this.listboxInteractionGroup()) {
      return this.selectDemoGroupedOptions;
    }
    return this.selectDemoOptions;
  }

  listboxCountryFlagClass(code: string): string {
    return `flag flag-${code.toLowerCase()}`;
  }

  listboxOptionPaddingTokens(size: FormInteractionSize): { y: string; x: string } {
    switch (size) {
      case 'small':
        return { y: '--form-field-sm-padding-y', x: '--form-field-sm-padding-x' };
      case 'large':
        return { y: '--form-field-lg-padding-y', x: '--form-field-lg-padding-x' };
      default:
        return { y: '--listbox-option-padding-y', x: '--listbox-option-padding-x' };
    }
  }

  listboxHostVars(size: FormInteractionSize = 'normal'): Record<string, string> {
    const pad = this.listboxOptionPaddingTokens(size);
    const checkmark = this.listboxInteractionCheckmark();
    return {
      '--p-listbox-background': 'var(--listbox-background)',
      '--p-listbox-border-color': 'var(--listbox-border-color)',
      '--p-listbox-border-radius': 'var(--listbox-border-radius)',
      '--p-listbox-color': 'var(--listbox-color)',
      '--p-listbox-shadow': 'var(--listbox-shadow)',
      '--p-listbox-list-padding': 'var(--listbox-list-padding-y) var(--listbox-list-padding-x)',
      '--p-listbox-list-gap': 'var(--listbox-list-gap)',
      '--p-listbox-list-header-padding':
        'var(--listbox-list-header-padding-top) var(--listbox-list-header-padding-right) var(--listbox-list-header-padding-bottom) var(--listbox-list-header-padding-left)',
      '--p-listbox-option-padding': `var(${pad.y}) var(${pad.x})`,
      '--p-listbox-option-border-radius': 'var(--listbox-option-border-radius)',
      '--p-listbox-option-color': 'var(--listbox-option-color)',
      '--p-listbox-option-focus-background': 'var(--listbox-option-focus-background)',
      '--p-listbox-option-focus-color': 'var(--listbox-option-focus-color)',
      '--p-listbox-option-selected-background': checkmark
        ? 'transparent'
        : 'var(--listbox-option-selected-background)',
      '--p-listbox-option-selected-color': checkmark
        ? 'var(--listbox-option-color)'
        : 'var(--listbox-option-selected-color)',
      '--p-listbox-option-selected-focus-background': checkmark
        ? 'var(--listbox-option-focus-background)'
        : 'var(--listbox-option-selected-focus-background)',
      '--p-listbox-option-selected-focus-color': checkmark
        ? 'var(--listbox-option-focus-color)'
        : 'var(--listbox-option-selected-focus-color)',
      '--p-listbox-option-group-padding':
        'var(--listbox-option-group-padding-y) var(--listbox-option-group-padding-x)',
      '--p-listbox-checkmark-color': 'var(--listbox-checkmark-color)',
      '--p-listbox-checkmark-gutter-start': 'var(--listbox-checkmark-gutter-start)',
      '--p-listbox-checkmark-gutter-end': 'var(--listbox-checkmark-gutter-end)',
      '--p-listbox-invalid-border-color': 'var(--listbox-invalid-border-color)',
      '--p-listbox-disabled-background': 'var(--listbox-disabled-background)',
      '--p-listbox-disabled-color': 'var(--listbox-disabled-color)',
    };
  }

  listboxStateValue(state: FormInputDemoState): FormSelectDemoValue | null {
    if (state === 'disabled' || state === 'invalid') {
      return FORM_SELECT_STATE_FILLED_VALUE;
    }
    return null;
  }

  patchCascadeSelect(patch: Partial<FormCascadeSelectInteractionState>): void {
    this.cascadeSelectIx.update((prev) => {
      const next = { ...prev, ...patch };
      if (patch.variant !== undefined && patch.variant !== prev.variant) {
        next.value = null;
      }
      return next;
    });
    if (patch.variant !== undefined) {
      this.cascadeSelectFloatIxFocused.set(false);
      this.cascadeSelectFloatOverlayOpen.set(false);
    }
  }

  cascadeSelectIsDefault(): boolean {
    return this.cascadeSelectIx().variant === 'default';
  }

  cascadeSelectIsFloatLabel(): boolean {
    return this.cascadeSelectIx().variant === 'floatlabel';
  }

  cascadeSelectIsIftaLabel(): boolean {
    return this.cascadeSelectIx().variant === 'iftalabel';
  }

  cascadeSelectFloatPosition(): FormInputFloatVariant {
    return this.cascadeSelectIx().floatPosition;
  }

  cascadeSelectIsFloatIn(): boolean {
    return this.cascadeSelectIsFloatLabel() && this.cascadeSelectFloatPosition() === 'in';
  }

  cascadeSelectIsFloatOverOrOn(): boolean {
    return (
      this.cascadeSelectIsFloatLabel() &&
      (this.cascadeSelectFloatPosition() === 'over' || this.cascadeSelectFloatPosition() === 'on')
    );
  }

  cascadeSelectInteractionLabelFloated(): boolean {
    if (!this.cascadeSelectIsFloatLabel()) {
      return false;
    }
    return (
      !!this.cascadeSelectIx().value ||
      this.cascadeSelectFloatIxFocused() ||
      this.cascadeSelectFloatOverlayOpen()
    );
  }

  cascadeSelectFloatStateLabelFloated(state: FormInputDemoState): boolean {
    if (this.cascadeSelectFloatPosition() === 'in') {
      return state === 'filled' || state === 'focus' || state === 'disabled';
    }
    if (this.cascadeSelectIsFloatOverOrOn() && state === 'disabled') {
      return true;
    }
    return state === 'focus' || state === 'filled';
  }

  /** Sizes: Over/On elevan label; In siempre arriba (igual que Select, Textarea, Password). */
  cascadeSelectFloatSizeLabelFloated(): boolean {
    if (!this.cascadeSelectIsFloatLabel()) {
      return false;
    }
    return true;
  }

  setCascadeSelectFloatIxFocused(focused: boolean): void {
    if (!this.cascadeSelectIsFloatLabel()) {
      return;
    }
    if (!focused && this.cascadeSelectFloatOverlayOpen()) {
      return;
    }
    this.cascadeSelectFloatIxFocused.set(focused);
  }

  setCascadeSelectFloatOverlayOpen(open: boolean): void {
    if (!this.cascadeSelectIsFloatLabel()) {
      return;
    }
    this.cascadeSelectFloatOverlayOpen.set(open);
    if (open) {
      this.cascadeSelectFloatIxFocused.set(true);
    } else if (!this.cascadeSelectIx().value) {
      this.cascadeSelectFloatIxFocused.set(false);
    }
  }

  cascadeSelectFloatInteractionPlaceholder(): string | null {
    if (this.cascadeSelectIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    if (!this.cascadeSelectFloatIxFocused() && !this.cascadeSelectFloatOverlayOpen()) {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  cascadeSelectInteractionPlaceholder(): string {
    if (this.cascadeSelectIsDefault() || this.cascadeSelectIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    return this.cascadeSelectFloatInteractionPlaceholder() ?? '';
  }

  cascadeSelectInteractionScopeClass(): Record<string, boolean> {
    const sx = this.cascadeSelectIx();
    return {
      'input-variant-block': true,
      'form-input-interaction--stacked': sx.variant === 'floatlabel' || sx.variant === 'iftalabel',
      'floatlabel-variant-over': sx.variant === 'floatlabel' && sx.floatPosition === 'over',
      'floatlabel-variant-on': sx.variant === 'floatlabel' && sx.floatPosition === 'on',
      'floatlabel-variant-in': sx.variant === 'floatlabel' && sx.floatPosition === 'in',
      'iftalabel-variant': sx.variant === 'iftalabel',
    };
  }

  cascadeSelectPrimeSize(size: FormInteractionSize): 'small' | 'large' | undefined {
    return size === 'small' ? 'small' : size === 'large' ? 'large' : undefined;
  }

  private cascadeSelectOverlayHostVars(): Record<string, string> {
    return {
      '--p-cascadeselect-overlay-background': 'var(--cascadeselect-overlay-background)',
      '--p-cascadeselect-overlay-border-color': 'var(--cascadeselect-overlay-border-color)',
      '--p-cascadeselect-overlay-border-radius': 'var(--cascadeselect-overlay-border-radius)',
      '--p-cascadeselect-overlay-color': 'var(--cascadeselect-overlay-color)',
      '--p-cascadeselect-overlay-shadow': 'var(--cascadeselect-overlay-shadow)',
      '--p-cascadeselect-list-gap': 'var(--cascadeselect-list-gap)',
      '--p-cascadeselect-option-border-radius': 'var(--cascadeselect-option-border-radius)',
      '--p-cascadeselect-option-color': 'var(--cascadeselect-option-color)',
      '--p-cascadeselect-option-focus-background': 'var(--cascadeselect-option-focus-background)',
      '--p-cascadeselect-option-focus-color': 'var(--cascadeselect-option-focus-color)',
      '--p-cascadeselect-option-selected-background': 'var(--cascadeselect-option-selected-background)',
      '--p-cascadeselect-option-selected-color': 'var(--cascadeselect-option-selected-color)',
      '--p-cascadeselect-option-selected-focus-background': 'var(--cascadeselect-option-selected-focus-background)',
      '--p-cascadeselect-option-selected-focus-color': 'var(--cascadeselect-option-selected-focus-color)',
      '--p-cascadeselect-option-icon-color': 'var(--cascadeselect-option-icon-color)',
      '--p-cascadeselect-option-icon-focus-color': 'var(--cascadeselect-option-icon-focus-color)',
      '--p-cascadeselect-option-icon-size': 'var(--cascadeselect-option-icon-size)',
    };
  }

  cascadeSelectHostVars(size: FormInteractionSize = 'normal'): Record<string, string> {
    return {
      '--p-cascadeselect-background': 'var(--cascadeselect-background)',
      '--p-cascadeselect-border-color': 'var(--cascadeselect-border-color)',
      '--p-cascadeselect-border-radius': 'var(--cascadeselect-border-radius)',
      '--p-cascadeselect-color': 'var(--cascadeselect-color)',
      '--p-cascadeselect-padding-x': `var(${this.fieldPaddingXToken('cascadeselect', size)})`,
      '--p-cascadeselect-padding-y': `var(${this.fieldPaddingYToken('cascadeselect', size)})`,
      '--p-cascadeselect-placeholder-color': 'var(--cascadeselect-placeholder-color)',
      '--p-cascadeselect-dropdown-color': 'var(--cascadeselect-dropdown-color)',
      '--p-cascadeselect-dropdown-width': 'var(--cascadeselect-dropdown-width)',
      '--p-cascadeselect-focus-border-color': 'var(--cascadeselect-focus-border-color)',
      '--p-cascadeselect-hover-border-color': 'var(--cascadeselect-hover-border-color)',
      '--p-cascadeselect-invalid-border-color': 'var(--cascadeselect-invalid-border-color)',
      '--p-cascadeselect-shadow': 'var(--cascadeselect-shadow)',
      '--p-cascadeselect-sm-font-size': 'var(--cascadeselect-sm-font-size)',
      '--p-cascadeselect-sm-padding-x': 'var(--cascadeselect-sm-padding-x)',
      '--p-cascadeselect-sm-padding-y': 'var(--cascadeselect-sm-padding-y)',
      '--p-cascadeselect-lg-font-size': 'var(--cascadeselect-lg-font-size)',
      '--p-cascadeselect-lg-padding-x': 'var(--cascadeselect-lg-padding-x)',
      '--p-cascadeselect-lg-padding-y': 'var(--cascadeselect-lg-padding-y)',
      ...this.cascadeSelectOverlayHostVars(),
    };
  }

  cascadeSelectFloatLabelHostVars(): Record<string, string> {
    const sx = this.cascadeSelectIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, sx.size, 'cascadeselect');
  }

  cascadeSelectIftaLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return this.iftaLabelHostVars(size, 'cascadeselect');
  }

  cascadeSelectFloatLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    const sx = this.cascadeSelectIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, size, 'cascadeselect');
  }

  cascadeSelectFloatLabelStatesHostVars(): Record<string, string> {
    const sx = this.cascadeSelectIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, 'normal', 'cascadeselect');
  }

  cascadeSelectFloatPlaceholderAttr(state: FormInputDemoState): string | null {
    if (this.cascadeSelectIsIftaLabel()) {
      if (state === 'filled') {
        return null;
      }
      return this.inputStatePlaceholder;
    }
    if (this.cascadeSelectIsFloatLabel()) {
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

  cascadeSelectStateValue(state: FormInputDemoState): FormCascadeSelectDemoValue | null {
    if (this.cascadeSelectIsDefault()) {
      if (
        this.inputStateShowsPlaceholderOnly(
          { kind: 'cascadeselect', title: 'CascadeSelect', category: 'input' },
          state,
        )
      ) {
        return null;
      }
      if (state === 'readonly') {
        return FORM_CASCADESELECT_STATE_FILLED_VALUE;
      }
      return null;
    }
    if (state === 'filled' || state === 'disabled') {
      return FORM_CASCADESELECT_STATE_FILLED_VALUE;
    }
    return null;
  }

  patchTreeSelect(patch: Partial<FormTreeSelectInteractionState>): void {
    this.treeSelectIx.update((prev) => {
      const next = { ...prev, ...patch };
      if (patch.variant !== undefined && patch.variant !== prev.variant) {
        next.value = null;
      }
      if (patch.treeOption !== undefined && patch.treeOption !== prev.treeOption) {
        next.value = null;
      }
      return next;
    });
    if (patch.variant !== undefined || patch.treeOption !== undefined) {
      this.treeSelectFloatIxFocused.set(false);
      this.treeSelectFloatOverlayOpen.set(false);
    }
  }

  treeSelectIsDefault(): boolean {
    return this.treeSelectIx().variant === 'default';
  }

  treeSelectIsFloatLabel(): boolean {
    return this.treeSelectIx().variant === 'floatlabel';
  }

  treeSelectIsIftaLabel(): boolean {
    return this.treeSelectIx().variant === 'iftalabel';
  }

  treeSelectFloatPosition(): FormInputFloatVariant {
    return this.treeSelectIx().floatPosition;
  }

  treeSelectIsFloatIn(): boolean {
    return this.treeSelectIsFloatLabel() && this.treeSelectFloatPosition() === 'in';
  }

  treeSelectIsFloatOverOrOn(): boolean {
    return (
      this.treeSelectIsFloatLabel() &&
      (this.treeSelectFloatPosition() === 'over' || this.treeSelectFloatPosition() === 'on')
    );
  }

  treeSelectInteractionLabelFloated(): boolean {
    if (!this.treeSelectIsFloatLabel()) {
      return false;
    }
    return (
      !!this.treeSelectIx().value ||
      this.treeSelectFloatIxFocused() ||
      this.treeSelectFloatOverlayOpen()
    );
  }

  treeSelectFloatStateLabelFloated(state: FormInputDemoState): boolean {
    if (this.treeSelectFloatPosition() === 'in') {
      return state === 'filled' || state === 'focus' || state === 'disabled';
    }
    if (this.treeSelectIsFloatOverOrOn() && state === 'disabled') {
      return true;
    }
    return state === 'focus' || state === 'filled';
  }

  /** Sizes: Over/On elevan label; In siempre arriba (igual que Select, Textarea, Password). */
  treeSelectFloatSizeLabelFloated(): boolean {
    if (!this.treeSelectIsFloatLabel()) {
      return false;
    }
    return true;
  }

  setTreeSelectFloatIxFocused(focused: boolean): void {
    if (!this.treeSelectIsFloatLabel()) {
      return;
    }
    if (!focused && this.treeSelectFloatOverlayOpen()) {
      return;
    }
    this.treeSelectFloatIxFocused.set(focused);
  }

  setTreeSelectFloatOverlayOpen(open: boolean): void {
    if (!this.treeSelectIsFloatLabel()) {
      return;
    }
    this.treeSelectFloatOverlayOpen.set(open);
    if (open) {
      this.treeSelectFloatIxFocused.set(true);
    } else if (!this.treeSelectIx().value) {
      this.treeSelectFloatIxFocused.set(false);
    }
  }

  treeSelectFloatInteractionPlaceholder(): string | null {
    if (this.treeSelectIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    if (!this.treeSelectFloatIxFocused() && !this.treeSelectFloatOverlayOpen()) {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  treeSelectInteractionPlaceholder(): string {
    if (this.treeSelectIsDefault() || this.treeSelectIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    return this.treeSelectFloatInteractionPlaceholder() ?? '';
  }

  treeSelectInteractionScopeClass(): Record<string, boolean> {
    const sx = this.treeSelectIx();
    return {
      'catalog-input-interactive--float-over': sx.variant === 'floatlabel' && sx.floatPosition === 'over',
      'catalog-input-interactive--float-on': sx.variant === 'floatlabel' && sx.floatPosition === 'on',
      'catalog-input-interactive--float-in': sx.variant === 'floatlabel' && sx.floatPosition === 'in',
    };
  }

  treeSelectPrimeSize(size: FormInteractionSize): 'small' | 'large' | undefined {
    return size === 'small' ? 'small' : size === 'large' ? 'large' : undefined;
  }

  private treeSelectOverlayHostVars(): Record<string, string> {
    return {
      '--p-treeselect-overlay-background': 'var(--treeselect-overlay-background)',
      '--p-treeselect-overlay-border-color': 'var(--treeselect-overlay-border-color)',
      '--p-treeselect-overlay-border-radius': 'var(--treeselect-overlay-border-radius)',
      '--p-treeselect-overlay-color': 'var(--treeselect-overlay-color)',
      '--p-treeselect-overlay-shadow': 'var(--treeselect-overlay-shadow)',
    };
  }

  treeSelectHostVars(size: FormInteractionSize = 'normal'): Record<string, string> {
    return {
      '--p-treeselect-background': 'var(--treeselect-background)',
      '--p-treeselect-border-color': 'var(--treeselect-border-color)',
      '--p-treeselect-border-radius': 'var(--treeselect-border-radius)',
      '--p-treeselect-color': 'var(--treeselect-color)',
      '--p-treeselect-padding-x': `var(${this.fieldPaddingXToken('treeselect', size)})`,
      '--p-treeselect-padding-y': `var(${this.fieldPaddingYToken('treeselect', size)})`,
      '--p-treeselect-placeholder-color': 'var(--treeselect-placeholder-color)',
      '--p-treeselect-dropdown-color': 'var(--treeselect-dropdown-color)',
      '--p-treeselect-dropdown-width': 'var(--treeselect-dropdown-width)',
      '--p-treeselect-focus-border-color': 'var(--treeselect-focus-border-color)',
      '--p-treeselect-hover-border-color': 'var(--treeselect-hover-border-color)',
      '--p-treeselect-invalid-border-color': 'var(--treeselect-invalid-border-color)',
      '--p-treeselect-shadow': 'var(--treeselect-shadow)',
      '--p-treeselect-sm-font-size': 'var(--treeselect-sm-font-size)',
      '--p-treeselect-sm-padding-x': 'var(--treeselect-sm-padding-x)',
      '--p-treeselect-sm-padding-y': 'var(--treeselect-sm-padding-y)',
      '--p-treeselect-lg-font-size': 'var(--treeselect-lg-font-size)',
      '--p-treeselect-lg-padding-x': 'var(--treeselect-lg-padding-x)',
      '--p-treeselect-lg-padding-y': 'var(--treeselect-lg-padding-y)',
      ...this.treeSelectOverlayHostVars(),
    };
  }

  treeSelectFloatLabelHostVars(): Record<string, string> {
    const sx = this.treeSelectIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, sx.size, 'treeselect');
  }

  treeSelectIftaLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return this.iftaLabelHostVars(size, 'treeselect');
  }

  treeSelectFloatLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    const sx = this.treeSelectIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, size, 'treeselect');
  }

  treeSelectFloatLabelStatesHostVars(): Record<string, string> {
    const sx = this.treeSelectIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, 'normal', 'treeselect');
  }

  treeSelectFloatPlaceholderAttr(state: FormInputDemoState): string | null {
    if (this.treeSelectIsIftaLabel()) {
      if (state === 'filled') {
        return null;
      }
      return this.inputStatePlaceholder;
    }
    if (this.treeSelectIsFloatLabel()) {
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

  treeSelectStateValue(state: FormInputDemoState): FormTreeSelectInteractionValue {
    if (this.treeSelectIsDefault()) {
      if (
        this.inputStateShowsPlaceholderOnly(
          { kind: 'treeselect', title: 'TreeSelect', category: 'input' },
          state,
        )
      ) {
        return null;
      }
      if (state === 'readonly') {
        return this.treeSelectFilledValueForState();
      }
      return null;
    }
    if (state === 'filled' || state === 'disabled') {
      return this.treeSelectFilledValueForState();
    }
    return null;
  }

  treeSelectSelectionMode(): 'single' | 'checkbox' {
    return this.treeSelectIx().treeOption === 'checkbox' ? 'checkbox' : 'single';
  }

  private treeSelectFilledValueForState(): FormTreeSelectInteractionValue {
    if (this.treeSelectIx().treeOption === 'checkbox') {
      return FORM_TREESELECT_CHECKBOX_STATE_FILLED_VALUE;
    }
    return this.treeSelectDemoNodeByKey(FORM_TREESELECT_STATE_FILLED_VALUE);
  }

  /** PrimeNG TreeSelect (single) espera TreeNode en ngModel, no la clave del nodo. */
  private treeSelectDemoNodeByKey(key: string): TreeNode | null {
    const walk = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.key === key) {
          return node;
        }
        if (node.children?.length) {
          const found = walk(node.children);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };
    return walk(this.treeSelectDemoNodes);
  }

  patchDatepicker(patch: Partial<FormDatepickerInteractionState>): void {
    const prevOverlay = this.datepickerIx().overlayInfo;
    const prevVariant = this.datepickerIx().variant;
    this.datepickerIx.update((prev) => {
      if (patch.value !== undefined && this.datepickerValuesEqual(prev.value, patch.value)) {
        return prev;
      }
      const next = { ...prev, ...patch };
      if (patch.variant !== undefined && patch.variant !== prev.variant) {
        next.value = null;
      }
      if (patch.overlayInfo !== undefined && patch.overlayInfo !== prev.overlayInfo) {
        next.value = null;
      }
      return next;
    });
    if (patch.overlayInfo !== undefined && patch.overlayInfo !== prevOverlay) {
      this.datepickerOverlayMountKey.update((key) => key + 1);
      this.datepickerFloatIxFocused.set(false);
      this.datepickerFloatOverlayOpen.set(false);
    } else if (patch.variant !== undefined && patch.variant !== prevVariant) {
      this.datepickerFloatIxFocused.set(false);
      this.datepickerFloatOverlayOpen.set(false);
    }
  }

  private datepickerValuesEqual(
    left: Date | Date[] | null,
    right: Date | Date[] | null,
  ): boolean {
    if (left === right) {
      return true;
    }
    if (left == null || right == null) {
      return false;
    }
    if (Array.isArray(left) && Array.isArray(right)) {
      if (left.length !== right.length) {
        return false;
      }
      return left.every((date, index) => {
        const other = right[index];
        if (date == null && other == null) {
          return true;
        }
        if (date == null || other == null) {
          return false;
        }
        return date.getTime() === other.getTime();
      });
    }
    if (!Array.isArray(left) && !Array.isArray(right)) {
      return left.getTime() === right.getTime();
    }
    return false;
  }

  datepickerSelectionMode(): 'single' | 'range' {
    return this.datepickerIx().overlayInfo === 'range' ? 'range' : 'single';
  }

  datepickerView(): 'date' | 'month' | 'year' {
    const info = this.datepickerIx().overlayInfo;
    if (info === 'month') {
      return 'month';
    }
    if (info === 'year') {
      return 'year';
    }
    return 'date';
  }

  datepickerShowTime(): boolean {
    return this.datepickerIx().overlayInfo === 'time';
  }

  /** Mantener overlay abierto tras elegir día para permitir ajustar la hora (PrimeNG showTime). */
  datepickerHideOnDateTimeSelect(): boolean {
    return !this.datepickerShowTime();
  }

  datepickerNumberOfMonths(): number {
    return this.datepickerIx().overlayInfo === 'multiple-month' ? 2 : 1;
  }

  datepickerDateFormat(): string {
    switch (this.datepickerIx().overlayInfo) {
      case 'month':
        return 'mm/yy';
      case 'year':
        return 'yy';
      default:
        return 'dd/mm/yy';
    }
  }

  /** Month/Year picker: input de solo lectura (docs PrimeNG). */
  datepickerReadonlyInput(): boolean {
    const info = this.datepickerIx().overlayInfo;
    return info === 'month' || info === 'year';
  }

  /** Preview estático Default: readonly del catálogo o month/year overlay. */
  datepickerStateReadonlyInput(state: FormInputDemoState): boolean {
    return this.datepickerReadonlyInput() || state === 'readonly';
  }

  datepickerHasValue(): boolean {
    const value = this.datepickerIx().value;
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value != null;
  }

  private datepickerFilledDemoValue(): Date | Date[] {
    return this.datepickerIx().overlayInfo === 'range'
      ? FORM_DATEPICKER_RANGE_DEMO_VALUE
      : FORM_DATEPICKER_STATE_FILLED_VALUE;
  }

  datepickerIsDefault(): boolean {
    return this.datepickerIx().variant === 'default';
  }

  datepickerIsFloatLabel(): boolean {
    return this.datepickerIx().variant === 'floatlabel';
  }

  datepickerIsIftaLabel(): boolean {
    return this.datepickerIx().variant === 'iftalabel';
  }

  datepickerFloatPosition(): FormInputFloatVariant {
    return this.datepickerIx().floatPosition;
  }

  datepickerIsFloatIn(): boolean {
    return this.datepickerIsFloatLabel() && this.datepickerFloatPosition() === 'in';
  }

  datepickerIsFloatOverOrOn(): boolean {
    return (
      this.datepickerIsFloatLabel() &&
      (this.datepickerFloatPosition() === 'over' || this.datepickerFloatPosition() === 'on')
    );
  }

  datepickerInteractionLabelFloated(): boolean {
    if (!this.datepickerIsFloatLabel()) {
      return false;
    }
    return (
      this.datepickerHasValue() ||
      this.datepickerFloatIxFocused() ||
      this.datepickerFloatOverlayOpen()
    );
  }

  datepickerFloatStateLabelFloated(state: FormInputDemoState): boolean {
    if (this.datepickerFloatPosition() === 'in') {
      return state === 'filled' || state === 'focus' || state === 'disabled';
    }
    if (this.datepickerIsFloatOverOrOn() && state === 'disabled') {
      return true;
    }
    return state === 'focus' || state === 'filled';
  }

  datepickerFloatSizeLabelFloated(): boolean {
    if (!this.datepickerIsFloatLabel()) {
      return false;
    }
    return true;
  }

  setDatepickerFloatIxFocused(focused: boolean): void {
    if (!this.datepickerIsFloatLabel()) {
      return;
    }
    if (!focused && this.datepickerFloatOverlayOpen()) {
      return;
    }
    if (this.datepickerFloatIxFocused() === focused) {
      return;
    }
    this.datepickerFloatIxFocused.set(focused);
  }

  setDatepickerFloatOverlayOpen(open: boolean): void {
    if (!this.datepickerIsFloatLabel()) {
      return;
    }
    if (this.datepickerFloatOverlayOpen() === open) {
      return;
    }
    this.datepickerFloatOverlayOpen.set(open);
    if (open) {
      this.datepickerFloatIxFocused.set(true);
    } else if (!this.datepickerHasValue()) {
      this.datepickerFloatIxFocused.set(false);
    }
  }

  datepickerFloatInteractionPlaceholder(): string | null {
    if (this.datepickerIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    if (!this.datepickerFloatIxFocused() && !this.datepickerFloatOverlayOpen()) {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  datepickerInteractionPlaceholder(): string {
    if (this.datepickerIsDefault() || this.datepickerIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    return this.datepickerFloatInteractionPlaceholder() ?? '';
  }

  datepickerInteractionScopeClass(): Record<string, boolean> {
    const sx = this.datepickerIx();
    return {
      'input-variant-block': true,
      'form-input-interaction--stacked': sx.variant === 'floatlabel' || sx.variant === 'iftalabel',
      'floatlabel-variant-over': sx.variant === 'floatlabel' && sx.floatPosition === 'over',
      'floatlabel-variant-on': sx.variant === 'floatlabel' && sx.floatPosition === 'on',
      'floatlabel-variant-in': sx.variant === 'floatlabel' && sx.floatPosition === 'in',
      'iftalabel-variant': sx.variant === 'iftalabel',
    };
  }

  datepickerPrimeSize(size: FormInteractionSize): 'small' | 'large' | undefined {
    return size === 'small' ? 'small' : size === 'large' ? 'large' : undefined;
  }

  /** Cache de estilos inline para evitar re-init del DatePicker en cada CD. */
  private datepickerPanelHostVarsCache: Record<string, string> | null = null;
  private readonly datepickerHostVarsCache: Partial<Record<FormInteractionSize, Record<string, string>>> =
    {};
  private datepickerStateValueCacheOverlay: FormDatepickerOverlayInfo | null = null;
  private datepickerStateValueCacheVariant: FormInputTextVariant | null = null;
  private readonly datepickerStateValueCache = new Map<FormInputDemoState, Date | Date[] | null>();

  datepickerPanelHostVars(): Record<string, string> {
    if (this.datepickerPanelHostVarsCache) {
      return this.datepickerPanelHostVarsCache;
    }
    this.datepickerPanelHostVarsCache = {
      '--p-datepicker-panel-background': 'var(--datepicker-panel-background)',
      '--p-datepicker-panel-border-color': 'var(--datepicker-panel-border-color)',
      '--p-datepicker-panel-border-radius': 'var(--datepicker-panel-border-radius)',
      '--p-datepicker-panel-color': 'var(--datepicker-panel-color)',
      '--p-datepicker-panel-padding': 'var(--datepicker-panel-padding)',
      '--p-datepicker-panel-shadow': 'var(--datepicker-panel-shadow)',
      '--p-datepicker-header-background': 'var(--datepicker-header-background)',
      '--p-datepicker-header-border-color': 'var(--datepicker-header-border-color)',
      '--p-datepicker-header-color': 'var(--datepicker-header-color)',
      '--p-datepicker-date-selected-background': 'var(--datepicker-date-selected-background)',
      '--p-datepicker-date-selected-color': 'var(--datepicker-date-selected-color)',
      '--p-datepicker-date-hover-background': 'var(--datepicker-date-hover-background)',
      '--p-datepicker-date-hover-color': 'var(--datepicker-date-hover-color)',
      '--p-datepicker-today-background': 'var(--datepicker-today-background)',
      '--p-datepicker-today-color': 'var(--datepicker-today-color)',
    };
    return this.datepickerPanelHostVarsCache;
  }

  datepickerHostVars(size: FormInteractionSize = 'normal'): Record<string, string> {
    const cached = this.datepickerHostVarsCache[size];
    if (cached) {
      return cached;
    }
    const dropdownWidth =
      size === 'small'
        ? 'var(--datepicker-dropdown-sm-width)'
        : size === 'large'
          ? 'var(--datepicker-dropdown-lg-width)'
          : 'var(--datepicker-dropdown-width)';
    const vars = {
      '--p-inputtext-padding-x': `var(${this.fieldPaddingXToken('inputtext', size)})`,
      '--p-inputtext-padding-y': `var(${this.fieldPaddingYToken('inputtext', size)})`,
      '--p-inputtext-border-color': 'var(--inputtext-border-color)',
      '--p-inputtext-background': 'var(--inputtext-background)',
      '--p-inputtext-color': 'var(--inputtext-color)',
      '--p-inputtext-placeholder-color': 'var(--inputtext-placeholder-color)',
      '--p-inputtext-focus-border-color': 'var(--inputtext-focus-border-color)',
      '--p-inputtext-hover-border-color': 'var(--inputtext-hover-border-color)',
      '--p-inputtext-invalid-border-color': 'var(--inputtext-invalid-border-color)',
      '--p-inputtext-disabled-background': 'var(--inputtext-disabled-background)',
      '--p-inputtext-disabled-color': 'var(--inputtext-disabled-color)',
      '--p-inputtext-shadow': 'var(--inputtext-shadow)',
      '--p-inputtext-filled-background': 'var(--inputtext-filled-background)',
      '--p-inputtext-filled-hover-background': 'var(--inputtext-filled-hover-background)',
      '--p-inputtext-filled-focus-background': 'var(--inputtext-filled-focus-background)',
      '--p-datepicker-dropdown-width': dropdownWidth,
      '--p-datepicker-dropdown-color': 'var(--datepicker-dropdown-color)',
      '--p-datepicker-input-icon-color': 'var(--datepicker-input-icon-color)',
      ...this.datepickerPanelHostVars(),
    };
    this.datepickerHostVarsCache[size] = vars;
    return vars;
  }

  datepickerFloatLabelHostVars(): Record<string, string> {
    const sx = this.datepickerIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, sx.size, 'inputtext');
  }

  datepickerIftaLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return this.iftaLabelInputtextHostVars(size, 'inputtext');
  }

  datepickerFloatLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    const sx = this.datepickerIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, size, 'inputtext');
  }

  datepickerFloatLabelStatesHostVars(): Record<string, string> {
    const sx = this.datepickerIx();
    return this.floatLabelHostVarsForVariant(sx.variant, sx.floatPosition, 'normal', 'inputtext');
  }

  datepickerFloatPlaceholderAttr(state: FormInputDemoState): string | null {
    if (this.datepickerIsIftaLabel()) {
      if (state === 'filled') {
        return null;
      }
      return this.inputStatePlaceholder;
    }
    if (this.datepickerIsFloatLabel()) {
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

  datepickerStateValue(state: FormInputDemoState): Date | Date[] | null {
    const overlay = this.datepickerIx().overlayInfo;
    const variant = this.datepickerIx().variant;
    if (
      this.datepickerStateValueCacheOverlay !== overlay ||
      this.datepickerStateValueCacheVariant !== variant
    ) {
      this.datepickerStateValueCache.clear();
      this.datepickerStateValueCacheOverlay = overlay;
      this.datepickerStateValueCacheVariant = variant;
    }
    const cached = this.datepickerStateValueCache.get(state);
    if (cached !== undefined) {
      return cached;
    }

    const filled = this.datepickerFilledDemoValue();
    let value: Date | Date[] | null;
    if (this.datepickerIsDefault()) {
      if (
        this.inputStateShowsPlaceholderOnly(
          { kind: 'datepicker', title: 'DatePicker', category: 'input' },
          state,
        )
      ) {
        value = null;
      } else if (state === 'readonly') {
        value = filled;
      } else {
        value = null;
      }
    } else if (state === 'filled' || state === 'disabled') {
      value = filled;
    } else {
      value = null;
    }

    this.datepickerStateValueCache.set(state, value);
    return value;
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

  passwordIsFloatOverOrOn(): boolean {
    return (
      this.passwordIsFloatLabel() &&
      (this.passwordFloatPosition() === 'over' || this.passwordFloatPosition() === 'on')
    );
  }

  /** Float Label: label arriba con valor o foco (Over/On/In). */
  passwordInteractionLabelFloated(): boolean {
    if (!this.passwordIsFloatLabel()) {
      return false;
    }
    return !!this.passwordIx().value || this.passwordFloatIxFocused();
  }

  passwordFloatStateLabelFloated(state: FormInputDemoState): boolean {
    // Invalid lleva valor enmascarado: el label debe quedar arriba (no centrado encima de ****).
    if (this.passwordFloatPosition() === 'in') {
      return state === 'filled' || state === 'focus' || state === 'disabled' || state === 'invalid';
    }
    if (this.passwordIsFloatOverOrOn() && state === 'disabled') {
      return true;
    }
    return state === 'focus' || state === 'filled' || state === 'invalid';
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

  /** Float Label estático: placeholder solo en Focus (label arriba); si el label está dentro, sin placeholder. */
  passwordFloatPlaceholderAttr(state: FormInputDemoState): string | null {
    if (this.passwordIsIftaLabel()) {
      if (state === 'filled') {
        return null;
      }
      return this.inputStatePlaceholder;
    }
    if (this.passwordIsFloatLabel()) {
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

  /** Float Label interactivo: placeholder solo con foco. */
  passwordFloatInteractionPlaceholder(): string | null {
    if (this.passwordIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    if (!this.passwordFloatIxFocused()) {
      return null;
    }
    return this.inputStatePlaceholder;
  }

  /** Placeholder en Interaction: Default e IftaLabel siempre; Float Label solo con foco. */
  passwordInteractionPlaceholder(): string {
    if (this.passwordIsDefault() || this.passwordIsIftaLabel()) {
      return this.inputStatePlaceholder;
    }
    return this.passwordFloatInteractionPlaceholder() ?? '';
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

  patchSlider(patch: Partial<FormSliderInteractionState>): void {
    this.sliderIx.update((prev) => {
      const next: FormSliderInteractionState = { ...prev, ...patch };
      if (patch.variant === 'controlled') {
        next.direction = 'horizontal';
        next.range = false;
      }
      if (patch.range === true && !prev.range) {
        next.rangeValue = [...FORM_SLIDER_DEFAULT_RANGE_VALUE];
      }
      if (patch.range === false && prev.range) {
        next.value = prev.rangeValue[0] ?? FORM_SLIDER_DEFAULT_VALUE;
      }
      return next;
    });
  }

  sliderOrientation(): FormSliderDirection {
    return this.sliderIx().variant === 'controlled' ? 'horizontal' : this.sliderIx().direction;
  }

  sliderIsVertical(): boolean {
    return this.sliderOrientation() === 'vertical';
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
    if (field === 'multiselect') {
      if (size === 'small') {
        return '--multiselect-sm-font-size';
      }
      if (size === 'large') {
        return '--multiselect-lg-font-size';
      }
      return '--multiselect-font-size';
    }
    if (field === 'cascadeselect') {
      if (size === 'small') {
        return '--cascadeselect-sm-font-size';
      }
      if (size === 'large') {
        return '--cascadeselect-lg-font-size';
      }
      return '--inputtext-font-size';
    }
    if (field === 'treeselect') {
      if (size === 'small') {
        return '--treeselect-sm-font-size';
      }
      if (size === 'large') {
        return '--treeselect-lg-font-size';
      }
      return '--treeselect-font-size';
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
    if (field === 'multiselect') {
      if (size === 'small') {
        return '--multiselect-sm-padding-x';
      }
      if (size === 'large') {
        return '--multiselect-lg-padding-x';
      }
      return '--multiselect-padding-x';
    }
    if (field === 'cascadeselect') {
      if (size === 'small') {
        return '--cascadeselect-sm-padding-x';
      }
      if (size === 'large') {
        return '--cascadeselect-lg-padding-x';
      }
      return '--cascadeselect-padding-x';
    }
    if (field === 'treeselect') {
      if (size === 'small') {
        return '--treeselect-sm-padding-x';
      }
      if (size === 'large') {
        return '--treeselect-lg-padding-x';
      }
      return '--treeselect-padding-x';
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
    if (field === 'multiselect') {
      if (size === 'small') {
        return '--multiselect-sm-padding-y';
      }
      if (size === 'large') {
        return '--multiselect-lg-padding-y';
      }
      return '--multiselect-padding-y';
    }
    if (field === 'cascadeselect') {
      if (size === 'small') {
        return '--cascadeselect-sm-padding-y';
      }
      if (size === 'large') {
        return '--cascadeselect-lg-padding-y';
      }
      return '--cascadeselect-padding-y';
    }
    if (field === 'treeselect') {
      if (size === 'small') {
        return '--treeselect-sm-padding-y';
      }
      if (size === 'large') {
        return '--treeselect-lg-padding-y';
      }
      return '--treeselect-padding-y';
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

  private isDropdownField(field: FormFieldKind): field is 'select' | 'multiselect' | 'cascadeselect' | 'treeselect' {
    return field === 'select' || field === 'multiselect' || field === 'cascadeselect' || field === 'treeselect';
  }

  private fieldFilledBackgroundCssVar(
    field: 'select' | 'multiselect' | 'cascadeselect' | 'treeselect' | 'textarea' | 'inputtext',
  ): string {
    if (field === 'textarea') {
      return 'var(--textarea-filled-background, var(--p-textarea-filled-background, var(--form-field-filled-background)))';
    }
    if (field === 'select') {
      return 'var(--select-filled-background, var(--p-select-filled-background, var(--form-field-filled-background)))';
    }
    if (field === 'multiselect') {
      return 'var(--multiselect-filled-background, var(--p-multiselect-filled-background, var(--form-field-filled-background)))';
    }
    if (field === 'cascadeselect') {
      return 'var(--cascadeselect-filled-background, var(--p-cascadeselect-filled-background, var(--form-field-filled-background)))';
    }
    if (field === 'treeselect') {
      return 'var(--treeselect-filled-background, var(--p-treeselect-filled-background, var(--form-field-filled-background)))';
    }
    return 'var(--inputtext-filled-background, var(--p-inputtext-filled-background, var(--form-field-filled-background)))';
  }

  private fieldBackgroundCssVar(field: 'select' | 'multiselect' | 'cascadeselect' | 'treeselect' | 'textarea' | 'inputtext'): string {
    if (this.formTheme(field) === 'filled') {
      return this.fieldFilledBackgroundCssVar(field);
    }
    if (field === 'textarea') {
      return 'var(--textarea-background, var(--p-textarea-background, var(--form-field-background)))';
    }
    if (field === 'select') {
      return 'var(--select-background, var(--p-select-background, var(--form-field-background)))';
    }
    if (field === 'multiselect') {
      return 'var(--multiselect-background, var(--p-multiselect-background, var(--form-field-background)))';
    }
    if (field === 'cascadeselect') {
      return 'var(--cascadeselect-background, var(--p-cascadeselect-background, var(--form-field-background)))';
    }
    if (field === 'treeselect') {
      return 'var(--treeselect-background, var(--p-treeselect-background, var(--form-field-background)))';
    }
    return 'var(--inputtext-background, var(--p-inputtext-background, var(--form-field-background)))';
  }

  private fieldDropdownWidthCssVar(field: 'select' | 'multiselect' | 'cascadeselect' | 'treeselect'): string {
    const prefix = field;
    return `var(--${prefix}-dropdown-width, var(--p-${prefix}-dropdown-width, var(--dimension-scale-x32, 32px)))`;
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
        ? this.fieldBackgroundCssVar('textarea')
        : this.isDropdownField(field)
          ? this.fieldBackgroundCssVar(field)
          : this.fieldBackgroundCssVar('inputtext');
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
        : this.isDropdownField(field)
          ? `calc(var(${paddingX}) + ${this.fieldDropdownWidthCssVar(field)})`
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
    field: 'inputtext' | 'password' | 'select' | 'multiselect' | 'cascadeselect' | 'treeselect' = 'inputtext',
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

    const vars: Record<string, string> = {
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
      '--p-iftalabel-input-padding-bottom': paddingY,
      '--catalog-floatlabel-in-input-min-height': minHeight,
      '--p-floatlabel-in-input-min-height': minHeight,
      '--p-iftalabel-input-min-height': minHeight,
      '--catalog-floatlabel-in-input-padding-x': paddingX,
      '--p-iftalabel-font-size': 'var(--floatlabel-active-font-size)',
      '--p-iftalabel-font-weight': 'var(--floatlabel-active-font-weight)',
      '--p-iftalabel-position-x': fieldVars['--p-floatlabel-position-x'],
    };

    if (size === 'small') {
      vars['--p-floatlabel-in-input-min-height-sm'] = minHeight;
      vars['--p-floatlabel-in-input-padding-top-sm'] = paddingTop;
      vars['--p-floatlabel-in-input-padding-bottom-sm'] = paddingBottom;
      vars['--p-iftalabel-input-min-height-sm'] = minHeight;
      vars['--p-iftalabel-input-padding-top-sm'] = paddingTop;
    } else if (size === 'large') {
      vars['--p-floatlabel-in-input-min-height-lg'] = minHeight;
      vars['--p-floatlabel-in-input-padding-top-lg'] = paddingTop;
      vars['--p-floatlabel-in-input-padding-bottom-lg'] = paddingBottom;
      vars['--p-iftalabel-input-min-height-lg'] = minHeight;
      vars['--p-iftalabel-input-padding-top-lg'] = paddingTop;
    }

    return vars;
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
    if (fieldKind === 'select' || fieldKind === 'multiselect' || fieldKind === 'cascadeselect' || fieldKind === 'treeselect') {
      return { ...this.iftaLabelInputtextHostVars(size, fieldKind), ...iconVars };
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

  inputtextFloatLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    const ix = this.inputtextIx();
    return this.floatLabelHostVarsForVariant(ix.variant, ix.floatPosition, size, 'inputtext');
  }

  inputtextIftaLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return this.iftaLabelHostVars(size, 'inputtext');
  }

  /** Sizes: Over/On elevan label; In siempre arriba. */
  inputtextFloatSizeLabelFloated(): boolean {
    return this.inputtextIsFloatLabel();
  }

  textareaFloatLabelHostVars(): Record<string, string> {
    const tx = this.textareaIx();
    return this.floatLabelHostVarsForVariant(tx.variant, tx.floatPosition, tx.size, 'textarea');
  }

  textareaIftaLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    return this.iftaLabelHostVars(size, 'textarea');
  }

  textareaFloatLabelHostVarsForSize(size: FormInteractionSize): Record<string, string> {
    const tx = this.textareaIx();
    return this.floatLabelHostVarsForVariant(tx.variant, tx.floatPosition, size, 'textarea');
  }

  /** Fila States: siempre tamaño Normal (no sigue el selector Size de Interacción). */
  floatLabelStatesHostVars(): Record<string, string> {
    const ix = this.inputtextIx();
    return this.floatLabelHostVarsForVariant(ix.variant, ix.floatPosition, ix.size, 'inputtext');
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
    if (this.isMultiselectBlock(block)) {
      return this.multiselectIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
    }
    if (this.isCascadeSelectBlock(block)) {
      return this.cascadeSelectIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
    }
    if (this.isTreeSelectBlock(block)) {
      return this.treeSelectIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
    }
    if (this.isDatepickerBlock(block)) {
      return this.datepickerIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
    }
    if (this.isTextareaBlock(block)) {
      return this.textareaIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
    }
    if (this.isInputTextBlock(block)) {
      return this.inputtextIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
    }
    if (this.isInputGroupBlock(block)) {
      return this.inputgroupIsDefault() ? this.inputDefaultStates : this.inputFloatStates;
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
      (this.isMultiselectBlock(block) && this.multiselectIsDefault()) ||
      (this.isCascadeSelectBlock(block) && this.cascadeSelectIsDefault()) ||
      (this.isTreeSelectBlock(block) && this.treeSelectIsDefault()) ||
      (this.isDatepickerBlock(block) && this.datepickerIsDefault()) ||
      (this.isTextareaBlock(block) && this.textareaIsDefault()) ||
      (this.isInputTextBlock(block) && this.inputtextIsDefault()) ||
      (this.isInputGroupBlock(block) && this.inputgroupIsDefault());
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
    if (
      this.isTextareaBlock(block) ||
      this.isInputTextBlock(block) ||
      this.isInputGroupBlock(block) ||
      this.isSelectBlock(block) ||
      this.isListboxBlock(block) ||
      this.isCascadeSelectBlock(block) ||
      this.isDatepickerBlock(block)
    ) {
      if (this.isInputTextBlock(block) && this.inputtextIsFloatOverOrOn() && (state === 'disabled' || state === 'focus')) {
        return false;
      }
      if (this.isInputTextBlock(block) && this.inputtextIsFloatIn() && (state === 'disabled' || state === 'focus')) {
        return false;
      }
      if (this.isInputGroupBlock(block) && this.inputgroupIsFloatOverOrOn() && (state === 'disabled' || state === 'focus')) {
        return false;
      }
      if (this.isInputGroupBlock(block) && this.inputgroupIsFloatIn() && (state === 'disabled' || state === 'focus')) {
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
    return (
      this.isTextareaBlock(block) ||
      this.isInputTextBlock(block) ||
      this.isInputGroupBlock(block) ||
      this.isSelectBlock(block) ||
      this.isListboxBlock(block) ||
      this.isCascadeSelectBlock(block) ||
      this.isTreeSelectBlock(block) ||
      this.isDatepickerBlock(block) ||
      this.isPasswordBlock(block) ||
      this.isInputOtpBlock(block) ||
      this.isInputNumberBlock(block)
    );
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
    if (this.isInputGroupBlock(block) && !this.inputgroupIsDefault() && state === 'filled') {
      return FORM_INPUT_STATE_FILLED_VALUE;
    }
    if (this.isInputGroupBlock(block) && this.inputgroupIsFloatOverOrOn() && (state === 'disabled' || state === 'focus')) {
      return FORM_INPUT_STATE_FILLED_VALUE;
    }
    if (this.isInputGroupBlock(block) && this.inputgroupIsFloatIn() && (state === 'disabled' || state === 'focus')) {
      return FORM_INPUT_STATE_FILLED_VALUE;
    }
    if (this.isInputGroupBlock(block) && !this.inputgroupIsDefault()) {
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
