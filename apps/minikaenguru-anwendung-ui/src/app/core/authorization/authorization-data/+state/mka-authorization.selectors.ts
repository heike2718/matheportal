import { createSelector } from '@ngrx/store';
import { mkaAuthorizationFeature } from './mka-authorization.reducer';

const { selectMKAAuthorizationState } = mkaAuthorizationFeature;

const berechtigungstyp = createSelector(selectMKAAuthorizationState, state => state.berechtigungstyp);
const authorizationLoadState = createSelector(selectMKAAuthorizationState, state => state.authorizationLoadState);

export const fromMkaAuthorization = {
    berechtigungstyp: berechtigungstyp,
    authorizationLoadState,
};
