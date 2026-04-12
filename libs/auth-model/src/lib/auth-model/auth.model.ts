export const AUTH_FEATURE_KEY = 'mpAuth';

export type LOGGED_OUT_REASON = 'technical' | 'expired' | 'unauthorized' | 'useraction';

export type AUTHORIZATION_STATE = 'loggedOut' | 'unauthorized' | 'authorized';

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
