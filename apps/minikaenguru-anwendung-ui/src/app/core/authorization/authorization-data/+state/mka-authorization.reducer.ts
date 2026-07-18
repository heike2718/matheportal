import { createFeature, createReducer, on } from '@ngrx/store';
import {
    AuthorizationLoadState,
    MKA_AUTHORIZATION_FEATURE_KEY,
    MinikaenguruBerechtigungstyp,
    MINIKAENGURU_BERECHTIGUNGSTYP,
} from '../../authorization-model';
import { mkaAuthorizationActions } from './mka-authorization.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { resolveBerechtigungstyp } from '../mka-authorization.utils';

export interface MkaAuthorizationState {
    readonly authorizationLoadState: AuthorizationLoadState;
    readonly berechtigungstyp: MinikaenguruBerechtigungstyp;
}

const initialMkaAuthorizationState: MkaAuthorizationState = {
    authorizationLoadState: 'not-loaded',
    berechtigungstyp: MINIKAENGURU_BERECHTIGUNGSTYP.none,
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
        on(userLoggedOut, () => initialMkaAuthorizationState)
    ),
});
