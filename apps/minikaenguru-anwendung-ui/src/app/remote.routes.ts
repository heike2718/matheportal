import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';

export const remoteRoutes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            {
                path: '',
                component: StartComponent,
            },
        ],
    },
];
