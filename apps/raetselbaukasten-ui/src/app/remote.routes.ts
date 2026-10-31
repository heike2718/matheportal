import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RaetselSucheComponent } from './domains/raetsel/features/raetsel-suche/raetsel-suche.component';
import { AufgabensammlungenSucheComponent } from './domains/aufgabensammlungen/features/aufgabensammlungen-suche/aufgabensammlungen-suche.component';
import { MedienSucheComponent } from './domains/medien/features/medien-suche/medien-suche.component';
import { raetselbaukastenAuthGuard } from './core/auth/raetselbaukasten-auth.guard';
import { raetselbaukastenAutorGuard } from './core/auth/raetselbaukasten-autor.guard';
import { portalRoutes } from '@matheportal/portal-navigation';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GuestInfoComponent } from './start/guest-info/guest-info.component';
import { LadefehlerComponent } from './start/ladefehler/ladefehler.component';
import { StartComponent } from './start/start/start.component';
import { RAETSELBAUKASTEN_CONFIGURATION } from './config/raetselbaukasten.configuration';
import { raetselbaukastenConfiguration } from './config/configuration.production';
import { raetselbaukastenEinstiegDataProvider } from './core/ablaufsteuerung/ablaufsteuerung-data.provider';

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
                path: portalRoutes.raetselbaukasten.ladefehler,
                component: LadefehlerComponent,
            },
            {
                path: portalRoutes.raetselbaukasten.guests,
                component: GuestInfoComponent,
            },
            {
                path: portalRoutes.raetselbaukasten.dashboard,
                component: DashboardComponent,
                canActivate: [raetselbaukastenAuthGuard()],
                canActivateChild: [raetselbaukastenAuthGuard()],
            },
            {
                path: portalRoutes.raetselbaukasten.raetsel,
                component: RaetselSucheComponent,
                canActivate: [raetselbaukastenAuthGuard()],
                canActivateChild: [raetselbaukastenAuthGuard()],
            },
            {
                path: portalRoutes.raetselbaukasten.aufgabensammlungen,
                component: AufgabensammlungenSucheComponent,
                canActivate: [raetselbaukastenAuthGuard()],
                canActivateChild: [raetselbaukastenAuthGuard()],
            },
            {
                path: portalRoutes.raetselbaukasten.medien,
                component: MedienSucheComponent,
                canActivate: [raetselbaukastenAutorGuard()],
                canActivateChild: [raetselbaukastenAutorGuard()],
            },
        ],
        providers: [
            {
                provide: RAETSELBAUKASTEN_CONFIGURATION,
                useValue: raetselbaukastenConfiguration,
            },
            ...raetselbaukastenEinstiegDataProvider,
        ],
    },
];
