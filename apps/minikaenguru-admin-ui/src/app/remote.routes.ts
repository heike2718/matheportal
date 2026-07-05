import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { MINIKAENGURU_ADMIN_CONFIGURATION } from './config/minikaenguru-admin.configuration';
import { minikaenguruAdminConfiguration } from './config/configuration.production';

export const remoteRoutes: Route[] = [
    {
        path: '',
        component: AppComponent,
        // children: [
        //     {
        //         path: '',
        //         component: StartComponent,
        //     },
        //     {
        //         path: 'guests',
        //         component: GuestInfoComponent,
        //     },
        //     {
        //         path: 'dashboard-privatperson',
        //         canActivate: [mkaPrivatpersonGuard()],
        //         canActivateChild: [mkaPrivatpersonGuard()],
        //         component: DashboardPrivatpersonComponent,
        //     },
        // ],
        providers: [
            {
                provide: MINIKAENGURU_ADMIN_CONFIGURATION,
                useValue: minikaenguruAdminConfiguration,
            },
            // ...mkaAuthorizationDataProvider,
            // ...wettbewerbsdurchfuehrendeDataProvider,
        ],
    },
];
