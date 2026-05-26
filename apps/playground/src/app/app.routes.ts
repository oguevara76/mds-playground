import { Routes } from '@angular/router';
import { ButtonCatalogComponent } from './catalogs/button/button-catalog.component';
import { FormCatalogComponent } from './catalogs/form/form-catalog.component';
import { DataCatalogComponent } from './catalogs/data/data-catalog.component';
import { MessagesCatalogComponent } from './catalogs/messages/messages-catalog.component';
import { PanelCatalogComponent } from './catalogs/panel/panel-catalog.component';
import { AppShellComponent } from './layout/app-shell.component';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'button' },
      { path: 'button', component: ButtonCatalogComponent },
      { path: 'form', component: FormCatalogComponent },
      { path: 'messages', component: MessagesCatalogComponent },
      { path: 'data', component: DataCatalogComponent },
      { path: 'panel', component: PanelCatalogComponent },
    ],
  },
  { path: '**', redirectTo: 'button' },
];
