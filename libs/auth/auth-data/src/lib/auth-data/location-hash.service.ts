import { InjectionToken } from '@angular/core';

export interface LocationHashService {
    readonly read: () => string;
    readonly clear: () => void;
}

export const LOCATION_HASH_SERVICE = new InjectionToken<LocationHashService>('location-hash-service', {
    providedIn: 'root',
    factory: () => ({
        read: () => window.location.hash,
        clear: () => {
            window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
        },
    }),
});
