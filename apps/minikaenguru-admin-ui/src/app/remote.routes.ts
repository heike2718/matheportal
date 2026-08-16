import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { MINIKAENGURU_ADMIN_CONFIGURATION } from './config/minikaenguru-admin.configuration';
import { portalRoutes } from '@matheportal/portal-navigation';
import { minikaenguruAdminConfiguration } from './config/configuration';
import { DashboardComponent } from './dashboard/dashboard.component';
import { minikaenguruAdminGuard } from './core/authorization/minikaenguru-admin.guard';
import { schulkatalogDataProvider } from './schulkatalog/api/schulkatalog-data.provider';

export const remoteRoutes: Route[] = [
    {
        path: '',
        canActivate: [minikaenguruAdminGuard()],
        canActivateChild: [minikaenguruAdminGuard()],
        component: AppComponent,

        children: [
            {
                path: '',
                component: DashboardComponent,
            },
            {
                path: portalRoutes.minikaenguruAdmin.unknown,
                redirectTo: '',
            },
        ],
        providers: [
            {
                provide: MINIKAENGURU_ADMIN_CONFIGURATION,
                useValue: minikaenguruAdminConfiguration,
            },
            ...schulkatalogDataProvider,
        ],
    },
];
