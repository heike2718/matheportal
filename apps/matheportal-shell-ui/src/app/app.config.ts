import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { matheporalShellConfiguration, MATHEPORTAL_SHELL_CONFIGURATION } from '@mp-shell-config';

// Environment-spezifische Provider
function getEnvironmentSpecificProviders() {
    // const providers = [];

    // if (!matheporalShellConfiguration.production) {
    //     providers.push(
    //         provideStoreDevtools({
    //             maxAge: 25,
    //             connectInZone: true,
    //             logOnly: false,
    //         })
    //     );
    // }

    return [];
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(appRoutes),
        ...getEnvironmentSpecificProviders(),
        { provide: MATHEPORTAL_SHELL_CONFIGURATION, useValue: matheporalShellConfiguration },
    ],
};
