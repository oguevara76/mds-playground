import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ThemeUploadService } from '../theme/theme-upload.service';
import { ThemeService } from '../theme/theme.service';
import { PlaygroundSidebarComponent } from './playground-sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PlaygroundSidebarComponent, Toast],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css',
})
export class AppShellComponent implements AfterViewInit {
  readonly theme = inject(ThemeService);
  readonly upload = inject(ThemeUploadService);

  /** Tras el primer paint, PrimeNG ya inyectó su tema; recolocamos el puente MDS. */
  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.upload.resyncThemeRuntime());
  }

  onThemeToggle(): void {
    this.theme.toggle();
    setTimeout(() => {
      this.upload.resyncThemeRuntime();
      this.upload.refreshInspector();
    }, 0);
  }
}
