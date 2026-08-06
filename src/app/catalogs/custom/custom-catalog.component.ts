import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogCodeCopyButtonComponent } from '../../components/catalog/catalog-code-copy-button/catalog-code-copy-button.component';
import { CatalogCodeSnippetComponent } from '../../components/catalog/catalog-code-snippet/catalog-code-snippet.component';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { MdsFooterComponent } from '../../custom/mds-footer/mds-footer.component';
import { MdsHeaderComponent } from '../../custom/mds-header/mds-header.component';
import type { MdsHeaderTimezonePair } from '../../custom/mds-header/mds-header.types';
import {
  MDS_FOOTER_CATALOG_DEMO_HEIGHT,
  MDS_HEADER_CATALOG_DEFAULT_STATE,
  MDS_HEADER_CATALOG_DEMO_HEIGHT,
  MDS_HEADER_CATALOG_EXTERNAL_COMM_BADGES,
  MDS_HEADER_CATALOG_TIMEZONES,
  buildMdsFooterUsageCode,
  buildMdsHeaderUsageCode,
  type MdsHeaderCatalogState,
} from './custom-catalog.config';

interface MdsHeaderConfigForm {
  productName: FormControl<string>;
  showLocation: FormControl<boolean>;
  showExternalComm: FormControl<boolean>;
  showNotifications: FormControl<boolean>;
  userName: FormControl<string>;
  userRole: FormControl<string>;
  showProfileOverlay: FormControl<boolean>;
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
    MdsFooterComponent,
    MdsHeaderComponent,
    ReactiveFormsModule,
    ToggleSwitch,
    InputText,
    Divider,
  ],
  templateUrl: './custom-catalog.component.html',
  styleUrl: './custom-catalog.component.css',
  host: { class: 'custom-catalog-page' },
})
export class CustomCatalogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly demoHeight = MDS_HEADER_CATALOG_DEMO_HEIGHT;
  readonly footerDemoHeight = MDS_FOOTER_CATALOG_DEMO_HEIGHT;
  readonly externalCommBadges = MDS_HEADER_CATALOG_EXTERNAL_COMM_BADGES;
  readonly timezones = MDS_HEADER_CATALOG_TIMEZONES as unknown as MdsHeaderTimezonePair;
  readonly configForm: FormGroup<MdsHeaderConfigForm> = this.buildHeaderForm(
    MDS_HEADER_CATALOG_DEFAULT_STATE,
  );

  readonly liveState = signal<MdsHeaderCatalogState>({
    ...MDS_HEADER_CATALOG_DEFAULT_STATE,
  });

  readonly usageCode = computed(() => buildMdsHeaderUsageCode(this.liveState()));
  readonly footerUsageCode = buildMdsFooterUsageCode();

  constructor() {
    this.configForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.liveState.set(this.readHeaderFormState());
    });
  }

  private buildHeaderForm(state: MdsHeaderCatalogState): FormGroup<MdsHeaderConfigForm> {
    return this.fb.group({
      productName: this.fb.nonNullable.control(state.productName),
      showLocation: this.fb.nonNullable.control(state.showLocation),
      showExternalComm: this.fb.nonNullable.control(state.showExternalComm),
      showNotifications: this.fb.nonNullable.control(state.showNotifications),
      userName: this.fb.nonNullable.control(state.userName),
      userRole: this.fb.nonNullable.control(state.userRole),
      showProfileOverlay: this.fb.nonNullable.control(state.showProfileOverlay),
    });
  }

  private readHeaderFormState(): MdsHeaderCatalogState {
    return this.configForm.getRawValue();
  }
}
