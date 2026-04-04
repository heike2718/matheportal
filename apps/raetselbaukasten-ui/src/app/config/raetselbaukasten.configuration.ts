import { InjectionToken } from '@angular/core';

export interface RaetselbaukastenConfiguration {
    readonly production: boolean;
    readonly version: string;
    readonly environment: string;
    readonly apiUrl: string;
}

export const MATHEPORTAL_SHELL_CONFIGURATION = new InjectionToken<RaetselbaukastenConfiguration>(
    'minikaenguru-anwendung-configuration'
);
