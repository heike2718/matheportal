import { loadRemoteModule } from '@angular-architects/native-federation';
import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';

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
        path: 'minikaenguru-admin',
        loadChildren: () => loadRemoteModule('minikaenguru-admin-ui', './Routes').then(m => m.remoteRoutes),
    },
];
