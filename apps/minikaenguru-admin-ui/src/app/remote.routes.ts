import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { MINIKAENGURU_ADMIN_CONFIGURATION } from './config/minikaenguru-admin.configuration';
import { minikaenguruAdminConfiguration } from './config/configuration.production';
import { DashboardComponent } from './dashboard/dashboard.component';
import { minikaenguruAdminAuthGuard } from './core/authorization/minikaenguru-admin-auth.guard';

export const remoteRoutes: Route[] = [
    {
        path: '',
        component: AppComponent,
        canActivate: [minikaenguruAdminAuthGuard()],
        canActivateChild: [minikaenguruAdminAuthGuard()],
        children: [
            {
                path: '',
                component: DashboardComponent,
            },
        ],
        providers: [
            {
                provide: MINIKAENGURU_ADMIN_CONFIGURATION,
                useValue: minikaenguruAdminConfiguration,
            },
        ],
    },
];
