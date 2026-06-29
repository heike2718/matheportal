export const MINIKAENGURU_BERECHTIGUNGSTYP = {
    schule: 'SCHULE',
    privat: 'PRIVAT',
    none: 'NONE',
} as const;

export type MinikaenguruBerechtigungstyp =
    (typeof MINIKAENGURU_BERECHTIGUNGSTYP)[keyof typeof MINIKAENGURU_BERECHTIGUNGSTYP];

export type AuthorizationLoadState = 'not-loaded' | 'loaded' | 'failed';

export type StartViewState =
    | 'not-loaded'
    | 'loading'
    | 'failed'
    | 'guest'
    | 'dashboard-privatperson'
    | 'dashboard-lehrperson'
    | 'wettbewerbsdurchfuehrenden-anlegen';

export const MKA_AUTHORIZATION_FEATURE_KEY = 'mkaAuthorization';
