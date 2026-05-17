import { InjectionToken } from '@angular/core';

export const AUTH_FEATURE_KEY = 'mpAuth';

export type SESSION_VALIDATION_FAILED_REASON = 'technical' | 'expired' | 'useraction';

export type AUTHORIZATION_STATE = 'loggedOut' | 'unauthorized' | 'authorized';

export interface AuthConfiguration {
    readonly apiUrl: string;
}

export const AUTH_CONFIGURATION = new InjectionToken<AuthConfiguration>('auth-configuration');

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
