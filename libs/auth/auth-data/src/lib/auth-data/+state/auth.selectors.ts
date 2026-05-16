import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

const { selectMpAuthState } = authFeature;

const user = createSelector(selectMpAuthState, state => state.user);

const isSessonValidated = createSelector(selectMpAuthState, state => state.isSessionValidated);

export const fromAuth = {
    user,
    isSessonValidated,
};
