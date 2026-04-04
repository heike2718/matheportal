import { InjectionToken } from '@angular/core';

export interface MinikaenguruAnwendungConfiguration {
    readonly production: boolean;
    readonly version: string;
    readonly environment: string;
    readonly apiUrl: string;
}

export const MATHEPORTAL_SHELL_CONFIGURATION = new InjectionToken<MinikaenguruAnwendungConfiguration>(
    'minikaenguru-anwendung-configuration'
);
