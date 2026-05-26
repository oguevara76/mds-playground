import { Routes } from '@angular/router';
import { ButtonCatalogComponent } from './catalogs/button/button-catalog.component';
import { FormCatalogComponent } from './catalogs/form/form-catalog.component';
import { DataCatalogComponent } from './catalogs/data/data-catalog.component';
import { MessagesCatalogComponent } from './catalogs/messages/messages-catalog.component';
import { MiscCatalogComponent } from './catalogs/misc/misc-catalog.component';
import { OverlayCatalogComponent } from './catalogs/overlay/overlay-catalog.component';
import { PanelCatalogComponent } from './catalogs/panel/panel-catalog.component';
import { PreviewShowcaseComponent } from './catalogs/preview/preview-showcase.component';
import { AppShellComponent } from './layout/app-shell.component';
export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'button' },
      {
        path: 'tokens',
        loadComponent: () =>
          import('./tokens/tokens-view.component').then((m) => m.TokensViewComponent),
      },
      { path: 'preview', component: PreviewShowcaseComponent },
      { path: 'button', component: ButtonCatalogComponent },
      { path: 'form', component: FormCatalogComponent },
      { path: 'messages', component: MessagesCatalogComponent },
      { path: 'data', component: DataCatalogComponent },
      { path: 'panel', component: PanelCatalogComponent },
      { path: 'overlay', component: OverlayCatalogComponent },
      { path: 'misc', component: MiscCatalogComponent },
    ],
  },
  { path: '**', redirectTo: 'button' },
];
