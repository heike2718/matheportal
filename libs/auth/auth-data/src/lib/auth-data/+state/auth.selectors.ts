import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

const { selectMPAuthState } = authFeature;

const user = createSelector(selectMPAuthState, state => state.user);

const hasSession = createSelector(selectMPAuthState, state => !state.user.anonym);

const isAdmin = createSelector(user, user => user.berechtigungen.indexOf('ADMIN') >= 0);

export const fromAuth = {
    user,
    hasSession: hasSession,
    isAdmin,
};
