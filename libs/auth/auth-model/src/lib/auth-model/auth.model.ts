import { InjectionToken } from '@angular/core';

export const AUTH_FEATURE_KEY = 'mpAuth';

export type SESSION_VALIDATION_FAILED_REASON = 'technical' | 'expired' | 'useraction';

export type AUTHORIZATION_STATE = 'loggedOut' | 'unauthorized' | 'authorized';

export type AUTH_RESULT_STATE = 'login' | 'signup' | 'invalid';

export interface AuthConfiguration {
    readonly apiUrl: string;
}

export const AUTH_CONFIGURATION = new InjectionToken<AuthConfiguration>('auth-configuration');

export const AUTH_LOCATION_HASH = new InjectionToken<() => string>('auth-location-hash', {
    providedIn: 'root',
    factory: () => () => window.location.hash,
});

export const CLEAR_AUTH_LOCATION_HASH = new InjectionToken<() => void>('clear-auth-location-hash', {
    providedIn: 'root',
    factory: () => () => {
        window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    },
});

export interface AuthResult {
    readonly state: AUTH_RESULT_STATE;
    readonly idToken: string | undefined;
}

export interface User {
    readonly fullName: string;
    readonly roles: string[];
    readonly anonym: boolean;
}

export const anonymousUser: User = {
    fullName: 'Gast',
    roles: [],
    anonym: true,
};

export interface AuthUrlResponse {
    readonly url: string;
}

function mapToAuthResultState(value: string | null): AUTH_RESULT_STATE {
    if (value === null) {
        return 'invalid';
    }
    switch (value) {
        case 'login':
            return 'login';
        case 'signup':
            return 'signup';
        default:
            return 'invalid';
    }
}

function getIdToken(idTokenParam: string | null): string | undefined {
    if (!idTokenParam) {
        return undefined;
    }

    return idTokenParam.trim().length === 0 ? undefined : idTokenParam;
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
