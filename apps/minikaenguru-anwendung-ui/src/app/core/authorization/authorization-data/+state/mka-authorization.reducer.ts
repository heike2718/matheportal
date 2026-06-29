import { createFeature, createReducer, on } from '@ngrx/store';
import {
    AuthorizationLoadState,
    MKA_AUTHORIZATION_FEATURE_KEY,
    resolveBerechtigungstyp,
    MinikaenguruBerechtigungstyp,
} from '../../authorization-model';
import { mkaAuthorizationActions } from './mka-authorization.actions';

export interface MkaAuthorizationState {
    readonly authorizationLoadState: AuthorizationLoadState;
    readonly berechtigungstyp: MinikaenguruBerechtigungstyp;
}

const initialMkaAuthorizationState: MkaAuthorizationState = {
    authorizationLoadState: 'not-loaded',
    berechtigungstyp: 'NONE',
};

export const mkaAuthorizationFeature = createFeature({
    name: MKA_AUTHORIZATION_FEATURE_KEY,
    reducer: createReducer<MkaAuthorizationState>(
        initialMkaAuthorizationState,
        on(mkaAuthorizationActions.mkaAuthorizationLoaded, (state, action) => {
            const berechtigungstyp = resolveBerechtigungstyp(action.user);
            return { ...state, berechtigungstyp: berechtigungstyp, authorizationLoadState: 'loaded' };
        }),
        on(mkaAuthorizationActions.loadMkaAuthorizationFailed, state => {
            return { ...state, authorizationLoadState: 'failed' };
        }),
        on(mkaAuthorizationActions.userLoggedOut, () => {
            return initialMkaAuthorizationState;
        })
    ),
});
