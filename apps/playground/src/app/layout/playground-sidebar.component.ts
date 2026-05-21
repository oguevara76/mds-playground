import { Component, inject } from '@angular/core';
import { ThemeUploadService } from '../theme/theme-upload.service';

@Component({
  selector: 'app-playground-sidebar',
  standalone: true,
  templateUrl: './playground-sidebar.component.html',
  styleUrl: './playground-sidebar.component.css',
})
export class PlaygroundSidebarComponent {
  readonly upload = inject(ThemeUploadService);

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      void this.upload.processFiles(input.files);
      input.value = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement)?.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    (event.currentTarget as HTMLElement)?.classList.remove('drag-over');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement)?.classList.remove('drag-over');
    const files = event.dataTransfer?.files;
    if (files?.length) void this.upload.processFiles(files);
  }
}
