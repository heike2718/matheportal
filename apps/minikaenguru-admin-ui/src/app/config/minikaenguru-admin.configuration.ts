import { InjectionToken } from '@angular/core';
import { MatheportalRuntimeConfiguration } from '@matheportal/shared-runtime-config';

export interface MinikaenguruAdminConfiguration extends MatheportalRuntimeConfiguration {
    readonly apiUrl: string;
}

export const MINIKAENGURU_ADMIN_CONFIGURATION = new InjectionToken<MinikaenguruAdminConfiguration>(
    'minikaenguru-admin-configuration'
);
