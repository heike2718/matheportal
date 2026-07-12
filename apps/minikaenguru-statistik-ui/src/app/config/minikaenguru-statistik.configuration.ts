import { InjectionToken } from '@angular/core';
import { MatheportalRuntimeConfiguration } from '@matheportal/shared-runtime-config';

export interface MinikaenguruStatistikConfiguration extends MatheportalRuntimeConfiguration {
    readonly apiUrl: string;
}

export const MINIKAENGURU_STATISTIK_CONFIGURATION = new InjectionToken<MinikaenguruStatistikConfiguration>(
    'minikaenguru-statistik-configuration'
);
