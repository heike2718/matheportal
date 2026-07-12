import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { MINIKAENGURU_ADMIN_CONFIGURATION } from './config/minikaenguru-admin.configuration';
import { minikaenguruAdminConfiguration } from './config/configuration';
import { DashboardComponent } from './dashboard/dashboard.component';
export const remoteRoutes: Route[] = [
    {
        path: '',
        component: AppComponent,
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
