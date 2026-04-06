import { loadRemoteModule } from '@angular-architects/native-federation';
import { Route } from '@angular/router';
import { AppComponent } from './app.component';

export const appRoutes: Route[] = [
    {
        path: 'home',
        component: AppComponent,
    },
    {
        path: 'minikaenguru-anwendung',
        loadComponent: () => loadRemoteModule('minikaenguru-anwendung-ui', './Component').then(m => m.AppComponent),
    },
    {
        path: 'raetselbaukasten',
        loadComponent: () => loadRemoteModule('raetselbaukasten-ui', './Component').then(m => m.AppComponent),
    },
];
