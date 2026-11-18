import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start/start.component';
import { mkaAuthorizationDataProvider } from './core/authorization/authorization-api/mka-authorization-data.provider';
import { minikaenguruAnwendungConfiguration } from './config/configuration';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from './config/minikaenguru-anwendung.configuration';
import { wettbewerbsdurchfuehrendeDataProvider } from './core/wettbewerbsdurchfuehrende/api/wettbewerbsdurchfuehrende-data.provider';
import { mkaSchulkatalogsucheDataProvider } from './schulkatalog/schulkatalogsuche/api/schulkatalogsuche-data.provider';
import { SchulkatalogsucheComponent } from './schulkatalog/schulkatalogsuche/features/schulkatalogsuche-component/schulkatalogsuche.component';
import { portalRoutes } from '@matheportal/portal-navigation';
import { mkaSchulkatalogsucheGuard } from './schulkatalog/schulkatalogsuche/api/schulkatalogsuche.guard';
import { schulkatalogantragDataProvider } from './schulkatalog/schulkatalogantrag/api/schulkatalogantrag-data.provider';
import { wettbewerbDataProvider } from './core/wettbewerb/api/wettbewerb-data.provider';
import { schuleDataProvider } from './schule/api/schule-data.provider';
import { ArbeitskontextHttpService } from './core/services/arbeitskontext-http.service';
import { lehrpersonDataProvider } from './lehrperson/api/lehrperson-data.provider';
import { SchuleDashboardComponent } from './schule/features/schule-dashboard/schule-dashboard.component';
import { mkaSchuleGuard } from './schule/api/mka-schule.guard';
import { ablaufsteuerungDataProvider } from './core/ablaufsteuerung/ablaufsteuerung-data.provider';
import { mkaPrivatpersonGuard } from './privatperson/api/mka-privatperson.guard';
import { privatpersonDataProvider } from './privatperson/api/privatperson-data.provider';
import { DurchfuehrungsartWaehlenComponent } from './start/durchfuehrungsart-waehlen/durchfuehrungsart-waehlen.component';
import { LadefehlerComponent } from './start/ladefehler/ladefehler.component';
import { mkaLehrpersonGuard } from './lehrperson/api/mka-lehrperson.guard';
import { GuestInfoComponent } from './start/guest-info/guest-info.component';
import { LehrpersonDashboardComponent } from './lehrperson/features/lehrperson-dashboard/lehrperson-dashboard.component';
import { PrivatpersonDashboardComponent } from './privatperson/features/privatperson-dashboard/privatperson-dashboard.component';
import { mkaPrivatteilnahmeGuard } from './teilnahmen/privatteilnahme/api/mka-privatteilnahme.guard';
import { mkaSchulteilnahmeGuard } from './teilnahmen/schulteilnahme/api/mka-schulteilnahme.guard';
import { privatteilnahmeDataProvider } from './teilnahmen/privatteilnahme/api/privatteilnahme-data.provider';
import { schulteilnahmeDataProvider } from './teilnahmen/schulteilnahme/api/schulteilnahme-data.provider';
import { PrivatteilnahmeComponent } from './teilnahmen/privatteilnahme/features/privatteilnahme/privatteilnahme.component';
import { SchulteilnahmeComponent } from './teilnahmen/schulteilnahme/features/schulteilnahme/schulteilnahme.component';

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
                path: portalRoutes.minikaenguruAnwendung.ladefehler,
                component: LadefehlerComponent,
            },
            {
                path: portalRoutes.minikaenguruAnwendung.durchfuehrungsart,
                component: DurchfuehrungsartWaehlenComponent,
            },
            {
                path: portalRoutes.minikaenguruAnwendung.privatperson,
                canActivate: [mkaPrivatpersonGuard()],
                canActivateChild: [mkaPrivatpersonGuard()],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: PrivatpersonDashboardComponent,
                    },
                    {
                        path: portalRoutes.minikaenguruAnwendung.privatteilnahme,
                        canActivate: [mkaPrivatteilnahmeGuard()],
                        component: PrivatteilnahmeComponent,
                    },
                ],
            },
            {
                path: portalRoutes.minikaenguruAnwendung.lehrperson,
                canActivate: [mkaLehrpersonGuard()],
                canActivateChild: [mkaLehrpersonGuard()],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: LehrpersonDashboardComponent,
                    },
                    {
                        path: portalRoutes.minikaenguruAnwendung.schule,
                        canActivate: [mkaSchuleGuard()],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                component: SchuleDashboardComponent,
                            },
                            {
                                path: portalRoutes.minikaenguruAnwendung.schulteilnahme,
                                canActivate: [mkaSchulteilnahmeGuard()],
                                component: SchulteilnahmeComponent,
                            },
                        ],
                    },
                ],
            },
            {
                path: portalRoutes.minikaenguruAnwendung.schulkatalogsuche,
                canActivate: [mkaSchulkatalogsucheGuard()],
                canActivateChild: [mkaSchulkatalogsucheGuard()],
                component: SchulkatalogsucheComponent,
            },
            {
                path: portalRoutes.minikaenguruAnwendung.unknown,
                redirectTo: '',
            },
        ],
        providers: [
            {
                provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                useValue: minikaenguruAnwendungConfiguration,
            },
            ...mkaAuthorizationDataProvider,
            ...ablaufsteuerungDataProvider,
            ...wettbewerbDataProvider,
            ...wettbewerbsdurchfuehrendeDataProvider,
            ...mkaSchulkatalogsucheDataProvider,
            ...schulkatalogantragDataProvider,
            ...schuleDataProvider,
            ...lehrpersonDataProvider,
            ...privatpersonDataProvider,
            ...privatteilnahmeDataProvider,
            ...schulteilnahmeDataProvider,
            ArbeitskontextHttpService,
        ],
    },
];
