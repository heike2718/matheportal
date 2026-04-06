import { InjectionToken } from '@angular/core';
import { MatheportalRuntimeConfiguration } from '@matheportal/configuration';

export interface MinikaenguruAnwendungConfiguration extends MatheportalRuntimeConfiguration {
    readonly apiUrl: string;
}

export const MATHEPORTAL_SHELL_CONFIGURATION = new InjectionToken<MinikaenguruAnwendungConfiguration>(
    'minikaenguru-anwendung-configuration'
);
