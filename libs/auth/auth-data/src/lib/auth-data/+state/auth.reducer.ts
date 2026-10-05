import { anonymousUser, User } from '@matheportal/auth-model';
import { on, createFeature, createReducer } from '@ngrx/store';
import { authActions } from './auth.actions';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';

const AUTH_FEATURE_KEY = 'MPAuth';

export interface AuthState {
    readonly sessionLoadState: RESOURCE_LOAD_STATE;
    readonly user: User;
}

const initialAuthState: AuthState = {
    sessionLoadState: 'not-loaded',
    user: anonymousUser,
};

export const authFeature = createFeature({
    name: AUTH_FEATURE_KEY,
    reducer: createReducer<AuthState>(
        initialAuthState,
        on(authActions.invalidOAuthFlowHash, () => {
            return { ...initialAuthState, sessionLoadState: 'technical-error' };
        }),
        on(authActions.signedUp, () => {
            return { ...initialAuthState, sessionLoadState: 'unauthorized' };
        }),
        on(authActions.sessionCreated, (state, action) => {
            return { ...state, user: action.user, sessionLoadState: 'loaded' };
        }),
        on(authActions.createSessionFailed, state => {
            return { ...state, user: anonymousUser, sessionLoadState: 'technical-error' };
        }),
        on(authActions.sessionValidated, (state, action) => {
            return { ...state, user: action.user, sessionLoadState: 'loaded' };
        }),
        on(authActions.sessionValidationFailed, (state, { reason }) => {
            const LoadState: RESOURCE_LOAD_STATE = reason === 'technical' ? 'technical-error' : 'unauthorized';
            return { ...state, user: anonymousUser, sessionLoadState: LoadState };
        }),
        on(authActions.userAugmented, (state, action) => {
            return { ...state, user: action.user };
        }),
        on(authActions.loggedOut, () => {
            return { ...initialAuthState, sessionLoadState: 'unauthorized' };
        })
    ),
});
