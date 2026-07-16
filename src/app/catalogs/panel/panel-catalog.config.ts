// ─── Panel (p-panel) ─────────────────────────────────────────────────────────

export interface PanelCatalogLineItem {
  label: string;
  value: string;
}

export const PANEL_CATALOG_LINE_ITEMS: PanelCatalogLineItem[] = [
  { label: 'Wireless Headphones', value: '$79.00' },
  { label: 'Phone Case', value: '$15.00' },
  { label: 'Shipping', value: '$5.99' },
];

export const PANEL_CATALOG_TOTAL = '$99.99';

/** Texto completo del ejemplo Template (primeng.dev/panel#template). */
export const PANEL_CATALOG_TEMPLATE_BODY =
  'Product designer focused on accessible interfaces, scalable design systems and modern frontend workflows. Passionate about creating intuitive user experiences that balance usability, consistency and performance across platforms. Currently exploring AI-assisted UI tooling, component architecture and developer experience improvements to streamline design-to-development collaboration and build more maintainable products.';

export const PANEL_CATALOG_TEMPLATE_FOOTER = 'Updated 2 hours ago';

/** Avatar Amy Elsner — paridad primeng.dev/panel#template */
export const PANEL_CATALOG_TEMPLATE_AVATAR_IMAGE =
  'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png';

export type PanelCatalogExampleKey = 'basic' | 'toggleable' | 'template';

export interface PanelInteractionState {
  example: PanelCatalogExampleKey;
}

export const PANEL_EXAMPLE_OPTIONS: { label: string; value: PanelCatalogExampleKey }[] = [
  { label: 'Basic', value: 'basic' },
  { label: 'Toggleable', value: 'toggleable' },
  { label: 'Template', value: 'template' },
];

/** Altura fija del preview Panel — calibrada al ejemplo Template (el más alto). */
export const PANEL_CATALOG_DEMO_HEIGHT = '292px';

// ─── Accordion ───────────────────────────────────────────────────────────────

export interface AccordionCatalogPanel {
  value: string;
  header: string;
  content: string;
}

export const ACCORDION_CATALOG_PANELS: AccordionCatalogPanel[] = [
  {
    value: '0',
    header: 'General',
    content:
      'Resumen del expediente, estado actual y acciones rápidas para el equipo.',
  },
  {
    value: '1',
    header: 'Detalles',
    content:
      'Datos de contacto, dirección fiscal y preferencias de notificación del titular.',
  },
  {
    value: '2',
    header: 'Historial',
    content:
      'Registro de cambios, aprobaciones y eventos sincronizados en los últimos 30 días.',
  },
];

export type AccordionTemplateIconTone = 'amber' | 'blue' | 'green';

export interface AccordionTemplatePanel {
  value: string;
  header: string;
  content: string;
  icon: string;
  iconTone: AccordionTemplateIconTone;
}

/** Paneles del ejemplo Template (paridad con primeng.dev/accordion#template). */
export const ACCORDION_TEMPLATE_PANELS: AccordionTemplatePanel[] = [
  {
    value: '0',
    header: 'What is this service about?',
    content:
      'This service helps you manage your projects more efficiently by offering real-time collaboration, task tracking, and powerful analytics. Whether you\'re working solo or in a team, it\'s built to scale with your needs.',
    icon: 'pi-question-circle',
    iconTone: 'amber',
  },
  {
    value: '1',
    header: 'Is my data secure?',
    content:
      'Yes. We use end-to-end encryption and follow industry best practices to ensure your data is protected. Your information is stored on secure servers and regularly backed up.',
    icon: 'pi-lock',
    iconTone: 'blue',
  },
  {
    value: '2',
    header: 'Can I upgrade or downgrade my plan later?',
    content:
      'Absolutely. You can change your subscription plan at any time from your account settings. Changes take effect immediately, and any billing adjustments are handled automatically.',
    icon: 'pi-credit-card',
    iconTone: 'green',
  },
];

export type AccordionCatalogStateKey = 'active' | 'inactive' | 'disabled';

export interface AccordionCatalogStateDemo {
  key: AccordionCatalogStateKey;
  caption: string;
}

export const ACCORDION_CATALOG_STATE_DEMOS: AccordionCatalogStateDemo[] = [
  { key: 'active', caption: 'Active' },
  { key: 'inactive', caption: 'Inactive' },
  { key: 'disabled', caption: 'Disabled' },
];

export type AccordionCatalogExampleKey = 'basic' | 'multiple' | 'indicator' | 'template';

export interface AccordionInteractionState {
  example: AccordionCatalogExampleKey;
}

export const ACCORDION_EXAMPLE_OPTIONS: { label: string; value: AccordionCatalogExampleKey }[] = [
  { label: 'Basic', value: 'basic' },
  { label: 'Multiple', value: 'multiple' },
  { label: 'Indicator (open/close)', value: 'indicator' },
  { label: 'Template', value: 'template' },
];

export interface PanelCatalogTab {
  value: string;
  label: string;
  leftIcon: string;
  rightIcon: string;
  content: string;
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export type DividerBorderType = 'solid' | 'dashed' | 'dotted';
export type DividerAlignOption = 'left' | 'center' | 'right';

export interface DividerInteractionState {
  type: DividerBorderType;
  align: DividerAlignOption;
  showLabel: boolean;
}

export const DIVIDER_BORDER_TYPE_OPTIONS: { label: string; value: DividerBorderType }[] = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
];

export const DIVIDER_ALIGN_OPTIONS: { label: string; value: DividerAlignOption }[] = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

export type DividerStateKey = 'default' | 'labeled' | 'icon';

export interface DividerStateDemo {
  key: DividerStateKey;
  caption: string;
  label?: string;
  icon?: string;
}

export const DIVIDER_STATE_DEMOS: DividerStateDemo[] = [
  { key: 'default', caption: 'Default' },
  { key: 'labeled', caption: 'Labeled', label: 'Sección' },
  { key: 'icon', caption: 'With icon', icon: 'pi pi-star' },
];

export const PANEL_CATALOG_TABS: PanelCatalogTab[] = [
  {
    value: '0',
    label: 'General',
    leftIcon: 'pi pi-home',
    rightIcon: 'pi pi-angle-right',
    content:
      'Resumen del expediente, estado actual y acciones rápidas para el equipo.',
  },
  {
    value: '1',
    label: 'Detalles',
    leftIcon: 'pi pi-file',
    rightIcon: 'pi pi-angle-right',
    content:
      'Datos de contacto, dirección fiscal y preferencias de notificación del titular.',
  },
  {
    value: '2',
    label: 'Historial',
    leftIcon: 'pi pi-history',
    rightIcon: 'pi pi-angle-right',
    content:
      'Registro de cambios, aprobaciones y eventos sincronizados en los últimos 30 días.',
  },
];

export type PanelCatalogTabStateKey = 'active' | 'inactive';

export interface PanelCatalogTabStateDemo {
  key: PanelCatalogTabStateKey;
  caption: string;
}

export const PANEL_CATALOG_TAB_STATE_DEMOS: PanelCatalogTabStateDemo[] = [
  { key: 'active', caption: 'Active' },
  { key: 'inactive', caption: 'Inactive' },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

export type CardCatalogExampleKey = 'basic' | 'form' | 'advanced';

export interface CardInteractionState {
  example: CardCatalogExampleKey;
}

export const CARD_EXAMPLE_OPTIONS: { label: string; value: CardCatalogExampleKey }[] = [
  { label: 'Basic', value: 'basic' },
  { label: 'With Form', value: 'form' },
  { label: 'Advanced', value: 'advanced' },
];

/** Altura fija del preview Card — calibrada al ejemplo Advanced (el más alto). */
export const CARD_CATALOG_DEMO_HEIGHT = '440px';

// ─── Stepper ──────────────────────────────────────────────────────────────────

export type StepperCatalogVariant = 'horizontal' | 'vertical' | 'template';

export type StepperCatalogStepValue = 1 | 2 | 3;

export interface StepperCatalogBasicStep {
  value: StepperCatalogStepValue;
  header: string;
  content: string;
}

/** Pasos Basic / Vertical — paridad primeng.dev/stepper#horizontal */
export const STEPPER_CATALOG_BASIC_STEPS: StepperCatalogBasicStep[] = [
  { value: 1, header: 'Header I', content: 'Content I' },
  { value: 2, header: 'Header II', content: 'Content II' },
  { value: 3, header: 'Header III', content: 'Content III' },
];

export interface StepperCatalogTemplateStep {
  value: StepperCatalogStepValue;
  icon: string;
}

export const STEPPER_CATALOG_TEMPLATE_STEPS: StepperCatalogTemplateStep[] = [
  { value: 1, icon: 'pi pi-user' },
  { value: 2, icon: 'pi pi-star' },
  { value: 3, icon: 'pi pi-id-card' },
];

export const STEPPER_CATALOG_TEMPLATE_INTERESTS = [
  'Nature',
  'Art',
  'Music',
  'Design',
  'Photography',
  'Movies',
  'Sports',
  'Gaming',
  'Traveling',
  'Dancing',
] as const;

export type StepperCatalogTemplateInterest = (typeof STEPPER_CATALOG_TEMPLATE_INTERESTS)[number];

/** Ilustración del paso final — primeng.dev/stepper#template */
export const STEPPER_CATALOG_TEMPLATE_SUCCESS_IMAGE =
  'https://primefaces.org/cdn/primeng/images/stepper/content.svg';

/** Altura fija del preview Stepper — calibrada al variant Template (intereses, el más alto). */
export const STEPPER_CATALOG_DEMO_HEIGHT = '440px';

/** Ancho del variant Template — paridad primeng.dev/stepper#template (`basis-[40rem]`). */
export const STEPPER_CATALOG_TEMPLATE_WIDTH = '40rem';

export interface StepperInteractionState {
  variant: StepperCatalogVariant;
  stepsOnly: boolean;
}

export const STEPPER_VARIANT_OPTIONS: {
  label: string;
  value: StepperCatalogVariant;
}[] = [
  { label: 'Horizontal position', value: 'horizontal' },
  { label: 'Vertical position', value: 'vertical' },
  { label: 'Template', value: 'template' },
];

export type StepperCatalogStateKey = 'default' | 'active' | 'disabled';

export interface StepperCatalogStateDemo {
  key: StepperCatalogStateKey;
  caption: string;
}

export const STEPPER_CATALOG_STATE_DEMOS: StepperCatalogStateDemo[] = [
  { key: 'default', caption: 'Default' },
  { key: 'active', caption: 'Active' },
  { key: 'disabled', caption: 'Disabled' },
];
