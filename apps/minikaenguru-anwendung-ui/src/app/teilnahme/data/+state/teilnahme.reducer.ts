import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Teilnahme } from '../../model/teilnahme.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { userLoggedOut } from '@matheportal/auth-api';
import { TeilnahmeActions } from './teilnahme.actions';
import { mapErrorToAuthorizedResourceLoadState } from '@matheportal/shared-utils';

const TEILNAHME_FEATURE_KEY = 'MKATeilnahme';

export interface TeilnahmeState {
    teilnahmeLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
    teilnahme: Teilnahme | undefined;
}

export const initialTeilnahmeState: TeilnahmeState = {
    teilnahmeLoadState: 'not-loaded',
    teilnahme: undefined,
};

export const teilnahmeFeature = createFeature({
    name: TEILNAHME_FEATURE_KEY,
    reducer: createReducer<TeilnahmeState>(
        initialTeilnahmeState,
        on(TeilnahmeActions.privatteilnahmeLaden, state => {
            return state.teilnahmeLoadState === 'loaded' || state.teilnahmeLoadState === 'technical-error'
                ? initialTeilnahmeState
                : state;
        }),
        on(TeilnahmeActions.schulteilnahmeLaden, (state, { schulkuerzel }) => {
            return (state.teilnahmeLoadState === 'loaded' && state.teilnahme?.kuerzel !== schulkuerzel) ||
                state.teilnahmeLoadState === 'technical-error'
                ? initialTeilnahmeState
                : state;
        }),
        on(TeilnahmeActions.teilnahmeGeladen, (state, { teilnahme }) => ({
            ...state,
            teilnahme,
            teilnahmeLoadState: 'loaded',
        })),
        on(TeilnahmeActions.teilnahmeLadenFailed, (state, { error }) => ({
            ...state,
            teilnahme: undefined,
            teilnahmeLoadState: mapErrorToAuthorizedResourceLoadState(error, true),
        })),
        on(userLoggedOut, () => initialTeilnahmeState)
    ),
});
