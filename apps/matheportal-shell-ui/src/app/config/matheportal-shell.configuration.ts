import { InjectionToken } from '@angular/core';
import { MatheportalRuntimeConfiguration } from '@matheportal/configuration';

export interface MatheportalShellConfiguration extends MatheportalRuntimeConfiguration {
    readonly apiUrl: string;
}

export const MATHEPORTAL_SHELL_CONFIGURATION = new InjectionToken<MatheportalShellConfiguration>(
    'matheportal-shell-configuration'
);
