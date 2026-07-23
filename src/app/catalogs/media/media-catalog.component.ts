import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { Divider } from 'primeng/divider';
import { GalleriaModule } from 'primeng/galleria';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import {
  GALLERIA_CATALOG_CONTAINER_STYLE,
  GALLERIA_CATALOG_IMAGES,
  GALLERIA_CATALOG_NUM_VISIBLE,
  GALLERIA_CATALOG_POSITION_OPTIONS,
  GALLERIA_CATALOG_VARIANT_OPTIONS,
  GALLERIA_CATALOG_VERTICAL_THUMBNAIL_HEIGHT,
  galleriaCatalogVariantFlags,
  type GalleriaCatalogImage,
  type GalleriaCatalogVariantFlags,
  type GalleriaInteractionState,
} from './media-catalog.config';

@Component({
  selector: 'app-media-catalog',
  standalone: true,
  imports: [
    CatalogBlockHeadTitlePipe,
    CatalogPreviewFrameComponent,
    Divider,
    FormsModule,
    GalleriaModule,
    PrimeTemplate,
    Select,
    ToggleSwitch,
  ],
  templateUrl: './media-catalog.component.html',
  styleUrl: './media-catalog.component.css',
  host: { class: 'media-catalog-page' },
})
export class MediaCatalogComponent {
  readonly images = [...GALLERIA_CATALOG_IMAGES];
  readonly variantOptions = GALLERIA_CATALOG_VARIANT_OPTIONS;
  readonly positionOptions = GALLERIA_CATALOG_POSITION_OPTIONS;
  readonly numVisible = GALLERIA_CATALOG_NUM_VISIBLE;
  readonly containerStyle = GALLERIA_CATALOG_CONTAINER_STYLE;
  readonly verticalThumbnailViewPortHeight = GALLERIA_CATALOG_VERTICAL_THUMBNAIL_HEIGHT;

  activeIndex = 0;

  galleriaIx: GalleriaInteractionState = {
    variant: 'thumbnails',
    indicatorsPosition: 'bottom',
    thumbnailsPosition: 'bottom',
    showNavigators: true,
    showCaption: true,
  };

  get galleriaFlags(): GalleriaCatalogVariantFlags {
    return galleriaCatalogVariantFlags(this.galleriaIx.variant);
  }

  get activeCaption(): GalleriaCatalogImage {
    return this.images[this.activeIndex] ?? this.images[0];
  }

  onGalleriaActiveIndexChange(index: number): void {
    this.activeIndex = index;
  }

  patchGalleriaIx(patch: Partial<GalleriaInteractionState>): void {
    this.galleriaIx = { ...this.galleriaIx, ...patch };
  }
}
