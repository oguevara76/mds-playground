import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { CarouselModule } from 'primeng/carousel';
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
  CAROUSEL_CATALOG_NUM_VISIBLE,
  CAROUSEL_CATALOG_ORIENTATION_OPTIONS,
  CAROUSEL_CATALOG_PRODUCTS,
  CAROUSEL_CATALOG_VERTICAL_NUM_VISIBLE,
  CAROUSEL_CATALOG_VERTICAL_VIEWPORT_HEIGHT,
  type CarouselCatalogProduct,
  type CarouselCatalogStockStatus,
  type CarouselInteractionState,
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
    Button,
    Divider,
    FormsModule,
    NgTemplateOutlet,
    CarouselModule,
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
  readonly carouselProducts = [...CAROUSEL_CATALOG_PRODUCTS];
  readonly carouselOrientationOptions = CAROUSEL_CATALOG_ORIENTATION_OPTIONS;
  readonly carouselHorizontalNumVisible = CAROUSEL_CATALOG_NUM_VISIBLE;
  readonly carouselVerticalNumVisible = CAROUSEL_CATALOG_VERTICAL_NUM_VISIBLE;
  readonly carouselVerticalViewPortHeight = CAROUSEL_CATALOG_VERTICAL_VIEWPORT_HEIGHT;

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

  carouselIx: CarouselInteractionState = {
    orientation: 'horizontal',
    showNavigators: true,
    showIndicators: true,
  };

  patchCarouselIx(patch: Partial<CarouselInteractionState>): void {
    this.carouselIx = { ...this.carouselIx, ...patch };
  }

  formatCarouselPrice(product: CarouselCatalogProduct): string {
    return `$${product.price}`;
  }

  carouselStockBadgeClass(status: CarouselCatalogStockStatus): string {
    switch (status) {
      case 'INSTOCK':
        return 'carousel-catalog-product-badge--instock';
      case 'LOWSTOCK':
        return 'carousel-catalog-product-badge--lowstock';
      case 'OUTOFSTOCK':
        return 'carousel-catalog-product-badge--outofstock';
    }
  }
}
