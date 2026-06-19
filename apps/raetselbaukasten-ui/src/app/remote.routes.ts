import { Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { AppComponent } from './app.component';
import { RaetselSucheComponent } from './domains/raetsel/features/raetsel-suche/raetsel-suche.component';
import { AufgabensammlungenSucheComponent } from './domains/aufgabensammlungen/features/aufgabensammlungen-suche/aufgabensammlungen-suche.component';
import { MedienSucheComponent } from './domains/medien/features/medien-suche/medien-suche.component';
import { raetselbaukastenAuthGuard } from './core/auth/raetselbaukasten-auth.guard';
import { raetselbaukastenAutorGuard } from './core/auth/raetselbaukasten-autor.guard';

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
                path: 'raetsel',
                canActivate: [raetselbaukastenAuthGuard()],
                component: RaetselSucheComponent,
            },
            {
                path: 'aufgabensammlungen',
                canActivate: [raetselbaukastenAuthGuard()],
                component: AufgabensammlungenSucheComponent,
            },
            {
                path: 'medien',
                canActivate: [raetselbaukastenAutorGuard()],
                component: MedienSucheComponent,
            },
        ],
    },
];
