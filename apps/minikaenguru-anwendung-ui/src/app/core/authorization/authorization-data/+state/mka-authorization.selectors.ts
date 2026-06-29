import { createSelector } from '@ngrx/store';
import { mkaAuthorizationFeature } from './mka-authorization.reducer';

const { selectMkaAuthorizationState } = mkaAuthorizationFeature;

const berechtigungstyp = createSelector(selectMkaAuthorizationState, state => state.berechtigungstyp);
const authorizationLoadState = createSelector(selectMkaAuthorizationState, state => state.authorizationLoadState);

export const fromMkaAuthorization = {
    berechtigungstyp: berechtigungstyp,
    authorizationLoadState,
};
