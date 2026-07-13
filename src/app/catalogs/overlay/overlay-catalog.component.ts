import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { CatalogStateTagComponent } from '../../components/catalog/catalog-state-tag/catalog-state-tag.component';
import {
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
  OVERLAY_CATALOG_TOOLTIP_INTERACTION_TEXT,
  OVERLAY_CATALOG_TOOLTIP_POSITIONS,
  type DrawerCatalogInteractionState,
  type DrawerPositionKey,
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
    Drawer,
    Button,
    ToggleSwitch,
  ],
  templateUrl: './overlay-catalog.component.html',
  styleUrl: './overlay-catalog.component.css',
  host: { class: 'overlay-catalog-page' },
})
export class OverlayCatalogComponent {
  @ViewChild('profileFooterTpl', { read: TemplateRef })
  profileFooterTpl!: TemplateRef<unknown>;

  @ViewChild('eventFooterTpl', { read: TemplateRef })
  eventFooterTpl!: TemplateRef<unknown>;

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

  readonly drawerPositionDemos = OVERLAY_CATALOG_DRAWER_POSITIONS;
  readonly drawerHeader = OVERLAY_CATALOG_DRAWER_HEADER;
  readonly drawerContent = OVERLAY_CATALOG_DRAWER_CONTENT;
  readonly drawerFullScreenLabel = OVERLAY_CATALOG_DRAWER_FULLSCREEN_LABEL;
  readonly drawerFullScreenIcon = OVERLAY_CATALOG_DRAWER_FULLSCREEN_ICON;
  readonly drawerConfigHint = OVERLAY_CATALOG_DRAWER_CONFIG_HINT;

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
}
