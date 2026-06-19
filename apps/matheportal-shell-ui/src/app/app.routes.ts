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
        loadComponent: () => loadRemoteModule('minikaenguru-anwendung-ui', './Component').then(m => m.AppComponent),
    },
    {
        path: 'raetselbaukasten',
        loadChildren: () => loadRemoteModule('raetselbaukasten-ui', './Routes').then(m => m.remoteRoutes),
    },
];
