import { createFeature, createReducer, on } from '@ngrx/store';
import { Land, Ort, Schule } from '../../model/schulkatalog.model';
import { schulkatalogActions } from './schulkatalog.actions';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { mapErrorResourceLoadingState } from '@matheportal/shared-utils';
import { userLoggedOut } from '@matheportal/auth-api';

const SCHULKATALOG_FEATURE_KEY = 'MKAdminSchulkatalog';

export interface SchulkatalogState {
    readonly laender: Land[];
    readonly laenderLoadingState: RESOURCE_LOAD_STATE;
    readonly selectedLand: Land | undefined;
    readonly orte: Ort[];
    readonly orteLoadingState: RESOURCE_LOAD_STATE;
    readonly selectedOrt: Ort | undefined;
    readonly schulen: Schule[];
    readonly schulenLoadingState: RESOURCE_LOAD_STATE;
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
        on(schulkatalogActions.loadLaender, () => initialSchulkatalogState),
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
        on(schulkatalogActions.loadLaenderFailed, (state, { error }) => ({
            ...state,
            laenderLoadingState: mapErrorResourceLoadingState(error),
            selectedLand: undefined,
            orte: [],
            orteLoadingState: 'not-loaded',
            selectedOrt: undefined,
            schulen: [],
            schulenLoadingState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(schulkatalogActions.landSelected, (state, { land }) => ({
            ...state,
            selectedLand: land,
            orte: [],
            orteLoadingState: 'not-loaded',
            selectedOrt: undefined,
            schulen: [],
            schulenLoadingState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(schulkatalogActions.loadOrte, state => ({
            ...state,
            orte: [],
            orteLoadingState: 'not-loaded',
            selectedOrt: undefined,
            schulen: [],
            schulenLoadingState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(schulkatalogActions.loadOrteSucceeded, (state, { orte }) => ({
            ...state,
            orte: orte,
            orteLoadingState: 'loaded',
        })),
        on(schulkatalogActions.loadOrteFailed, (state, { error }) => ({
            ...state,
            orteLoadingState: mapErrorResourceLoadingState(error),
            selectedOrt: undefined,
            schulen: [],
            schulenLoadingState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(schulkatalogActions.backToLaenderRequested, state => ({
            ...state,
            orteLoadingState: 'not-loaded',
            orte: [],
            selectedOrt: undefined,
        })),
        on(schulkatalogActions.ortSelected, (state, { ort }) => ({
            ...state,
            selectedOrt: ort,
            schulen: [],
            schulenLoadingState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(schulkatalogActions.loadSchulen, state => ({
            ...state,
            schulen: [],
            schulenLoadingState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(schulkatalogActions.loadSchulenSucceeded, (state, { schulen }) => ({
            ...state,
            schulen: schulen,
            schulenLoadingState: 'loaded',
        })),
        on(schulkatalogActions.loadSchulenFailed, (state, { error }) => ({
            ...state,
            schulenLoadingState: mapErrorResourceLoadingState(error),
            selectedSchule: undefined,
        })),
        on(schulkatalogActions.backToOrteRequested, state => ({
            ...state,
            schulenLoadingState: 'not-loaded',
            schulen: [],
            selectedSchule: undefined,
        })),
        on(schulkatalogActions.schuleUmbenennenSelected, (state, { schule }) => ({ ...state, selectedSchule: schule })),
        on(schulkatalogActions.resetSchulkatalog, userLoggedOut, () => initialSchulkatalogState)
    ),
});
