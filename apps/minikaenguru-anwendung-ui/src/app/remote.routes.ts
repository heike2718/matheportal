import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start/start.component';
import { mkaAuthorizationDataProvider } from './core/authorization/authorization-api/mka-authorization-data.provider';
import { minikaenguruAnwendungConfiguration } from './config/configuration';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from './config/minikaenguru-anwendung.configuration';
import { GuestInfoComponent } from './start/guest-info/guest-info.component';
import { wettbewerbsdurchfuehrendeDataProvider } from './core/wettbewerbsdurchfuehrende/api/wettbewerbsdurchfuehrende-data.provider';
import { DashboardPrivatpersonComponent } from './privatperson/dashboard-privatperson/dashboard-privatperson.component';
import { mkaPrivatpersonGuard } from './core/authorization/authorization-api/mka-privatperson.guard';
import { mkaSchulkatalogsucheDataProvider } from './schulkatalog/schulkatalogsuche/api/schulkatalogsuche-data.provider';
import { SchulkatalogsucheComponent } from './schulkatalog/schulkatalogsuche/features/schulkatalogsuche-component/schulkatalogsuche.component';

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
                canActivate: [mkaPrivatpersonGuard()],
                canActivateChild: [mkaPrivatpersonGuard()],
                component: DashboardPrivatpersonComponent,
            },
            {
                path: 'schulkatalogsuche',
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
