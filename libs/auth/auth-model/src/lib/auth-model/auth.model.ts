import { InjectionToken } from '@angular/core';
import { components } from './generated/api-types';

export type AUTH_RESULT_STATE = 'login' | 'signup' | 'invalid';

export const LOGGED_OUT_EVENT = 'user logged out';

export interface AuthConfiguration {
    readonly apiUrl: string;
}

export const AUTH_CONFIGURATION = new InjectionToken<AuthConfiguration>('auth-configuration');

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

export type AuthUrlResponse = components['schemas']['AuthUrlResponse'];
