import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

const { selectMpAuthState } = authFeature;

const user = createSelector(selectMpAuthState, state => state.user);

const hasSession = createSelector(selectMpAuthState, state => !state.user.anonym);

export const fromAuth = {
    user,
    hasSession: hasSession,
};
