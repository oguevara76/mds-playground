import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogCodeCopyButtonComponent } from '../../components/catalog/catalog-code-copy-button/catalog-code-copy-button.component';
import { CatalogCodeSnippetComponent } from '../../components/catalog/catalog-code-snippet/catalog-code-snippet.component';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { MdsHeaderComponent } from '../../custom/mds-header/mds-header.component';
import type { MdsHeaderTimezonePair } from '../../custom/mds-header/mds-header.types';
import {
  MDS_HEADER_CATALOG_DEFAULT_STATE,
  MDS_HEADER_CATALOG_DEMO_HEIGHT,
  MDS_HEADER_CATALOG_EXTERNAL_COMM_BADGES,
  MDS_HEADER_CATALOG_TIMEZONES,
  MDS_HEADER_CATALOG_VARIANT_OPTIONS,
  buildMdsHeaderUsageCode,
  type MdsHeaderCatalogNavItem,
  type MdsHeaderCatalogState,
  type MdsHeaderCatalogVariant,
} from './custom-catalog.config';

interface NavItemForm {
  label: FormControl<string>;
  link: FormControl<string>;
}

interface MdsHeaderConfigForm {
  variant: FormControl<MdsHeaderCatalogVariant>;
  productName: FormControl<string>;
  showLocation: FormControl<boolean>;
  showExternalComm: FormControl<boolean>;
  showNotifications: FormControl<boolean>;
  userName: FormControl<string>;
  userRole: FormControl<string>;
  showProfileOverlay: FormControl<boolean>;
  customLogoUrl: FormControl<string>;
  navItems: FormArray<FormGroup<NavItemForm>>;
}

@Component({
  selector: 'app-custom-catalog',
  standalone: true,
  imports: [
    CatalogBlockHeadTitlePipe,
    CatalogCodeCopyButtonComponent,
    CatalogCodeSnippetComponent,
    CatalogInfoBlockComponent,
    CatalogPreviewFrameComponent,
    MdsHeaderComponent,
    ReactiveFormsModule,
    SelectButton,
    ToggleSwitch,
    InputText,
    Button,
    Divider,
  ],
  templateUrl: './custom-catalog.component.html',
  styleUrl: './custom-catalog.component.css',
  host: { class: 'custom-catalog-page' },
})
export class CustomCatalogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly variantOptions = MDS_HEADER_CATALOG_VARIANT_OPTIONS;
  readonly demoHeight = MDS_HEADER_CATALOG_DEMO_HEIGHT;
  readonly externalCommBadges = MDS_HEADER_CATALOG_EXTERNAL_COMM_BADGES;
  readonly timezones = MDS_HEADER_CATALOG_TIMEZONES as unknown as MdsHeaderTimezonePair;

  readonly configForm: FormGroup<MdsHeaderConfigForm> = this.buildForm(
    MDS_HEADER_CATALOG_DEFAULT_STATE,
  );

  readonly liveState = signal<MdsHeaderCatalogState>({
    ...MDS_HEADER_CATALOG_DEFAULT_STATE,
    navItems: MDS_HEADER_CATALOG_DEFAULT_STATE.navItems.map((item) => ({ ...item })),
  });

  readonly usageCode = computed(() => buildMdsHeaderUsageCode(this.liveState()));

  constructor() {
    this.configForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.liveState.set(this.readFormState());
    });
  }

  get navItemsArray(): FormArray<FormGroup<NavItemForm>> {
    return this.configForm.controls.navItems;
  }

  addNavItem(): void {
    this.navItemsArray.push(this.createNavItemGroup({ label: 'New item', link: '#' }));
  }

  removeNavItem(index: number): void {
    if (this.navItemsArray.length <= 1) {
      return;
    }
    this.navItemsArray.removeAt(index);
  }

  trackNavItem(_: number, item: MdsHeaderCatalogNavItem): string {
    return `${item.label}-${item.link ?? ''}`;
  }

  private buildForm(state: MdsHeaderCatalogState): FormGroup<MdsHeaderConfigForm> {
    return this.fb.group({
      variant: this.fb.nonNullable.control(state.variant),
      productName: this.fb.nonNullable.control(state.productName),
      showLocation: this.fb.nonNullable.control(state.showLocation),
      showExternalComm: this.fb.nonNullable.control(state.showExternalComm),
      showNotifications: this.fb.nonNullable.control(state.showNotifications),
      userName: this.fb.nonNullable.control(state.userName),
      userRole: this.fb.nonNullable.control(state.userRole),
      showProfileOverlay: this.fb.nonNullable.control(state.showProfileOverlay),
      customLogoUrl: this.fb.nonNullable.control(state.customLogoUrl),
      navItems: this.fb.array(
        state.navItems.map((item) => this.createNavItemGroup(item)),
      ),
    });
  }

  private createNavItemGroup(item: MdsHeaderCatalogNavItem): FormGroup<NavItemForm> {
    return this.fb.group({
      label: this.fb.nonNullable.control(item.label),
      link: this.fb.nonNullable.control(item.link ?? ''),
    });
  }

  private readFormState(): MdsHeaderCatalogState {
    const raw = this.configForm.getRawValue();
    return {
      variant: raw.variant,
      productName: raw.productName,
      showLocation: raw.showLocation,
      showExternalComm: raw.showExternalComm,
      showNotifications: raw.showNotifications,
      userName: raw.userName,
      userRole: raw.userRole,
      showProfileOverlay: raw.showProfileOverlay,
      customLogoUrl: raw.customLogoUrl,
      navItems: raw.navItems.map((item) => ({
        label: item.label,
        link: item.link || undefined,
      })),
    };
  }
}
