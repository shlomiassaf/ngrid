import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'dev-app-smoke-tests',
    pathMatch: 'full',
    loadChildren: () => import('./smoke-tests/smoke-tests.module').then(m => m.SmokeTestsExampleModule),
    data: { name: 'Smoke Tests' },
  },
  {
    path: 'ngrid-column-width',
    pathMatch: 'full',
    loadChildren: () => import('./ngrid/column-width/column-width.module').then(m => m.ColumnWidthExampleModule),
    data: { name: 'Column Width' },
  }
];
