import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { matheportalShellConfiguration } from './config/configuration';
import { MATHEPORTAL_SHELL_CONFIGURATION } from './config/matheportal-shell.configuration';
import { AUTH_CONFIGURATION } from '@matheportal/auth-model';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import { authDataProvider } from '@matheportal/auth-api';

function getEnvironmentSpecificProviders() {
    const providers = [];

    if (!matheportalShellConfiguration.production) {
        providers.push(
            provideStoreDevtools({
                maxAge: 25,
                connectInZone: true,
                logOnly: false,
            })
        );
    }

    return [];
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(appRoutes),
        provideStore({}),
        provideEffects(),
        ...getEnvironmentSpecificProviders(),
        authDataProvider,
        { provide: AUTH_CONFIGURATION, useValue: { apiUrl: matheportalShellConfiguration.apiUrl } },
        { provide: MATHEPORTAL_SHELL_CONFIGURATION, useValue: matheportalShellConfiguration },
    ],
};
