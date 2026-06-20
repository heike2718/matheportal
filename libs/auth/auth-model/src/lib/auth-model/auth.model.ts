import { InjectionToken } from '@angular/core';
import { getIdToken, mapToAuthResultState } from './internal';

export const AUTH_FEATURE_KEY = 'mpAuth';

export type SESSION_VALIDATION_FAILED_REASON = 'technical' | 'expired' | 'missing';

export type AUTH_RESULT_STATE = 'login' | 'signup' | 'invalid';

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

export function mapHashToAuthResult(hash: string): AuthResult | null {
    const cleanedHash = hash.replace(/^#?\/?/, '');

    if (cleanedHash.length === 0) {
        return null;
    }

    const params = new URLSearchParams(cleanedHash);

    if (!params.get('oauthFlowType')) {
        return null;
    }

    const authState = mapToAuthResultState(params.get('state'));
    const idToken = getIdToken(params.get('idToken'));

    if (authState === 'signup') {
        return {
            state: 'signup',
            idToken,
        };
    }

    if (authState === 'login') {
        return {
            state: 'login',
            idToken,
        };
    }

    return {
        state: 'invalid',
        idToken,
    };
}

export function parseSessionValidationFailedDtoReason(value: unknown): 'expired' | 'missing' {
    if (typeof value !== 'object' || value === null) {
        return 'missing';
    }

    const reason = (value as { reason?: unknown }).reason;

    return reason === 'expired' || reason === 'missing' ? reason : 'missing';
}
