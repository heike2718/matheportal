import { loadRemoteModule } from '@angular-architects/native-federation';
import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { minikaenguruAdminGuard } from './authorization/minikaenguru-admin.guard';
import { portalRoutes } from '@matheportal/portal-navigation';

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
        path: portalRoutes.minikaenguruAnwendung.root,
        loadChildren: () => loadRemoteModule('minikaenguru-anwendung-ui', './Routes').then(m => m.remoteRoutes),
    },
    {
        path: portalRoutes.raetselbaukasten.root,
        loadChildren: () => loadRemoteModule('raetselbaukasten-ui', './Routes').then(m => m.remoteRoutes),
    },
    {
        path: portalRoutes.minikaenguruStatistik.root,
        loadChildren: () => loadRemoteModule('minikaenguru-statistik-ui', './Routes').then(m => m.remoteRoutes),
    },
    {
        path: portalRoutes.minikaenguruAdmin.root,
        canMatch: [minikaenguruAdminGuard()],
        loadChildren: () => loadRemoteModule('minikaenguru-admin-ui', './Routes').then(m => m.remoteRoutes),
    },
];
