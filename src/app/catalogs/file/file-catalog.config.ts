export type FileUploadCatalogMode = 'basic' | 'advanced';

export interface FileUploadInteractionState {
  mode: FileUploadCatalogMode;
}

export const FILEUPLOAD_CATALOG_MODE_OPTIONS: {
  label: string;
  value: FileUploadCatalogMode;
}[] = [
  { label: 'Basic', value: 'basic' },
  { label: 'Advanced', value: 'advanced' },
];

export const FILEUPLOAD_CATALOG_ACCEPT = 'image/*';
export const FILEUPLOAD_CATALOG_MAX_FILE_SIZE = 1_000_000;
export const FILEUPLOAD_CATALOG_CHOOSE_LABEL = 'Choose';
export const FILEUPLOAD_CATALOG_UPLOAD_LABEL = 'Upload';
export const FILEUPLOAD_CATALOG_CANCEL_LABEL = 'Cancel';
