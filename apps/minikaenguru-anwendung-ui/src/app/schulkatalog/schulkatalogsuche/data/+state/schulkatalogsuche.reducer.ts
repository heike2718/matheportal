import { createFeature, createReducer, on } from '@ngrx/store';
import { Ort, Schule, SCHULKATALOG_LOADING_STATE } from '../../model/schulkatalog.model';
import { schulkatalogsucheActions } from './schulkatalogsuche.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { mapErrorToSchulkatalogLoadingState } from '../schulkatalogsuche-data.utils';

const SCHULKATALOGSUCHE_FEATURE_KEY = 'Schulkatalogsuche';

export interface SchulkatalogsucheState {
    readonly orte: Ort[];
    readonly orteLoadingState: SCHULKATALOG_LOADING_STATE;
    readonly selectedOrt: Ort | undefined;
    readonly schulen: Schule[];
    readonly schulenLoadingState: SCHULKATALOG_LOADING_STATE;
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
            return { ...state, orteLoadingState: mapErrorToSchulkatalogLoadingState(error), selectedOrt: undefined };
        }),
        on(schulkatalogsucheActions.ortSelected, (state, { ort }) => ({
            ...state,
            selectedOrt: ort,
            schulen: [],
            selectedSchule: undefined,
        })),
        on(schulkatalogsucheActions.loadSchulenSucceeded, (state, { ortId, schulen }) => {
            if (state.selectedOrt?.kuerzel !== ortId) {
                return state;
            }
            return { ...state, schulen, schulenLoadingState: 'loaded', selectedSchule: undefined };
        }),
        on(schulkatalogsucheActions.loadSchulenFailed, (state, { error }) => {
            return {
                ...state,
                schulenLoadingState: mapErrorToSchulkatalogLoadingState(error),
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
        on(schulkatalogsucheActions.resetSuche, () => initialSchulkatalogsucheState),
        on(userLoggedOut, () => initialSchulkatalogsucheState)
    ),
});
