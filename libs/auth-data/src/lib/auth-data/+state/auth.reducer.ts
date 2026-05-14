import { anonymousUser, AUTH_FEATURE_KEY, User } from '@matheportal/auth-model';
import { on, createFeature, createReducer } from '@ngrx/store';
import { authActions } from './auth.actions';

export interface AuthState {
    readonly user: User;
    readonly isSessonValidated: boolean;
}

const initialAuthState: AuthState = {
    user: anonymousUser,
    isSessonValidated: false,
};

export const authFeature = createFeature({
    name: AUTH_FEATURE_KEY,
    reducer: createReducer<AuthState>(
        initialAuthState,
        on(authActions.sessionValidated, (state, action) => {
            return { ...state, user: action.user, isSessonValidated: true };
        }),
        on(authActions.sessionValidationFailed, state => {
            return { ...state, user: anonymousUser, isSessonValidated: true };
        }),
        on(authActions.loggedOut, () => {
            return initialAuthState;
        })
    ),
});
