import { anonymousUser, User } from '@matheportal/auth-model';
import { on, createFeature, createReducer } from '@ngrx/store';
import { authActions } from './auth.actions';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';

const AUTH_FEATURE_KEY = 'MPAuth';

export interface AuthState {
    readonly sessionLoadingState: RESOURCE_LOAD_STATE;
    readonly user: User;
}

const initialAuthState: AuthState = {
    sessionLoadingState: 'not-loaded',
    user: anonymousUser,
};

export const authFeature = createFeature({
    name: AUTH_FEATURE_KEY,
    reducer: createReducer<AuthState>(
        initialAuthState,
        on(authActions.invalidOAuthFlowHash, () => {
            return { ...initialAuthState, sessionLoadingState: 'technical-error' };
        }),
        on(authActions.signedUp, () => {
            return { ...initialAuthState, sessionLoadingState: 'unauthorized' };
        }),
        on(authActions.sessionCreated, (state, action) => {
            return { ...state, user: action.user, sessionLoadingState: 'loaded' };
        }),
        on(authActions.createSessionFailed, state => {
            return { ...state, user: anonymousUser, sessionLoadingState: 'technical-error' };
        }),
        on(authActions.sessionValidated, (state, action) => {
            return { ...state, user: action.user, sessionLoadingState: 'loaded' };
        }),
        on(authActions.sessionValidationFailed, (state, { reason }) => {
            const loadingState: RESOURCE_LOAD_STATE = reason === 'technical' ? 'technical-error' : 'unauthorized';
            return { ...state, user: anonymousUser, sessionLoadingState: loadingState };
        }),
        on(authActions.userAugmented, (state, action) => {
            return { ...state, user: action.user };
        }),
        on(authActions.loggedOut, () => {
            return { ...initialAuthState, sessionLoadingState: 'unauthorized' };
        })
    ),
});
