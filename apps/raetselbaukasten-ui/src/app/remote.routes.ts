import { Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { AppComponent } from './app.component';

export const remoteRoutes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            {
                path: '',
                component: StartComponent,
            },
            // spätere Feature-Routen hier
        ],
    },
];
