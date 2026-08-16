import { createFeature, createReducer, on } from '@ngrx/store';
import { Land, Ort, Schule, SCHULKATALOG_LOADING_STATE } from '../../model/schulkatalog.model';
import { schulkatalogActions } from './schulkatalog.actions';

const SCHULKATALOG_FEATURE_KEY = 'MKAdminSchulkatalog';

export interface SchulkatalogState {
    readonly laender: Land[];
    readonly laenderLoadingState: SCHULKATALOG_LOADING_STATE;
    readonly selectedLand: Land | undefined;
    readonly orte: Ort[];
    readonly orteLoadingState: SCHULKATALOG_LOADING_STATE;
    readonly selectedOrt: Ort | undefined;
    readonly schulen: Schule[];
    readonly schulenLoadingState: SCHULKATALOG_LOADING_STATE;
    readonly selectedSchule: Schule | undefined;
}

export const initialSchulkatalogState: SchulkatalogState = {
    laender: [],
    laenderLoadingState: 'not-loaded',
    selectedLand: undefined,
    orte: [],
    orteLoadingState: 'not-loaded',
    selectedOrt: undefined,
    schulen: [],
    schulenLoadingState: 'not-loaded',
    selectedSchule: undefined,
};

export const schulkatalogFeature = createFeature({
    name: SCHULKATALOG_FEATURE_KEY,
    reducer: createReducer<SchulkatalogState>(
        initialSchulkatalogState,
        on(schulkatalogActions.loadLaenderSucceeded, (state, { laender }) => ({
            ...state,
            laender: laender,
            laenderLoadingState: 'loaded',
            selectedLand: undefined,
            orte: [],
            orteLoadingState: 'not-loaded',
            selectedOrt: undefined,
            schulen: [],
            schulenLoadingState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(schulkatalogActions.loadLaenderFailed, (state, { error }) => ({ ...state })),
        on(schulkatalogActions.landSelected, (state, { land }) => ({ ...state })),
        on(schulkatalogActions.loadOrteSucceeded, (state, { orte }) => ({ ...state })),
        on(schulkatalogActions.loadOrteFailed, (state, { error }) => ({ ...state })),
        on(schulkatalogActions.ortSelected, (state, { ort }) => ({ ...state })),
        on(schulkatalogActions.loadSchulenSucceeded, (state, { schulen }) => ({ ...state })),
        on(schulkatalogActions.loadSchulenFailed, (state, { error }) => ({ ...state })),
        on(schulkatalogActions.schuleSelected, (state, { schule }) => ({ ...state })),
        on(schulkatalogActions.resetSchulkatalog, state => initialSchulkatalogState)
    ),
});
