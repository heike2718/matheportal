import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { userLoggedOut } from '@matheportal/auth-api';
import { mapErrorToAuthorizedResourceLoadState } from '@matheportal/shared-utils';
import { Teilnahme } from '../../../model/teilnahme.model';
import { PrivatteilnahmeActions } from './privatteilnahme.actions';

const PRIVATTEILNAHME_FEATURE_KEY = 'MKAPrivatteilnahme';

export interface PrivatteilnahmeState {
    readonly teilnahmeLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
    readonly teilnahme: Teilnahme | undefined;
}

export const initialPrivatteilnahmeState: PrivatteilnahmeState = {
    teilnahmeLoadState: 'not-loaded',
    teilnahme: undefined,
};

export const privatteilnahmeFeature = createFeature({
    name: PRIVATTEILNAHME_FEATURE_KEY,
    reducer: createReducer<PrivatteilnahmeState>(
        initialPrivatteilnahmeState,
        on(PrivatteilnahmeActions.privatteilnahmeLaden, state => {
            return state.teilnahmeLoadState === 'loaded' || state.teilnahmeLoadState === 'technical-error'
                ? initialPrivatteilnahmeState
                : state;
        }),
        on(
            PrivatteilnahmeActions.teilnahmeGeladen,
            PrivatteilnahmeActions.teilnahmeAngemeldet,
            (state, { teilnahme }) => ({
                ...state,
                teilnahme,
                teilnahmeLoadState: 'loaded',
            })
        ),
        on(PrivatteilnahmeActions.teilnahmeLadenFailed, (state, { error }) => ({
            ...state,
            teilnahme: undefined,
            teilnahmeLoadState: mapErrorToAuthorizedResourceLoadState(error, true),
        })),
        on(userLoggedOut, () => initialPrivatteilnahmeState)
    ),
});
