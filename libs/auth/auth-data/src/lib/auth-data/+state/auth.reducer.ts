import { anonymousUser, AUTH_FEATURE_KEY, User } from '@matheportal/auth-model';
import { on, createFeature, createReducer } from '@ngrx/store';
import { authActions } from './auth.actions';

export interface AuthState {
    readonly user: User;
    readonly isSessionValidated: boolean;
}

const initialAuthState: AuthState = {
    user: anonymousUser,
    isSessionValidated: false,
};

export const authFeature = createFeature({
    name: AUTH_FEATURE_KEY,
    reducer: createReducer<AuthState>(
        initialAuthState,
        on(authActions.sessionCreated, (state, action) => {
            return { ...state, user: action.user, isSessionValidated: true };
        }),
        on(authActions.createSessionFailed, (state, action) => {
            return { ...state, user: anonymousUser, isSessionValidated: false };
        }),
        on(authActions.sessionValidated, (state, action) => {
            return { ...state, user: action.user, isSessionValidated: true };
        }),
        on(authActions.sessionValidationFailed, state => {
            return { ...state, user: anonymousUser, isSessionValidated: true };
        }),
        on(authActions.loggedOut, () => {
            return initialAuthState;
        })
    ),
});
