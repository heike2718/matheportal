import { loadRemoteModule } from '@angular-architects/native-federation';
import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { minikaenguruAdminGuard } from './authorization/minikaenguru-admin.guard';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'minikaenguru-anwendung',
        loadChildren: () => loadRemoteModule('minikaenguru-anwendung-ui', './Routes').then(m => m.remoteRoutes),
    },
    {
        path: 'raetselbaukasten',
        loadChildren: () => loadRemoteModule('raetselbaukasten-ui', './Routes').then(m => m.remoteRoutes),
    },
    {
        path: 'minikaenguru-statistik',
        loadChildren: () => loadRemoteModule('minikaenguru-statistik-ui', './Routes').then(m => m.remoteRoutes),
    },
    {
        path: 'minikaenguru-admin',
        canMatch: [minikaenguruAdminGuard()],
        loadChildren: () => loadRemoteModule('minikaenguru-admin-ui', './Routes').then(m => m.remoteRoutes),
    },
];
