import { createFeature, createReducer, on } from '@ngrx/store';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { schulkatalogsucheActions } from './schulkatalogsuche.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { mapErrorResourceLoadingState } from '@matheportal/shared-utils';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';

const SCHULKATALOGSUCHE_FEATURE_KEY = 'MKASchulkatalogsuche';

export interface SchulkatalogsucheState {
    readonly orte: Ort[];
    readonly orteLoadingState: RESOURCE_LOAD_STATE;
    readonly selectedOrt: Ort | undefined;
    readonly schulen: Schule[];
    readonly schulenLoadingState: RESOURCE_LOAD_STATE;
    readonly selectedSchule: Schule | undefined;
}

export const initialSchulkatalogsucheState: SchulkatalogsucheState = {
    orte: [],
    orteLoadingState: 'not-loaded',
    selectedOrt: undefined,
    schulen: [],
    schulenLoadingState: 'not-loaded',
    selectedSchule: undefined,
};

export const schulkatalogsucheFeature = createFeature({
    name: SCHULKATALOGSUCHE_FEATURE_KEY,
    reducer: createReducer<SchulkatalogsucheState>(
        initialSchulkatalogsucheState,
        on(schulkatalogsucheActions.findOrteSucceeded, (state, { orte }) => ({
            ...state,
            orte,
            orteLoadingState: 'loaded',
            schulen: [],
            schulenLoadingState: 'not-loaded',
            selectedOrt: undefined,
            selectedSchule: undefined,
        })),
        on(schulkatalogsucheActions.findOrteFailed, (state, { error }) => {
            return { ...state, orteLoadingState: mapErrorResourceLoadingState(error), selectedOrt: undefined };
        }),
        on(schulkatalogsucheActions.ortSelected, (state, { ort }) => ({
            ...state,
            selectedOrt: ort,
            schulen: [],
            schulenLoadingState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(schulkatalogsucheActions.orteCleared, () => initialSchulkatalogsucheState),
        on(schulkatalogsucheActions.loadSchulenSucceeded, (state, { ortId, schulen }) => {
            if (state.selectedOrt?.kuerzel !== ortId) {
                return state;
            }
            return { ...state, schulen, schulenLoadingState: 'loaded', selectedSchule: undefined };
        }),
        on(schulkatalogsucheActions.loadSchulenFailed, (state, { error }) => {
            return {
                ...state,
                schulenLoadingState: mapErrorResourceLoadingState(error),
                selectedSchule: undefined,
            };
        }),
        on(schulkatalogsucheActions.schuleSelected, (state, { schule }) => {
            if (state.selectedOrt?.kuerzel !== schule.ort.kuerzel) {
                return state;
            }
            return {
                ...state,
                selectedSchule: schule,
            };
        }),
        on(schulkatalogsucheActions.schulenCleared, state => ({
            ...state,
            schulen: [],
            schulenLoadingState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(schulkatalogsucheActions.resetSuche, () => initialSchulkatalogsucheState),
        on(userLoggedOut, () => initialSchulkatalogsucheState)
    ),
});
