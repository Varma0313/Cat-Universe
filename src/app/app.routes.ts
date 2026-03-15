import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page/dashboard-page').then(m => m.DashboardPage),
  },
  {
    path: 'cats',
    loadComponent: () =>
      import('./features/cats/pages/cats-page/cats-page').then(m => m.CatsPage),
  },
  { path: '**', redirectTo: '' },
];
