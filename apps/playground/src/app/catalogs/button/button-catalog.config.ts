export type ButtonSeverity =
  | 'primary'
  | 'secondary'
  | 'contrast'
  | 'danger'
  | 'success'
  | 'warn'
  | 'info'
  | 'help';

export type ButtonBlockKind = 'standard' | 'icon' | 'text';

export type ButtonDemoState = 'default' | 'hover' | 'active' | 'disabled';

export interface ButtonVariantSpec {
  label: string;
  outlined?: boolean;
  rounded?: boolean;
  raised?: boolean;
}

export interface ButtonBlockConfig {
  kind: ButtonBlockKind;
  title: string;
  interactionLabel: string;
  showIconLeft: boolean;
  showIconRight: boolean;
}

/** Severidades del design system mostradas en Interaction. */
export const BUTTON_DS_SEVERITIES: { label: string; value: ButtonSeverity }[] = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Danger', value: 'danger' },
  { label: 'Contrast', value: 'contrast' },
];

export const BUTTON_SEVERITY_OPTIONS: { label: string; value: ButtonSeverity }[] = [
  ...BUTTON_DS_SEVERITIES,
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warn' },
  { label: 'Info', value: 'info' },
  { label: 'Help', value: 'help' },
];

export const BUTTON_VARIANT_SPECS: ButtonVariantSpec[] = [
  { label: 'Default' },
  { label: 'Outlined', outlined: true },
  { label: 'Rounded', rounded: true },
  { label: 'Default raised', raised: true },
  { label: 'Outlined raised', outlined: true, raised: true },
  { label: 'Default raised rounded', raised: true, rounded: true },
  { label: 'Outlined raised rounded', outlined: true, raised: true, rounded: true },
];

export const BUTTON_DEMO_STATES: { key: ButtonDemoState; caption: string }[] = [
  { key: 'default', caption: 'Default' },
  { key: 'hover', caption: 'Hover' },
  { key: 'active', caption: 'Active' },
  { key: 'disabled', caption: 'Disabled' },
];

export type ButtonInteractionSize = 'small' | 'normal' | 'large';

export const BUTTON_SIZE_OPTIONS: { key: ButtonInteractionSize; caption: string; size?: 'small' | 'large' }[] = [
  { key: 'small', caption: 'Small', size: 'small' },
  { key: 'normal', caption: 'Normal' },
  { key: 'large', caption: 'Large', size: 'large' },
];

/** Opciones del select en el popover de configuración. */
export const BUTTON_SIZE_SELECT_OPTIONS: { label: string; value: ButtonInteractionSize }[] =
  BUTTON_SIZE_OPTIONS.map((o) => ({ label: o.caption, value: o.key }));

export const BUTTON_BLOCKS: ButtonBlockConfig[] = [
  {
    kind: 'standard',
    title: 'Button',
    interactionLabel: 'Primary',
    showIconLeft: true,
    showIconRight: true,
  },
  {
    kind: 'icon',
    title: 'Button icon-only',
    interactionLabel: 'Primary',
    showIconLeft: false,
    showIconRight: false,
  },
  {
    kind: 'text',
    title: 'Button-text',
    interactionLabel: 'Primary',
    showIconLeft: true,
    showIconRight: true,
  },
];
