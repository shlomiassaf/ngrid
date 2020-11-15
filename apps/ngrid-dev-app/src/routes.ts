import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'ngrid-column-width',
    pathMatch: 'full',
    loadChildren: () => import('./ngrid/column-width/column-width.module').then(m => m.ColumnWidthExampleModule),
    data: { name: 'Column Width' },
  }
];
