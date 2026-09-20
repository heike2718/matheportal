import { createFeature, createReducer, on } from '@ngrx/store';
import { Land, Ort, Schule, SCHULKATALOG_ADMIN_KONTEXT } from '../../model/schulkatalog.model';
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
        on(schulkatalogActions.backToLaenderRequested, state => ({
            ...state,
            orteLoadingState: 'not-loaded',
            orte: [],
            schulenLoadingState: 'not-loaded',
            schulen: [],
            selectedLand: undefined,
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
        on(schulkatalogActions.loadActionFailed, (state, action) => {
            const loadingState = mapErrorResourceLoadingState(action.error);
            switch (action.kontext) {
                case SCHULKATALOG_ADMIN_KONTEXT.laender:
                    return {
                        ...state,
                        laenderLoadingState: loadingState,
                        selectedLand: undefined,
                        orte: [],
                        orteLoadingState: 'not-loaded',
                        selectedOrt: undefined,
                        schulen: [],
                        schulenLoadingState: 'not-loaded',
                        selectedSchule: undefined,
                    };
                case SCHULKATALOG_ADMIN_KONTEXT.orte:
                    return {
                        ...state,
                        orteLoadingState: loadingState,
                        selectedOrt: undefined,
                        schulen: [],
                        schulenLoadingState: 'not-loaded',
                        selectedSchule: undefined,
                    };
                case SCHULKATALOG_ADMIN_KONTEXT.schulen:
                    return {
                        ...state,
                        schulenLoadingState: loadingState,
                        selectedSchule: undefined,
                    };
            }
        }),
        on(schulkatalogActions.backToOrteRequested, state => ({
            ...state,
            schulenLoadingState: 'not-loaded',
            schulen: [],
            selectedOrt: undefined,
            selectedSchule: undefined,
        })),
        on(schulkatalogActions.schuleUmbenennenRequested, (state, { schule }) => ({
            ...state,
            selectedSchule: schule,
        })),
        on(schulkatalogActions.resetSchulkatalog, userLoggedOut, () => initialSchulkatalogState)
    ),
});
