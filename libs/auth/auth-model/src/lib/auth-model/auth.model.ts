import { InjectionToken } from '@angular/core';

export const AUTH_FEATURE_KEY = 'mpAuth';

export type SESSION_VALIDATION_FAILED_REASON = 'technical' | 'expired' | 'useraction';

export type AUTHORIZATION_STATE = 'loggedOut' | 'unauthorized' | 'authorized';

export type AUTH_RESULT_STATE = 'login' | 'signup';

export interface AuthConfiguration {
    readonly apiUrl: string;
}

export const AUTH_CONFIGURATION = new InjectionToken<AuthConfiguration>('auth-configuration');

export interface AuthResult {
    state: AUTH_RESULT_STATE | undefined;
    idToken: string | undefined;
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
    switch (value) {
        case 'login':
            return 'login';
        case 'signup':
            return 'signup';
        default:
            throw new Error(`Unknown auth result state: ${value}`);
    }
}

export function mapHashToAuthResult(hash: string): AuthResult {
    const cleanedHash = hash.replace(/^#?\/?/, '');

    if (cleanedHash.length === 0) {
        return {
            state: undefined,
            idToken: undefined,
        };
    }

    const params = new URLSearchParams(cleanedHash);

    const stateParam = params.get('state');
    const idTokenParam = params.get('idToken');

    return {
        state: mapToAuthResultState(stateParam),
        idToken: idTokenParam ?? undefined,
    };
}
