export const VERANSTALTERTYP = {
    lehrer: 'LEHRER',
    privat: 'PRIVAT',
    none: 'NONE',
} as const;

export type Veranstaltertyp = (typeof VERANSTALTERTYP)[keyof typeof VERANSTALTERTYP];

export type AuthorizationLoadState = 'not-loaded' | 'loaded' | 'failed';

export type StartViewState =
    | 'not-loaded'
    | 'loading'
    | 'failed'
    | 'guest'
    | 'dashboard-privat'
    | 'dashboard-lehrer'
    | 'veranstalter-anlegen';

export const MKA_AUTHORIZATION_FEATURE_KEY = 'mkaAuthorization';
