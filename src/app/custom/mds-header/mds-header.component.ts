import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewChild,
} from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { Badge } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { OverlayBadge } from 'primeng/overlaybadge';
import { TieredMenu } from 'primeng/tieredmenu';
import type {
  MdsHeaderBadge,
  MdsHeaderTimezonePair,
} from './mds-header.types';

@Component({
  selector: 'mds-header',
  standalone: true,
  imports: [Avatar, Badge, OverlayBadge, TieredMenu],
  templateUrl: './mds-header.component.html',
  styleUrls: ['./mds-header.tokens.scss', './mds-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdsHeaderComponent {
  readonly productName = input('Product Name');
  readonly brandLogoUrl = input('indra-isotype.png');

  readonly showLocation = input(true);
  readonly locationCode = input('HEL / EFHK');
  readonly locationPlace = input('Helsinki-Vantaa');

  readonly timezones = input<MdsHeaderTimezonePair>([
    {
      timezone: 'UTC',
      time: '12:00',
      date: '2025-06-30',
      selected: false,
    },
    {
      timezone: 'UTC',
      time: '12:00',
      date: '2025-06-30',
      selected: true,
    },
  ]);

  readonly showExternalComm = input(true);
  readonly externalCommLabel = input('External Comm');
  readonly externalCommBadges = input<MdsHeaderBadge[]>([
    { value: '10', severity: 'success' },
    { value: '10', severity: 'info' },
    { value: '10', severity: 'warn' },
    { value: '10', severity: 'danger' },
  ]);

  readonly showNotifications = input(true);
  readonly notificationsCount = input(10);

  readonly userName = input('Estefania Gómez Campos');
  readonly userRole = input('Role profile');
  readonly avatarSrc = input(
    'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
  );
  readonly showProfileOverlay = input(true);

  readonly brandIcon = input('pi pi-box');
  readonly profileMenuModel = input<MenuItem[]>(DEFAULT_PROFILE_MENU);

  @ViewChild('profileMenu') profileMenu?: TieredMenu;

  toggleProfileMenu(event: Event): void {
    if (!this.showProfileOverlay()) {
      return;
    }
    this.profileMenu?.toggle(event);
  }
}

const DEFAULT_PROFILE_MENU: MenuItem[] = [
  { label: 'Profile', icon: 'pi pi-user' },
  { label: 'Payment methods', icon: 'pi pi-credit-card' },
  { label: 'Security', icon: 'pi pi-shield' },
  { label: 'Preference', icon: 'pi pi-cog' },
  { separator: true },
  { label: 'Help & support', icon: 'pi pi-question-circle' },
  { separator: true },
  { label: 'Sign out', icon: 'pi pi-sign-out' },
];
