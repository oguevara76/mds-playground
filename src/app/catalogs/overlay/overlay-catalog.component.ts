import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { Popover } from 'primeng/popover';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { CatalogStateTagComponent } from '../../components/catalog/catalog-state-tag/catalog-state-tag.component';
import {
  OVERLAY_CATALOG_CONFIRM_DIALOG_ACCEPT_LABEL,
  OVERLAY_CATALOG_CONFIRM_DIALOG_DELETE_LABEL,
  OVERLAY_CATALOG_CONFIRM_DIALOG_DELETE_MESSAGE,
  OVERLAY_CATALOG_CONFIRM_DIALOG_DISCARD_LABEL,
  OVERLAY_CATALOG_CONFIRM_DIALOG_DISCARD_MESSAGE,
  OVERLAY_CATALOG_CONFIRM_DIALOG_HEADER,
  OVERLAY_CATALOG_CONFIRM_DIALOG_MESSAGE,
  OVERLAY_CATALOG_CONFIRM_DIALOG_REJECT_LABEL,
  CONFIRM_DIALOG_CATALOG_KEY,
  OVERLAY_CATALOG_DIALOG_EVENT_CANCEL_LABEL,
  OVERLAY_CATALOG_DIALOG_EVENT_CREATE_LABEL,
  OVERLAY_CATALOG_DIALOG_EVENT_DESCRIPTION_LABEL,
  OVERLAY_CATALOG_DIALOG_EVENT_DESCRIPTION_PLACEHOLDER,
  OVERLAY_CATALOG_DIALOG_EVENT_EMAIL_LABEL,
  OVERLAY_CATALOG_DIALOG_EVENT_EMAIL_PLACEHOLDER,
  OVERLAY_CATALOG_DIALOG_EVENT_HEADER,
  OVERLAY_CATALOG_DIALOG_EVENT_LOCATION_LABEL,
  OVERLAY_CATALOG_DIALOG_EVENT_LOCATION_PLACEHOLDER,
  OVERLAY_CATALOG_DIALOG_EVENT_NAME_LABEL,
  OVERLAY_CATALOG_DIALOG_EVENT_NAME_PLACEHOLDER,
  OVERLAY_CATALOG_DIALOG_EVENT_OPEN_LABEL,
  OVERLAY_CATALOG_DIALOG_EVENT_ORGANIZER_LABEL,
  OVERLAY_CATALOG_DIALOG_EVENT_ORGANIZER_PLACEHOLDER,
  OVERLAY_CATALOG_DIALOG_PROFILE_AVATAR_IMAGE,
  OVERLAY_CATALOG_DIALOG_PROFILE_CANCEL_LABEL,
  OVERLAY_CATALOG_DIALOG_PROFILE_DISPLAY_EMAIL,
  OVERLAY_CATALOG_DIALOG_PROFILE_DISPLAY_NAME,
  OVERLAY_CATALOG_DIALOG_PROFILE_EMAIL_LABEL,
  OVERLAY_CATALOG_DIALOG_PROFILE_EMAIL_VALUE,
  OVERLAY_CATALOG_DIALOG_PROFILE_HEADER,
  OVERLAY_CATALOG_DIALOG_PROFILE_NAME_LABEL,
  OVERLAY_CATALOG_DIALOG_PROFILE_NAME_VALUE,
  OVERLAY_CATALOG_DIALOG_PROFILE_OPEN_LABEL,
  OVERLAY_CATALOG_DIALOG_PROFILE_SAVE_LABEL,
  OVERLAY_CATALOG_DIALOG_PROFILE_USERNAME_LABEL,
  OVERLAY_CATALOG_DIALOG_PROFILE_USERNAME_VALUE,
  OVERLAY_CATALOG_DRAWER_CONFIG_HINT,
  OVERLAY_CATALOG_DRAWER_CONTENT,
  OVERLAY_CATALOG_DRAWER_FULLSCREEN_ICON,
  OVERLAY_CATALOG_DRAWER_FULLSCREEN_LABEL,
  OVERLAY_CATALOG_DRAWER_HEADER,
  OVERLAY_CATALOG_DRAWER_POSITIONS,
  OVERLAY_CATALOG_POPOVER_CUSTOM_CONTENT,
  OVERLAY_CATALOG_POPOVER_INVITE_LABEL,
  OVERLAY_CATALOG_POPOVER_INVITE_TITLE,
  OVERLAY_CATALOG_POPOVER_MEMBERS_TITLE,
  OVERLAY_CATALOG_POPOVER_SHARE_ARIA_LABEL,
  OVERLAY_CATALOG_POPOVER_SHARE_LABEL,
  OVERLAY_CATALOG_POPOVER_SHARE_TITLE,
  OVERLAY_CATALOG_POPOVER_SHARE_URL,
  OVERLAY_CATALOG_POPOVER_SHOW_ARIA_LABEL,
  OVERLAY_CATALOG_POPOVER_SHOW_LABEL,
  OVERLAY_CATALOG_POPOVER_TEAM_MEMBERS,
  OVERLAY_CATALOG_TOOLTIP_INTERACTION_TEXT,
  OVERLAY_CATALOG_TOOLTIP_POSITIONS,
  type DrawerCatalogInteractionState,
  type DrawerPositionKey,
  type PopoverShareMember,
  type TooltipPositionKey,
} from './overlay-catalog.config';

@Component({
  selector: 'app-overlay-catalog',
  standalone: true,
  imports: [
    CatalogBlockHeadTitlePipe,
    CatalogInfoBlockComponent,
    CatalogPreviewFrameComponent,
    CatalogStateTagComponent,
    Tooltip,
    InputText,
    Textarea,
    Avatar,
    FormsModule,
    Dialog,
    ConfirmDialog,
    Drawer,
    Button,
    ToggleSwitch,
    Popover,
    InputGroup,
    InputGroupAddon,
  ],
  templateUrl: './overlay-catalog.component.html',
  styleUrl: './overlay-catalog.component.css',
  host: { class: 'overlay-catalog-page' },
})
export class OverlayCatalogComponent {
  private readonly confirmation = inject(ConfirmationService);

  @ViewChild('profileFooterTpl', { read: TemplateRef })
  profileFooterTpl!: TemplateRef<unknown>;

  @ViewChild('eventFooterTpl', { read: TemplateRef })
  eventFooterTpl!: TemplateRef<unknown>;

  @ViewChild('popoverShare') popoverShare!: Popover;
  @ViewChild('popoverShow') popoverShow!: Popover;

  readonly tooltipText = OVERLAY_CATALOG_TOOLTIP_INTERACTION_TEXT;
  readonly positionDemos = OVERLAY_CATALOG_TOOLTIP_POSITIONS;

  readonly profileDialogHeader = OVERLAY_CATALOG_DIALOG_PROFILE_HEADER;
  readonly profileDialogOpenLabel = OVERLAY_CATALOG_DIALOG_PROFILE_OPEN_LABEL;
  readonly profileDisplayName = OVERLAY_CATALOG_DIALOG_PROFILE_DISPLAY_NAME;
  readonly profileDisplayEmail = OVERLAY_CATALOG_DIALOG_PROFILE_DISPLAY_EMAIL;
  readonly profileNameLabel = OVERLAY_CATALOG_DIALOG_PROFILE_NAME_LABEL;
  readonly profileUsernameLabel = OVERLAY_CATALOG_DIALOG_PROFILE_USERNAME_LABEL;
  readonly profileEmailLabel = OVERLAY_CATALOG_DIALOG_PROFILE_EMAIL_LABEL;
  readonly profileAvatarImage = OVERLAY_CATALOG_DIALOG_PROFILE_AVATAR_IMAGE;
  readonly profileCancelLabel = OVERLAY_CATALOG_DIALOG_PROFILE_CANCEL_LABEL;
  readonly profileSaveLabel = OVERLAY_CATALOG_DIALOG_PROFILE_SAVE_LABEL;

  profileDialogVisible = false;
  profileName = OVERLAY_CATALOG_DIALOG_PROFILE_NAME_VALUE;
  profileUsername = OVERLAY_CATALOG_DIALOG_PROFILE_USERNAME_VALUE;
  profileEmail = OVERLAY_CATALOG_DIALOG_PROFILE_EMAIL_VALUE;

  readonly eventDialogHeader = OVERLAY_CATALOG_DIALOG_EVENT_HEADER;
  readonly eventDialogOpenLabel = OVERLAY_CATALOG_DIALOG_EVENT_OPEN_LABEL;
  readonly eventNameLabel = OVERLAY_CATALOG_DIALOG_EVENT_NAME_LABEL;
  readonly eventNamePlaceholder = OVERLAY_CATALOG_DIALOG_EVENT_NAME_PLACEHOLDER;
  readonly eventOrganizerLabel = OVERLAY_CATALOG_DIALOG_EVENT_ORGANIZER_LABEL;
  readonly eventOrganizerPlaceholder = OVERLAY_CATALOG_DIALOG_EVENT_ORGANIZER_PLACEHOLDER;
  readonly eventEmailLabel = OVERLAY_CATALOG_DIALOG_EVENT_EMAIL_LABEL;
  readonly eventEmailPlaceholder = OVERLAY_CATALOG_DIALOG_EVENT_EMAIL_PLACEHOLDER;
  readonly eventLocationLabel = OVERLAY_CATALOG_DIALOG_EVENT_LOCATION_LABEL;
  readonly eventLocationPlaceholder = OVERLAY_CATALOG_DIALOG_EVENT_LOCATION_PLACEHOLDER;
  readonly eventDescriptionLabel = OVERLAY_CATALOG_DIALOG_EVENT_DESCRIPTION_LABEL;
  readonly eventDescriptionPlaceholder = OVERLAY_CATALOG_DIALOG_EVENT_DESCRIPTION_PLACEHOLDER;
  readonly eventCancelLabel = OVERLAY_CATALOG_DIALOG_EVENT_CANCEL_LABEL;
  readonly eventCreateLabel = OVERLAY_CATALOG_DIALOG_EVENT_CREATE_LABEL;

  eventDialogVisible = false;
  eventName = '';
  eventOrganizer = '';
  eventOrganizerEmail = '';
  eventLocation = '';
  eventDescription = '';

  readonly confirmDialogKey = CONFIRM_DIALOG_CATALOG_KEY;
  readonly confirmDialogHeader = OVERLAY_CATALOG_CONFIRM_DIALOG_HEADER;
  readonly confirmDialogMessage = OVERLAY_CATALOG_CONFIRM_DIALOG_MESSAGE;
  readonly confirmDeleteLabel = OVERLAY_CATALOG_CONFIRM_DIALOG_DELETE_LABEL;
  readonly confirmDiscardLabel = OVERLAY_CATALOG_CONFIRM_DIALOG_DISCARD_LABEL;
  readonly confirmAcceptLabel = OVERLAY_CATALOG_CONFIRM_DIALOG_ACCEPT_LABEL;
  readonly confirmRejectLabel = OVERLAY_CATALOG_CONFIRM_DIALOG_REJECT_LABEL;

  readonly drawerPositionDemos = OVERLAY_CATALOG_DRAWER_POSITIONS;
  readonly drawerHeader = OVERLAY_CATALOG_DRAWER_HEADER;
  readonly drawerContent = OVERLAY_CATALOG_DRAWER_CONTENT;
  readonly drawerFullScreenLabel = OVERLAY_CATALOG_DRAWER_FULLSCREEN_LABEL;
  readonly drawerFullScreenIcon = OVERLAY_CATALOG_DRAWER_FULLSCREEN_ICON;
  readonly drawerConfigHint = OVERLAY_CATALOG_DRAWER_CONFIG_HINT;

  readonly popoverShareLabel = OVERLAY_CATALOG_POPOVER_SHARE_LABEL;
  readonly popoverShowLabel = OVERLAY_CATALOG_POPOVER_SHOW_LABEL;
  readonly popoverShareAriaLabel = OVERLAY_CATALOG_POPOVER_SHARE_ARIA_LABEL;
  readonly popoverShowAriaLabel = OVERLAY_CATALOG_POPOVER_SHOW_ARIA_LABEL;
  readonly popoverCustomContent = OVERLAY_CATALOG_POPOVER_CUSTOM_CONTENT;
  readonly popoverShareTitle = OVERLAY_CATALOG_POPOVER_SHARE_TITLE;
  readonly popoverShareUrl = OVERLAY_CATALOG_POPOVER_SHARE_URL;
  readonly popoverInviteTitle = OVERLAY_CATALOG_POPOVER_INVITE_TITLE;
  readonly popoverInviteLabel = OVERLAY_CATALOG_POPOVER_INVITE_LABEL;
  readonly popoverMembersTitle = OVERLAY_CATALOG_POPOVER_MEMBERS_TITLE;
  readonly popoverTeamMembers = OVERLAY_CATALOG_POPOVER_TEAM_MEMBERS;

  projectName = '';

  readonly drawerIx = signal<DrawerCatalogInteractionState>({
    position: 'left',
    fullScreen: false,
    modal: true,
  });

  drawerVisible = false;

  trackPosition(_: number, demo: { key: TooltipPositionKey }): TooltipPositionKey {
    return demo.key;
  }

  trackDrawerPosition(_: number, demo: { key: DrawerPositionKey }): DrawerPositionKey {
    return demo.key;
  }

  trackPopoverMember(_: number, member: PopoverShareMember): string {
    return member.email;
  }

  toggleSharePopover(event: Event): void {
    this.popoverShare.toggle(event);
  }

  toggleShowPopover(event: Event): void {
    this.popoverShow.toggle(event);
  }

  /** Fuerza el popover Show arriba del botón (paridad visual con Share). */
  alignShowPopoverAbove(): void {
    requestAnimationFrame(() => {
      const popover = this.popoverShow;
      const container = popover?.container;
      const target = popover?.target as HTMLElement | undefined;
      if (!popover?.overlayVisible || !container || !target) return;

      container.classList.add('p-popover-flipped');
      container.setAttribute('data-p-popover-flipped', 'true');

      const targetRect = target.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const containerWidth = container.offsetWidth;
      const gutter = this.readPopoverGutter(container);

      const top = window.scrollY + targetRect.top - containerHeight - gutter;
      let left = window.scrollX + targetRect.left + (targetRect.width - containerWidth) / 2;

      const viewportPadding = 8;
      const maxLeft = window.scrollX + document.documentElement.clientWidth - containerWidth - viewportPadding;
      left = Math.max(window.scrollX + viewportPadding, Math.min(left, maxLeft));

      container.style.top = `${top}px`;
      container.style.left = `${left}px`;

      const borderRadius = Number.parseFloat(getComputedStyle(container).borderRadius || '0') * 2;
      const arrowLeft =
        targetRect.left + targetRect.width / 2 - (left - window.scrollX) - borderRadius;
      container.style.setProperty('--p-popover-arrow-left', `${Math.max(0, arrowLeft)}px`);
    });
  }

  private readPopoverGutter(container: HTMLElement): number {
    const fromMargin = Number.parseFloat(getComputedStyle(container).marginBottom || '');
    if (Number.isFinite(fromMargin) && fromMargin > 0) return fromMargin;

    const root = document.documentElement;
    const raw =
      getComputedStyle(root).getPropertyValue('--p-popover-gutter') ||
      getComputedStyle(root).getPropertyValue('--popover-gutter');
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 8;
  }

  patchDrawerIx(patch: Partial<DrawerCatalogInteractionState>): void {
    this.drawerIx.update((state) => ({ ...state, ...patch }));
  }

  openDrawer(position: DrawerPositionKey): void {
    this.patchDrawerIx({ position, fullScreen: false });
    this.drawerVisible = true;
  }

  openDrawerFullScreen(): void {
    this.patchDrawerIx({ fullScreen: true });
    this.drawerVisible = true;
  }

  closeProfileDialog(): void {
    this.profileDialogVisible = false;
  }

  saveProfileDialog(): void {
    this.profileDialogVisible = false;
  }

  closeEventDialog(): void {
    this.eventDialogVisible = false;
  }

  createEventDialog(): void {
    this.eventDialogVisible = false;
  }

  confirmDelete(): void {
    this.confirmation.confirm({
      key: this.confirmDialogKey,
      header: this.confirmDialogHeader,
      message: OVERLAY_CATALOG_CONFIRM_DIALOG_DELETE_MESSAGE,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.confirmAcceptLabel,
      rejectLabel: this.confirmRejectLabel,
      accept: () => {},
      reject: () => {},
    });
  }

  confirmDiscard(): void {
    this.confirmation.confirm({
      key: this.confirmDialogKey,
      header: this.confirmDialogHeader,
      message: OVERLAY_CATALOG_CONFIRM_DIALOG_DISCARD_MESSAGE,
      icon: 'pi pi-question-circle',
      acceptLabel: this.confirmAcceptLabel,
      rejectLabel: this.confirmRejectLabel,
      accept: () => {},
      reject: () => {},
    });
  }
}
