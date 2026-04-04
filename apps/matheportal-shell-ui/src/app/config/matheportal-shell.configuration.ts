import { InjectionToken } from '@angular/core';

export interface MatheportalShellConfiguration {
    readonly production: boolean;
    readonly version: string;
    readonly environment: string;
    readonly apiUrl: string;
}

export const MATHEPORTAL_SHELL_CONFIGURATION = new InjectionToken<MatheportalShellConfiguration>(
    'matheportal-shell-configuration'
);
