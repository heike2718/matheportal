import { ApplicationConfig, EnvironmentProviders, provideBrowserGlobalErrorListeners, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { matheportalShellConfiguration } from './config/configuration';
import { MATHEPORTAL_SHELL_CONFIGURATION } from './config/matheportal-shell.configuration';
import { AUTH_CONFIGURATION } from '@matheportal/auth-model';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import { authDataProvider, credentialsInterceptor } from '@matheportal/auth-api';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { globalTechnicalHttpErrorInterceptor } from '@matheportal/error-handling-api';
import { loadingInterceptor } from '@matheportal/feedback-api';
import { errorAndFeedbackProvider } from '@matheportal/error-and-feedback';
import { DEFAULT_DIALOG_CONFIG, DialogConfig } from '@angular/cdk/dialog';
import { PortalNavigationEffects } from './navigation/portal-navigation.effects';

function getEnvironmentSpecificProviders(): Array<Provider | EnvironmentProviders> {
    const providers: Array<Provider | EnvironmentProviders> = [];

    if (!matheportalShellConfiguration.production) {
        providers.push(
            provideStoreDevtools({
                maxAge: 25,
                connectInZone: true,
                logOnly: false,
            })
        );
    }

    return providers;
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(appRoutes),
        provideStore({}),
        provideEffects(PortalNavigationEffects),
        ...getEnvironmentSpecificProviders(),
        authDataProvider,
        { provide: AUTH_CONFIGURATION, useValue: { apiUrl: matheportalShellConfiguration.apiUrl } },
        { provide: MATHEPORTAL_SHELL_CONFIGURATION, useValue: matheportalShellConfiguration },
        provideHttpClient(
            withInterceptors([loadingInterceptor, credentialsInterceptor, globalTechnicalHttpErrorInterceptor])
        ),
        errorAndFeedbackProvider,
        { provide: DEFAULT_DIALOG_CONFIG, useValue: { ...new DialogConfig(), disableClose: true } },
    ],
};
