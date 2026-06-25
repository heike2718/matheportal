import { createFeature, createReducer, on } from '@ngrx/store';
import {
    AuthorizationLoadState,
    MKA_AUTHORIZATION_FEATURE_KEY,
    resolveVeranstaltertyp,
    Veranstaltertyp,
} from '../../authorization-model';
import { mkaAuthorizationActions } from './mka-authorization.actions';

export interface MkaAuthorizationState {
    readonly authorizationLoadState: AuthorizationLoadState;
    readonly veranstaltertyp: Veranstaltertyp;
}

const initialMkaAuthorizationState: MkaAuthorizationState = {
    authorizationLoadState: 'not-loaded',
    veranstaltertyp: 'NONE',
};

export const mkaAuthorizationFeature = createFeature({
    name: MKA_AUTHORIZATION_FEATURE_KEY,
    reducer: createReducer<MkaAuthorizationState>(
        initialMkaAuthorizationState,
        on(mkaAuthorizationActions.mkaAuthorizationLoaded, (state, action) => {
            const veranstaltertyp = resolveVeranstaltertyp(action.user);
            return { ...state, veranstaltertyp: veranstaltertyp, authorizationLoadState: 'loaded' };
        }),
        on(mkaAuthorizationActions.loadMkaAuthorizationFailed, state => {
            return { ...state, authorizationLoadState: 'failed' };
        }),
        on(mkaAuthorizationActions.userLoggedOut, () => {
            return initialMkaAuthorizationState;
        })
    ),
});
