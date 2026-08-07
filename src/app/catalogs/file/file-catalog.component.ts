import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { SelectButton } from 'primeng/selectbutton';
import type { FileUploadHandlerEvent } from 'primeng/types/fileupload';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import {
  FILEUPLOAD_CATALOG_ACCEPT,
  FILEUPLOAD_CATALOG_CANCEL_LABEL,
  FILEUPLOAD_CATALOG_CHOOSE_LABEL,
  FILEUPLOAD_CATALOG_MAX_FILE_SIZE,
  FILEUPLOAD_CATALOG_MODE_OPTIONS,
  FILEUPLOAD_CATALOG_UPLOAD_LABEL,
  type FileUploadInteractionState,
} from './file-catalog.config';

@Component({
  selector: 'app-file-catalog',
  standalone: true,
  imports: [
    CatalogBlockHeadTitlePipe,
    CatalogPreviewFrameComponent,
    FileUpload,
    FormsModule,
    PrimeTemplate,
    SelectButton,
  ],
  templateUrl: './file-catalog.component.html',
  styleUrl: './file-catalog.component.css',
  host: { class: 'file-catalog-page' },
})
export class FileCatalogComponent {
  private readonly messageService = inject(MessageService);

  readonly modeOptions = FILEUPLOAD_CATALOG_MODE_OPTIONS;
  readonly accept = FILEUPLOAD_CATALOG_ACCEPT;
  readonly maxFileSize = FILEUPLOAD_CATALOG_MAX_FILE_SIZE;
  readonly chooseLabel = FILEUPLOAD_CATALOG_CHOOSE_LABEL;
  readonly uploadLabel = FILEUPLOAD_CATALOG_UPLOAD_LABEL;
  readonly cancelLabel = FILEUPLOAD_CATALOG_CANCEL_LABEL;

  fileuploadIx: FileUploadInteractionState = {
    mode: 'basic',
  };

  patchFileuploadIx(patch: Partial<FileUploadInteractionState>): void {
    this.fileuploadIx = { ...this.fileuploadIx, ...patch };
  }

  onCustomUpload(event: FileUploadHandlerEvent): void {
    const count = event.files?.length ?? 0;
    this.messageService.add({
      severity: 'info',
      summary: 'Upload',
      detail: count === 1 ? '1 file ready (demo, no server)' : `${count} files ready (demo, no server)`,
      life: 2500,
    });
  }
}
