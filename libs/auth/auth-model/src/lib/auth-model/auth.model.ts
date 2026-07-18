import { InjectionToken } from '@angular/core';

export const AUTH_FEATURE_KEY = 'mpAuth';

export type AUTH_RESULT_STATE = 'login' | 'signup' | 'invalid';

export const LOGGED_OUT_EVENT = 'user logged out';

export interface AuthConfiguration {
    readonly apiUrl: string;
}

export const AUTH_CONFIGURATION = new InjectionToken<AuthConfiguration>('auth-configuration');

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

export interface SessionValidationFailedDto {
    readonly reason: 'expired' | 'missing';
}

export interface AuthResult {
    readonly state: AUTH_RESULT_STATE;
    readonly idToken: string | undefined;
}

export interface User {
    readonly fullName: string;
    readonly berechtigungen: string[];
    readonly anonym: boolean;
}

export const anonymousUser: User = {
    fullName: 'Gast',
    berechtigungen: [],
    anonym: true,
};

export type UserWithBerechtigungen = {
    readonly berechtigungen: readonly string[];
};

export interface AuthUrlResponse {
    readonly url: string;
}
