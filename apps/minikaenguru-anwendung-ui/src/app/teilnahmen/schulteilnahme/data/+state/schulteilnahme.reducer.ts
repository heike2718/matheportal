import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { userLoggedOut } from '@matheportal/auth-api';
import { mapErrorToAuthorizedResourceLoadState } from '@matheportal/shared-utils';
import {
    lehrpersonBerechtigungVerweigert,
    schuleAusgewaehlt,
} from '../../../../lehrperson/api/lehrperson-store.events';
import { Teilnahme } from '../../../model/teilnahme.model';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { Klasse } from '../../model/klasse.model';

const SCHULTEILNAHME_FEATURE_KEY = 'MKASchulteilnahme';

export interface SchulteilnahmeState {
    readonly teilnahmeLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
    readonly teilnahme: Teilnahme | undefined;
    readonly anmeldendePersonLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
    readonly klassen: Klasse[];
    readonly klassenLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
}

export const initialSchulteilnahmeState: SchulteilnahmeState = {
    teilnahmeLoadState: 'not-loaded',
    teilnahme: undefined,
    anmeldendePersonLoadState: 'not-loaded',
    klassen: [],
    klassenLoadState: 'not-loaded',
};

export const schulteilnahmeFeature = createFeature({
    name: SCHULTEILNAHME_FEATURE_KEY,
    reducer: createReducer<SchulteilnahmeState>(
        initialSchulteilnahmeState,
        on(SchulteilnahmeActions.schulteilnahmeLaden, (state, { schulkuerzel }) => {
            return (state.teilnahmeLoadState === 'loaded' && state.teilnahme?.kuerzel !== schulkuerzel) ||
                state.teilnahmeLoadState === 'technical-error'
                ? initialSchulteilnahmeState
                : state;
        }),
        on(
            SchulteilnahmeActions.teilnahmeGeladen,
            SchulteilnahmeActions.teilnahmeAngemeldet,
            (state, { teilnahme }) => ({
                ...state,
                teilnahme,
                teilnahmeLoadState: 'loaded',
            })
        ),
        on(SchulteilnahmeActions.teilnahmeLadenFailed, (state, { error }) => ({
            ...state,
            teilnahme: undefined,
            teilnahmeLoadState: mapErrorToAuthorizedResourceLoadState(error, true),
            anmeldendePersonLoadState: 'not-loaded',
            klassen: [],
            klassenLoadState: 'not-loaded',
        })),
        on(SchulteilnahmeActions.anmeldendePersonGeladen, (state, { person }) => {
            if (state.teilnahme && state.teilnahme.kuerzel === person.schulkuerzel) {
                return {
                    ...state,
                    teilnahme: { ...state.teilnahme, angemeldetDurch: person },
                    anmeldendePersonLoadState: 'loaded',
                };
            }
            return state;
        }),
        on(SchulteilnahmeActions.anmeldendePersonLadenFailed, (state, { schulkuerzel, error }) => {
            if (state.teilnahme === undefined || state.teilnahme.kuerzel !== schulkuerzel) {
                return state;
            }
            const neueTeilnahme = !state.teilnahme ? undefined : { ...state.teilnahme, angemeldetDurch: undefined };

            return {
                ...state,
                teilnahme: neueTeilnahme,
                anmeldendePersonLoadState: mapErrorToAuthorizedResourceLoadState(error, true),
            };
        }),
        on(SchulteilnahmeActions.klassenGeladen, (state, { schulkuerzel, klassen }) => {
            if (state.teilnahme && state.teilnahme.kuerzel === schulkuerzel) {
                return {
                    ...state,
                    klassen: klassen,
                    klassenLoadState: 'loaded',
                };
            }
            return state;
        }),
        on(SchulteilnahmeActions.klassenLadenFailed, (state, { schulkuerzel, error }) => {
            if (state.teilnahme === undefined || state.teilnahme.kuerzel !== schulkuerzel) {
                return state;
            }
            return {
                ...state,
                klassen: [],
                klassenLoadState: mapErrorToAuthorizedResourceLoadState(error, true),
            };
        }),
        on(schuleAusgewaehlt, () => initialSchulteilnahmeState),
        on(lehrpersonBerechtigungVerweigert, () => initialSchulteilnahmeState),
        on(userLoggedOut, () => initialSchulteilnahmeState)
    ),
});
