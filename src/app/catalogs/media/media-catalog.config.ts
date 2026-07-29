export type GalleriaCatalogPosition = 'bottom' | 'top' | 'left' | 'right';

export type GalleriaCatalogVariant = 'thumbnails' | 'indicators' | 'only-image';

export interface GalleriaCatalogImage {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
  description: string;
}

export interface GalleriaInteractionState {
  variant: GalleriaCatalogVariant;
  indicatorsPosition: GalleriaCatalogPosition;
  thumbnailsPosition: GalleriaCatalogPosition;
  showNavigators: boolean;
  showCaption: boolean;
}

export const GALLERIA_CATALOG_VARIANT_OPTIONS: { label: string; value: GalleriaCatalogVariant }[] = [
  { label: 'Thumbnails', value: 'thumbnails' },
  { label: 'Indicators', value: 'indicators' },
  { label: 'Only image', value: 'only-image' },
];

export interface GalleriaCatalogVariantFlags {
  showThumbnails: boolean;
  showIndicators: boolean;
}

export function galleriaCatalogVariantFlags(variant: GalleriaCatalogVariant): GalleriaCatalogVariantFlags {
  switch (variant) {
    case 'thumbnails':
      return { showThumbnails: true, showIndicators: false };
    case 'indicators':
      return { showThumbnails: false, showIndicators: true };
    case 'only-image':
      return { showThumbnails: false, showIndicators: false };
  }
}

export const GALLERIA_CATALOG_POSITION_OPTIONS: { label: string; value: GalleriaCatalogPosition }[] = [
  { label: 'Bottom', value: 'bottom' },
  { label: 'Top', value: 'top' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
];

const GALLERIA_CDN = 'https://primefaces.org/cdn/primeng/images/galleria';

/** Imágenes demo oficiales PrimeNG (misma fuente que la documentación). */
export const GALLERIA_CATALOG_IMAGES: readonly GalleriaCatalogImage[] = [
  {
    itemImageSrc: `${GALLERIA_CDN}/galleria1.jpg`,
    thumbnailImageSrc: `${GALLERIA_CDN}/galleria1s.jpg`,
    alt: 'Atardecer en acantilados costeros',
    title: 'Title 1',
    description: 'Description for Image 1',
  },
  {
    itemImageSrc: `${GALLERIA_CDN}/galleria2.jpg`,
    thumbnailImageSrc: `${GALLERIA_CDN}/galleria2s.jpg`,
    alt: 'Barco en aguas heladas',
    title: 'Title 2',
    description: 'Description for Image 2',
  },
  {
    itemImageSrc: `${GALLERIA_CDN}/galleria3.jpg`,
    thumbnailImageSrc: `${GALLERIA_CDN}/galleria3s.jpg`,
    alt: 'Canasta de baloncesto al atardecer',
    title: 'Title 3',
    description: 'Description for Image 3',
  },
  {
    itemImageSrc: `${GALLERIA_CDN}/galleria4.jpg`,
    thumbnailImageSrc: `${GALLERIA_CDN}/galleria4s.jpg`,
    alt: 'Carretera serpenteante en cañón',
    title: 'Title 4',
    description: 'Description for Image 4',
  },
  {
    itemImageSrc: `${GALLERIA_CDN}/galleria5.jpg`,
    thumbnailImageSrc: `${GALLERIA_CDN}/galleria5s.jpg`,
    alt: 'Avenida urbana entre rascacielos',
    title: 'Title 5',
    description: 'Description for Image 5',
  },
];

export const GALLERIA_CATALOG_NUM_VISIBLE = 5;
export const GALLERIA_CATALOG_CONTAINER_STYLE: Readonly<Record<string, string>> = { 'max-width': '640px' };
export const GALLERIA_CATALOG_VERTICAL_THUMBNAIL_HEIGHT = '14rem';

export type CarouselCatalogOrientation = 'horizontal' | 'vertical';

export type CarouselCatalogStockStatus = 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';

export interface CarouselCatalogProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  inventoryStatus: CarouselCatalogStockStatus;
}

export interface CarouselInteractionState {
  orientation: CarouselCatalogOrientation;
  showNavigators: boolean;
  showIndicators: boolean;
}

export const CAROUSEL_CATALOG_ORIENTATION_OPTIONS: { label: string; value: CarouselCatalogOrientation }[] = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];

export const CAROUSEL_CATALOG_NUM_VISIBLE = 3;
export const CAROUSEL_CATALOG_VERTICAL_NUM_VISIBLE = 1;

const CAROUSEL_PRODUCT_CDN = 'https://primefaces.org/cdn/primeng/images/demo/product';

/** Productos demo alineados con el showcase oficial de PrimeNG Carousel. */
export const CAROUSEL_CATALOG_PRODUCTS: readonly CarouselCatalogProduct[] = [
  {
    id: '1000',
    name: 'Bamboo Watch',
    price: 65,
    image: `${CAROUSEL_PRODUCT_CDN}/bamboo-watch.jpg`,
    alt: 'Bamboo Watch',
    inventoryStatus: 'INSTOCK',
  },
  {
    id: '1001',
    name: 'Black Watch',
    price: 72,
    image: `${CAROUSEL_PRODUCT_CDN}/black-watch.jpg`,
    alt: 'Black Watch',
    inventoryStatus: 'INSTOCK',
  },
  {
    id: '1002',
    name: 'Blue Band',
    price: 79,
    image: `${CAROUSEL_PRODUCT_CDN}/blue-band.jpg`,
    alt: 'Blue Band',
    inventoryStatus: 'LOWSTOCK',
  },
  {
    id: '1003',
    name: 'Blue T-Shirt',
    price: 29,
    image: `${CAROUSEL_PRODUCT_CDN}/blue-t-shirt.jpg`,
    alt: 'Blue T-Shirt',
    inventoryStatus: 'INSTOCK',
  },
  {
    id: '1004',
    name: 'Bracelet',
    price: 15,
    image: `${CAROUSEL_PRODUCT_CDN}/bracelet.jpg`,
    alt: 'Bracelet',
    inventoryStatus: 'INSTOCK',
  },
];

export const CAROUSEL_CATALOG_VERTICAL_VIEWPORT_HEIGHT = '26rem';
