import { createFeature, createReducer, on } from '@ngrx/store';
import { Land, Ort, Schule, SCHULKATALOG_ADMIN_KONTEXT } from '../../model/schulkatalog.model';
import { SchulkatalogActions } from './schulkatalog.actions';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { mapErrorToResourceLoadState } from '@matheportal/shared-utils';
import { userLoggedOut } from '@matheportal/auth-api';

const SCHULKATALOG_FEATURE_KEY = 'MKAdminSchulkatalog';

export interface SchulkatalogState {
    readonly laender: Land[];
    readonly laenderLoadState: RESOURCE_LOAD_STATE;
    readonly selectedLand: Land | undefined;
    readonly orte: Ort[];
    readonly orteLoadState: RESOURCE_LOAD_STATE;
    readonly selectedOrt: Ort | undefined;
    readonly schulen: Schule[];
    readonly schulenLoadState: RESOURCE_LOAD_STATE;
    readonly selectedSchule: Schule | undefined;
}

export const initialSchulkatalogState: SchulkatalogState = {
    laender: [],
    laenderLoadState: 'not-loaded',
    selectedLand: undefined,
    orte: [],
    orteLoadState: 'not-loaded',
    selectedOrt: undefined,
    schulen: [],
    schulenLoadState: 'not-loaded',
    selectedSchule: undefined,
};

export const schulkatalogFeature = createFeature({
    name: SCHULKATALOG_FEATURE_KEY,
    reducer: createReducer<SchulkatalogState>(
        initialSchulkatalogState,
        on(SchulkatalogActions.loadLaender, () => initialSchulkatalogState),
        on(SchulkatalogActions.loadLaenderSucceeded, (state, { laender }) => ({
            ...state,
            laender: laender,
            laenderLoadState: 'loaded',
            selectedLand: undefined,
            orte: [],
            orteLoadState: 'not-loaded',
            selectedOrt: undefined,
            schulen: [],
            schulenLoadState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(SchulkatalogActions.landSelected, (state, { land }) => ({
            ...state,
            selectedLand: land,
            orte: [],
            orteLoadState: 'not-loaded',
            selectedOrt: undefined,
            schulen: [],
            schulenLoadState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(SchulkatalogActions.loadOrte, state => ({
            ...state,
            orte: [],
            orteLoadState: 'not-loaded',
            selectedOrt: undefined,
            schulen: [],
            schulenLoadState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(SchulkatalogActions.loadOrteSucceeded, (state, { orte }) => ({
            ...state,
            orte: orte,
            orteLoadState: 'loaded',
        })),
        on(SchulkatalogActions.backToLaenderRequested, state => ({
            ...state,
            orteLoadState: 'not-loaded',
            orte: [],
            schulenLoadState: 'not-loaded',
            schulen: [],
            selectedLand: undefined,
            selectedOrt: undefined,
        })),
        on(SchulkatalogActions.ortSelected, (state, { ort }) => ({
            ...state,
            selectedOrt: ort,
            schulen: [],
            schulenLoadState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(SchulkatalogActions.loadSchulen, state => ({
            ...state,
            schulen: [],
            schulenLoadState: 'not-loaded',
            selectedSchule: undefined,
        })),
        on(SchulkatalogActions.loadSchulenSucceeded, (state, { schulen }) => ({
            ...state,
            schulen: schulen,
            schulenLoadState: 'loaded',
        })),
        on(SchulkatalogActions.loadActionFailed, (state, action) => {
            const LoadState = mapErrorToResourceLoadState(action.error);
            switch (action.kontext) {
                case SCHULKATALOG_ADMIN_KONTEXT.laender:
                    return {
                        ...state,
                        laenderLoadState: LoadState,
                        selectedLand: undefined,
                        orte: [],
                        orteLoadState: 'not-loaded',
                        selectedOrt: undefined,
                        schulen: [],
                        schulenLoadState: 'not-loaded',
                        selectedSchule: undefined,
                    };
                case SCHULKATALOG_ADMIN_KONTEXT.orte:
                    return {
                        ...state,
                        orteLoadState: LoadState,
                        selectedOrt: undefined,
                        schulen: [],
                        schulenLoadState: 'not-loaded',
                        selectedSchule: undefined,
                    };
                case SCHULKATALOG_ADMIN_KONTEXT.schulen:
                    return {
                        ...state,
                        schulenLoadState: LoadState,
                        selectedSchule: undefined,
                    };
            }
        }),
        on(SchulkatalogActions.backToOrteRequested, state => ({
            ...state,
            schulenLoadState: 'not-loaded',
            schulen: [],
            selectedOrt: undefined,
            selectedSchule: undefined,
        })),
        on(SchulkatalogActions.schuleUmbenennenRequested, (state, { schule }) => ({
            ...state,
            selectedSchule: schule,
        })),
        on(SchulkatalogActions.resetSchulkatalog, userLoggedOut, () => initialSchulkatalogState)
    ),
});
