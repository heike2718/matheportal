import { InjectionToken } from '@angular/core';
import { MatheportalRuntimeConfiguration } from '@matheportal/shared-runtime-config';

export interface MinikaenguruAnwendungConfiguration extends MatheportalRuntimeConfiguration {
    readonly apiUrl: string;
}

export const MINIKAENGURU_ANWENDUNG_CONFIGURATION = new InjectionToken<MinikaenguruAnwendungConfiguration>(
    'minikaenguru-anwendung-configuration'
);
