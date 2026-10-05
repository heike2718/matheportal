import { createFeature, createReducer, on } from '@ngrx/store';
import { Ort, Schule } from '../../../../core/model/schulkatalog.model';
import { SchulkatalogsucheActions } from './schulkatalogsuche.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { mapErrorToResourceLoadState } from '@matheportal/shared-utils';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';

const SCHULKATALOGSUCHE_FEATURE_KEY = 'MKASchulkatalogsuche';

export interface SchulkatalogsucheState {
    readonly orte: Ort[];
    readonly orteLoadState: RESOURCE_LOAD_STATE;
    readonly selectedOrt: Ort | undefined;
    readonly schulen: Schule[];
    readonly schulenLoadState: RESOURCE_LOAD_STATE;
    readonly selectedSchule: Schule | undefined;
}

export const initialSchulkatalogsucheState: SchulkatalogsucheState = {
    orte: [],
    orteLoadState: 'not-loaded',
    selectedOrt: undefined,
    schulen: [],
    schulenLoadState: 'not-loaded',
    selectedSchule: undefined,
};

export const schulkatalogsucheFeature = createFeature({
    name: SCHULKATALOGSUCHE_FEATURE_KEY,
    reducer: createReducer<SchulkatalogsucheState>(
        initialSchulkatalogsucheState,
        on(SchulkatalogsucheActions.findOrteSucceeded, (state, { orte }) => ({
            ...state,
            orte,
            orteLoadState: 'loaded',
            schulen: [],
            schulenLoadState: 'not-loaded',
            selectedOrt: undefined,
            selectedSchule: undefined,
        })),
        on(SchulkatalogsucheActions.findOrteFailed, (state, { error }) => {
            return { ...state, orteLoadState: mapErrorToResourceLoadState(error), selectedOrt: undefined };
        }),
        on(SchulkatalogsucheActions.ortSelected, (state, { ort }) => ({
            ...state,
            selectedOrt: ort,
            schulen: [],
            schulenLoadState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(SchulkatalogsucheActions.orteCleared, () => initialSchulkatalogsucheState),
        on(SchulkatalogsucheActions.loadSchulenSucceeded, (state, { ortId, schulen }) => {
            if (state.selectedOrt?.kuerzel !== ortId) {
                return state;
            }
            return { ...state, schulen, schulenLoadState: 'loaded', selectedSchule: undefined };
        }),
        on(SchulkatalogsucheActions.loadSchulenFailed, (state, { error }) => {
            return {
                ...state,
                schulenLoadState: mapErrorToResourceLoadState(error),
                selectedSchule: undefined,
            };
        }),
        on(SchulkatalogsucheActions.schuleSelected, (state, { schule }) => {
            if (state.selectedOrt?.kuerzel !== schule.ort.kuerzel) {
                return state;
            }
            return {
                ...state,
                selectedSchule: schule,
            };
        }),
        on(SchulkatalogsucheActions.schulenCleared, state => ({
            ...state,
            schulen: [],
            schulenLoadState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(SchulkatalogsucheActions.resetSuche, () => initialSchulkatalogsucheState),
        on(userLoggedOut, () => initialSchulkatalogsucheState)
    ),
});
