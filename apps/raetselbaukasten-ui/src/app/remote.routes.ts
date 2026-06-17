import { Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { AppComponent } from './app.component';
import { RaetselSucheComponent } from './domains/raetsel/features/raetsel-suche/raetsel-suche.component';
import { AufgabensammlungenSucheComponent } from './domains/aufgabensammlungen/features/aufgabensammlungen-suche/aufgabensammlungen-suche.component';
import { MedienSucheComponent } from './domains/medien/features/medien-suche/medien-suche.component';

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
                component: RaetselSucheComponent,
            },
            {
                path: 'aufgabensammlungen',
                component: AufgabensammlungenSucheComponent,
            },
            {
                path: 'medien',
                component: MedienSucheComponent,
            },
        ],
    },
];
