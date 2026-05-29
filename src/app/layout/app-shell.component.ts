import { AfterViewInit, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { Toast } from 'primeng/toast';
import { ThemeUploadService } from '../theme/theme-upload.service';
import { ThemeService } from '../theme/theme.service';
import { PlaygroundComponentSearchComponent } from './playground-component-search.component';
import { PlaygroundSidebarComponent } from './playground-sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    PlaygroundSidebarComponent,
    PlaygroundComponentSearchComponent,
    Toast,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css',
})
export class AppShellComponent implements AfterViewInit {
  private readonly router = inject(Router);
  readonly theme = inject(ThemeService);
  readonly upload = inject(ThemeUploadService);

  private readonly navTick = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly isTokensView = computed(() => (this.navTick() ?? '').includes('/tokens'));

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
