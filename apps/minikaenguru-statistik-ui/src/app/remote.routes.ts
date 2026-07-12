import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MINIKAENGURU_STATISTIK_CONFIGURATION } from './config/minikaenguru-statistik.configuration';
import { minikaenguruStatistikConfiguration } from './config/configuration';

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
                provide: MINIKAENGURU_STATISTIK_CONFIGURATION,
                useValue: minikaenguruStatistikConfiguration,
            },
        ],
    },
];
