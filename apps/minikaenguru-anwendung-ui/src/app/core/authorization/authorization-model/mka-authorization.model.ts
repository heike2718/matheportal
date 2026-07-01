export enum MINIKAENGURU_BERECHTIGUNGSTYP {
    schule = 'SCHULE',
    privat = 'PRIVAT',
    none = 'NONE',
}

export type MinikaenguruBerechtigungstypKeys = keyof typeof MINIKAENGURU_BERECHTIGUNGSTYP;

export type MinikaenguruBerechtigungstyp = (typeof MINIKAENGURU_BERECHTIGUNGSTYP)[MinikaenguruBerechtigungstypKeys];

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
