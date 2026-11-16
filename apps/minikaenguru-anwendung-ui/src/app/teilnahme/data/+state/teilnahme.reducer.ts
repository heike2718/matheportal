import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Teilnahme } from '../../model/teilnahme.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { userLoggedOut } from '@matheportal/auth-api';
import { TeilnahmeActions } from './teilnahme.actions';
import { mapErrorToAuthorizedResourceLoadState } from '@matheportal/shared-utils';
import { lehrpersonBerechtigungVerweigert, schuleAusgewaehlt } from '../../../lehrperson/api/lehrperson-store.events';

const TEILNAHME_FEATURE_KEY = 'MKATeilnahme';

export interface TeilnahmeState {
    readonly teilnahmeLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
    readonly teilnahme: Teilnahme | undefined;
    readonly anmeldendePersonLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
}

export const initialTeilnahmeState: TeilnahmeState = {
    teilnahmeLoadState: 'not-loaded',
    teilnahme: undefined,
    anmeldendePersonLoadState: 'not-loaded',
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
        on(TeilnahmeActions.teilnahmeGeladen, TeilnahmeActions.teilnahmeAngemeldet, (state, { teilnahme }) => ({
            ...state,
            teilnahme,
            teilnahmeLoadState: 'loaded',
        })),
        on(TeilnahmeActions.teilnahmeLadenFailed, (state, { error }) => ({
            ...state,
            teilnahme: undefined,
            teilnahmeLoadState: mapErrorToAuthorizedResourceLoadState(error, true),
        })),
        on(TeilnahmeActions.anmeldendePersonGeladen, (state, { person }) => {
            if (state.teilnahme && state.teilnahme.kuerzel === person.schulkuerzel) {
                return {
                    ...state,
                    teilnahme: { ...state.teilnahme, angemeldetDurch: person },
                    anmeldendePersonLoadState: 'loaded',
                };
            }
            return state;
        }),
        on(TeilnahmeActions.anmeldendePersonLadenFailed, (state, { error }) => {
            const neueTeilnahme = !state.teilnahme ? undefined : { ...state.teilnahme, angemeldetDurch: undefined };

            return {
                ...state,
                teilnahme: neueTeilnahme,
                anmeldendePersonLoadState: mapErrorToAuthorizedResourceLoadState(error, true),
            };
        }),
        on(schuleAusgewaehlt, () => initialTeilnahmeState),
        on(lehrpersonBerechtigungVerweigert, () => initialTeilnahmeState),
        on(userLoggedOut, () => initialTeilnahmeState)
    ),
});
