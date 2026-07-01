import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start/start.component';
import { mkaAuthorizationDataProvider } from './core/authorization/authorization-api/mka-authorization-data.provider';
import { minikaenguruAnwendungConfiguration } from './config/configuration';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from './config/minikaenguru-anwendung.configuration';
import { GuestInfoComponent } from './start/guest-info/guest-info.component';
import { wettbewerbsdurchfuehrendeDataProvider } from './core/wettbewerbsdurchfuehrende/api/wettbewerbsdurchfuehrende-data.provider';
import { DashboardPrivatpersonComponent } from './privatperson/dashboard-privatperson/dashboard-privatperson.component';

export const remoteRoutes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            {
                path: '',
                component: StartComponent,
            },
            {
                path: 'guests',
                component: GuestInfoComponent,
            },
            {
                path: 'dashboard-privatperson',
                component: DashboardPrivatpersonComponent,
            },
        ],
        providers: [
            {
                provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                useValue: minikaenguruAnwendungConfiguration,
            },
            ...mkaAuthorizationDataProvider,
            ...wettbewerbsdurchfuehrendeDataProvider,
        ],
    },
];
