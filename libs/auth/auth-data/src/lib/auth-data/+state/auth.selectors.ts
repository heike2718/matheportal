import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

const { selectMpAuthState } = authFeature;

const user = createSelector(selectMpAuthState, state => state.user);

const hasSession = createSelector(selectMpAuthState, state => !state.user.anonym);

const isAdmin = createSelector(user, user => user.berechtigungen.indexOf('ADMIN') >= 0);

export const fromAuth = {
    user,
    hasSession: hasSession,
    isAdmin,
};
