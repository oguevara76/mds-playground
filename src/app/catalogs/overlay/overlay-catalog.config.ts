export const OVERLAY_CATALOG_TOOLTIP_INTERACTION_TEXT =
  'Usa un nombre corto y único. Solo letras, números y guiones.';

export const OVERLAY_CATALOG_TOOLTIP_POSITION_TEXT = 'Tooltip text';

export type TooltipPositionKey = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipPositionDemo {
  key: TooltipPositionKey;
  caption: string;
  text: string;
  frameClass: string;
  tooltipClass: string;
}

export type DrawerPositionKey = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerCatalogInteractionState {
  position: DrawerPositionKey;
  fullScreen: boolean;
  modal: boolean;
}

export interface DrawerPositionDemo {
  key: DrawerPositionKey;
  label: string;
  buttonIcon: string;
  caption: string;
  shapeClass: string;
}

export const OVERLAY_CATALOG_DRAWER_CONFIG_HINT = 'Modal';

export const OVERLAY_CATALOG_DRAWER_FULLSCREEN_LABEL = 'Full screen';
export const OVERLAY_CATALOG_DRAWER_FULLSCREEN_ICON = 'pi pi-window-maximize';

export const OVERLAY_CATALOG_DRAWER_POSITIONS: DrawerPositionDemo[] = [
  {
    key: 'left',
    label: 'Left',
    buttonIcon: 'pi pi-arrow-left',
    caption: 'Left',
    shapeClass: 'drawer-catalog-position-shape--left',
  },
  {
    key: 'right',
    label: 'Right',
    buttonIcon: 'pi pi-arrow-right',
    caption: 'Right',
    shapeClass: 'drawer-catalog-position-shape--right',
  },
  {
    key: 'top',
    label: 'Top',
    buttonIcon: 'pi pi-arrow-up',
    caption: 'Top',
    shapeClass: 'drawer-catalog-position-shape--top',
  },
  {
    key: 'bottom',
    label: 'Bottom',
    buttonIcon: 'pi pi-arrow-down',
    caption: 'Bottom',
    shapeClass: 'drawer-catalog-position-shape--bottom',
  },
];

export const OVERLAY_CATALOG_DRAWER_HEADER = 'Panel lateral';
export const OVERLAY_CATALOG_DRAWER_CONTENT =
  'Contenido del drawer con acciones secundarias y texto de apoyo para validar padding, tipografía y contraste del overlay.';

export const OVERLAY_CATALOG_DIALOG_PROFILE_HEADER = 'Edit Profile';
export const OVERLAY_CATALOG_DIALOG_PROFILE_OPEN_LABEL = 'Edit Profile';
export const OVERLAY_CATALOG_DIALOG_PROFILE_DISPLAY_NAME = 'Amanda Miller';
export const OVERLAY_CATALOG_DIALOG_PROFILE_DISPLAY_EMAIL = 'amanda@example.com';
export const OVERLAY_CATALOG_DIALOG_PROFILE_NAME_LABEL = 'Name';
export const OVERLAY_CATALOG_DIALOG_PROFILE_USERNAME_LABEL = 'Username';
export const OVERLAY_CATALOG_DIALOG_PROFILE_EMAIL_LABEL = 'Email';
export const OVERLAY_CATALOG_DIALOG_PROFILE_NAME_VALUE = 'Amanda Miller';
export const OVERLAY_CATALOG_DIALOG_PROFILE_USERNAME_VALUE = '@amandamiller';
export const OVERLAY_CATALOG_DIALOG_PROFILE_EMAIL_VALUE = 'amanda@example.com';
export const OVERLAY_CATALOG_DIALOG_PROFILE_AVATAR_IMAGE =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=128&h=128&q=80';
export const OVERLAY_CATALOG_DIALOG_PROFILE_CANCEL_LABEL = 'Cancel';
export const OVERLAY_CATALOG_DIALOG_PROFILE_SAVE_LABEL = 'Save Changes';

export const OVERLAY_CATALOG_DIALOG_EVENT_HEADER = 'Create Event';
export const OVERLAY_CATALOG_DIALOG_EVENT_OPEN_LABEL = 'Create Event';
export const OVERLAY_CATALOG_DIALOG_EVENT_NAME_LABEL = 'Event Name';
export const OVERLAY_CATALOG_DIALOG_EVENT_NAME_PLACEHOLDER = 'e.g. Team Standup';
export const OVERLAY_CATALOG_DIALOG_EVENT_ORGANIZER_LABEL = 'Organizer';
export const OVERLAY_CATALOG_DIALOG_EVENT_ORGANIZER_PLACEHOLDER = 'Name';
export const OVERLAY_CATALOG_DIALOG_EVENT_EMAIL_LABEL = 'Email';
export const OVERLAY_CATALOG_DIALOG_EVENT_EMAIL_PLACEHOLDER = 'organizer@example.com';
export const OVERLAY_CATALOG_DIALOG_EVENT_LOCATION_LABEL = 'Location';
export const OVERLAY_CATALOG_DIALOG_EVENT_LOCATION_PLACEHOLDER = 'Add a location or video link';
export const OVERLAY_CATALOG_DIALOG_EVENT_DESCRIPTION_LABEL = 'Description';
export const OVERLAY_CATALOG_DIALOG_EVENT_DESCRIPTION_PLACEHOLDER = 'Event details';
export const OVERLAY_CATALOG_DIALOG_EVENT_CANCEL_LABEL = 'Cancel';
export const OVERLAY_CATALOG_DIALOG_EVENT_CREATE_LABEL = 'Create Event';

export const CONFIRM_DIALOG_CATALOG_KEY = 'overlay-confirm-dialog-catalog';

export type ConfirmDialogIconKey = 'question' | 'warn' | 'error' | 'info';

export interface ConfirmDialogIconDemo {
  key: ConfirmDialogIconKey;
  caption: string;
  icon: string;
}

export const OVERLAY_CATALOG_CONFIRM_DIALOG_HEADER = 'Confirm';
export const OVERLAY_CATALOG_CONFIRM_DIALOG_MESSAGE =
  'Are you sure you want to proceed with this action?';
export const OVERLAY_CATALOG_CONFIRM_DIALOG_DELETE_LABEL = 'Delete item';
export const OVERLAY_CATALOG_CONFIRM_DIALOG_DISCARD_LABEL = 'Discard changes';
export const OVERLAY_CATALOG_CONFIRM_DIALOG_DELETE_MESSAGE =
  'This will permanently remove the item. This action cannot be undone.';
export const OVERLAY_CATALOG_CONFIRM_DIALOG_DISCARD_MESSAGE =
  'You have unsaved changes. Do you want to leave without saving?';
export const OVERLAY_CATALOG_CONFIRM_DIALOG_ACCEPT_LABEL = 'Yes';
export const OVERLAY_CATALOG_CONFIRM_DIALOG_REJECT_LABEL = 'No';

export const CONFIRM_DIALOG_ICON_DEMOS: ConfirmDialogIconDemo[] = [
  { key: 'question', caption: 'Question', icon: 'pi pi-question-circle' },
  { key: 'warn', caption: 'Warn', icon: 'pi pi-exclamation-triangle' },
  { key: 'error', caption: 'Error', icon: 'pi pi-times-circle' },
  { key: 'info', caption: 'Info', icon: 'pi pi-info-circle' },
];

export type PopoverShareRole = 'Owner' | 'Editor' | 'Viewer';

export interface PopoverShareMember {
  name: string;
  email: string;
  avatar: string;
  role: PopoverShareRole;
}

export const OVERLAY_CATALOG_POPOVER_SHARE_LABEL = 'Share';
export const OVERLAY_CATALOG_POPOVER_SHOW_LABEL = 'Show';
export const OVERLAY_CATALOG_POPOVER_SHARE_ARIA_LABEL = 'Compartir documento';
export const OVERLAY_CATALOG_POPOVER_SHOW_ARIA_LABEL = 'Mostrar popover';
export const OVERLAY_CATALOG_POPOVER_CUSTOM_CONTENT = 'CONTENT';

export const OVERLAY_CATALOG_POPOVER_SHARE_URL =
  'https://primeng.org/12323ff26t2g243g423g234gg52hy25XADXAG3';
export const OVERLAY_CATALOG_POPOVER_SHARE_TITLE = 'Share this document';
export const OVERLAY_CATALOG_POPOVER_INVITE_TITLE = 'Invite Member';
export const OVERLAY_CATALOG_POPOVER_MEMBERS_TITLE = 'Team Members';
export const OVERLAY_CATALOG_POPOVER_INVITE_LABEL = 'Invite';

export const OVERLAY_CATALOG_POPOVER_TEAM_MEMBERS: PopoverShareMember[] = [
  {
    name: 'Amy Elsner',
    email: 'amy@email.com',
    avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
    role: 'Owner',
  },
  {
    name: 'Bernardo Dominic',
    email: 'bernardo@email.com',
    avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/bernardodominic.png',
    role: 'Editor',
  },
  {
    name: 'Ioni Bowcher',
    email: 'ioni@email.com',
    avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png',
    role: 'Viewer',
  },
];

export const OVERLAY_CATALOG_TOOLTIP_POSITIONS: TooltipPositionDemo[] = [
  {
    key: 'top',
    caption: 'Top',
    text: OVERLAY_CATALOG_TOOLTIP_POSITION_TEXT,
    frameClass: 'tooltip-catalog-position-frame--top',
    tooltipClass: 'p-tooltip-top',
  },
  {
    key: 'right',
    caption: 'Right',
    text: OVERLAY_CATALOG_TOOLTIP_POSITION_TEXT,
    frameClass: 'tooltip-catalog-position-frame--right',
    tooltipClass: 'p-tooltip-right',
  },
  {
    key: 'bottom',
    caption: 'Bottom',
    text: OVERLAY_CATALOG_TOOLTIP_POSITION_TEXT,
    frameClass: 'tooltip-catalog-position-frame--bottom',
    tooltipClass: 'p-tooltip-bottom',
  },
  {
    key: 'left',
    caption: 'Left',
    text: OVERLAY_CATALOG_TOOLTIP_POSITION_TEXT,
    frameClass: 'tooltip-catalog-position-frame--left',
    tooltipClass: 'p-tooltip-left',
  },
];
