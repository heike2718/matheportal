import { createSelector } from '@ngrx/store';
import { mkaAuthorizationFeature } from './mka-authorization.reducer';

const { selectMkaAuthorizationState } = mkaAuthorizationFeature;

const veranstalterTyp = createSelector(selectMkaAuthorizationState, state => state.veranstaltertyp);
const authorizationLoadState = createSelector(selectMkaAuthorizationState, state => state.authorizationLoadState);

export const fromMkaAuthorization = {
    veranstalterTyp,
    authorizationLoadState,
};
