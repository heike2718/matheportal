import { createSelector } from '@ngrx/store';
import { schulkatalogFeature } from './schulkatalog.reducer';
import { getBeschreibungSelectedOrt } from '../schulkatalog-data.utils';

const { selectMKAdminSchulkatalogState } = schulkatalogFeature;

const selectLaender = createSelector(selectMKAdminSchulkatalogState, state => state.laender);

const selectLaenderLoadad = createSelector(
    selectMKAdminSchulkatalogState,
    state => state.laenderLoadingState === 'loaded'
);

const selectSelectedLand = createSelector(selectMKAdminSchulkatalogState, state => state.selectedLand);

const selectLandSelected = createSelector(selectSelectedLand, land => land !== undefined);

const selectOrte = createSelector(selectMKAdminSchulkatalogState, state => state.orte);

const selectOrteLoaded = createSelector(selectMKAdminSchulkatalogState, state => state.orteLoadingState === 'loaded');

const selectSelectedOrt = createSelector(selectMKAdminSchulkatalogState, state => state.selectedOrt);

const selectOrtSelected = createSelector(selectSelectedOrt, ort => ort !== undefined);

const selectBeschreibungSelectedOrt = createSelector(selectMKAdminSchulkatalogState, state =>
    getBeschreibungSelectedOrt(state.selectedOrt)
);

const selectSchulen = createSelector(selectMKAdminSchulkatalogState, state => state.schulen);

const selectSchulenLoaded = createSelector(
    selectMKAdminSchulkatalogState,
    state => state.schulenLoadingState === 'loaded'
);

const selectSelectedSchule = createSelector(selectMKAdminSchulkatalogState, state => state.selectedSchule);

const selectSchuleSelected = createSelector(selectSelectedSchule, schule => schule !== undefined);

export const fromSchulkatalog = {
    selectLaender,
    selectLaenderLoadad,
    selectLandSelected,
    selectSelectedLand,
    selectOrte,
    selectOrteLoaded,
    selectOrtSelected,
    selectSelectedOrt,
    selectBeschreibungSelectedOrt,
    selectSchulen,
    selectSchulenLoaded,
    selectSchuleSelected,
    selectSelectedSchule,
};
