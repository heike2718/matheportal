import { anonymousUser, AUTH_FEATURE_KEY, User } from '@matheportal/auth-model';
import { on, createFeature, createReducer } from '@ngrx/store';
import { authActions } from './auth.actions';

export interface AuthState {
    readonly user: User;
}

const initialAuthState: AuthState = {
    user: anonymousUser,
};

export const authFeature = createFeature({
    name: AUTH_FEATURE_KEY,
    reducer: createReducer<AuthState>(
        initialAuthState,
        on(authActions.sessionCreated, (state, action) => {
            return { ...state, user: action.user };
        }),
        on(authActions.createSessionFailed, state => {
            return { ...state, user: anonymousUser };
        }),
        on(authActions.sessionValidated, (state, action) => {
            return { ...state, user: action.user };
        }),
        on(authActions.sessionValidationFailed, state => {
            return { ...state, user: anonymousUser };
        }),
        on(authActions.loggedOut, () => {
            return initialAuthState;
        })
    ),
});
