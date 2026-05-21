import { Routes } from '@angular/router';
import { ButtonCatalogComponent } from './catalogs/button/button-catalog.component';
import { AppShellComponent } from './layout/app-shell.component';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'button' },
      { path: 'button', component: ButtonCatalogComponent },
    ],
  },
  { path: '**', redirectTo: 'button' },
];
