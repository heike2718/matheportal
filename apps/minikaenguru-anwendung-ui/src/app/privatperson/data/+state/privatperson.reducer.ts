import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { PrivatpersonWettbewerbskontext } from '../../model/privatperson.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { userLoggedOut } from '@matheportal/auth-api';
import { PrivatpersonActions } from './privatperson.actions';
import { mapErrorToAuthorizedResourceLoadState } from '@matheportal/shared-utils';

export const PRIVATPERSON_FEATURE_KEY = 'MKAPrivatperson';

export interface PrivatpersonState {
    wettbewerbskontextLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
    wettbewerbskontext: PrivatpersonWettbewerbskontext | undefined;
}

export const initialPrivatpersonState: PrivatpersonState = {
    wettbewerbskontextLoadState: 'not-loaded',
    wettbewerbskontext: undefined,
};

export const privatpersonFeature = createFeature({
    name: PRIVATPERSON_FEATURE_KEY,
    reducer: createReducer<PrivatpersonState>(
        initialPrivatpersonState,
        on(PrivatpersonActions.wettbewerbskontextLaden, state => {
            return state.wettbewerbskontextLoadState === 'loaded' ||
                state.wettbewerbskontextLoadState === 'technical-error'
                ? initialPrivatpersonState
                : state;
        }),
        on(PrivatpersonActions.wettbewerbskontextGeladen, (state, { wettbewerbskontext }) => ({
            ...state,
            wettbewerbskontext,
            wettbewerbskontextLoadState: 'loaded',
        })),
        on(PrivatpersonActions.wettbewerbskontextLadenFailed, (state, { error }) => ({
            ...state,
            wettbewerbskontext: undefined,
            wettbewerbskontextLoadState: mapErrorToAuthorizedResourceLoadState(error),
        })),
        on(userLoggedOut, () => initialPrivatpersonState)
    ),
});
