import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start/start.component';
import { mkaAuthorizationDataProvider } from './core/authorization/authorization-api/mka-authorization-data.provider';
import { minikaenguruAnwendungConfiguration } from './config/configuration';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from './config/minikaenguru-anwendung.configuration';
import { GuestInfoComponent } from './start/guest-info/guest-info.component';
import { wettbewerbsdurchfuehrendeDataProvider } from './core/wettbewerbsdurchfuehrende/api/wettbewerbsdurchfuehrende-data.provider';
import { DashboardPrivatpersonComponent } from './privatperson/dashboard-privatperson/dashboard-privatperson.component';
import { mkaSchulkatalogsucheDataProvider } from './schulkatalog/schulkatalogsuche/api/schulkatalogsuche-data.provider';
import { SchulkatalogsucheComponent } from './schulkatalog/schulkatalogsuche/features/schulkatalogsuche-component/schulkatalogsuche.component';
import { portalRoutes } from '@matheportal/portal-navigation';
import { DashboardLehrpersonComponent } from './lehrperson/dashboard-lehrperson/dashboard-lehrperson.component';

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
                path: portalRoutes.minikaenguruAnwendung.guests,
                component: GuestInfoComponent,
            },
            {
                path: portalRoutes.minikaenguruAnwendung.dashboardPrivatperson,
                // canActivate: [mkaPrivatpersonGuard()],
                // canActivateChild: [mkaPrivatpersonGuard()],
                component: DashboardPrivatpersonComponent,
            },
            {
                path: portalRoutes.minikaenguruAnwendung.dashboardLehrperson,
                component: DashboardLehrpersonComponent,
            },
            {
                path: portalRoutes.minikaenguruAnwendung.schulkatalogsuche,
                // canActivate: [mkaSchulkatalogsucheGuard()],
                // canActivateChild: [mkaSchulkatalogsucheGuard()],
                component: SchulkatalogsucheComponent,
            },
        ],
        providers: [
            {
                provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                useValue: minikaenguruAnwendungConfiguration,
            },
            ...mkaAuthorizationDataProvider,
            ...wettbewerbsdurchfuehrendeDataProvider,
            ...mkaSchulkatalogsucheDataProvider,
        ],
    },
];
