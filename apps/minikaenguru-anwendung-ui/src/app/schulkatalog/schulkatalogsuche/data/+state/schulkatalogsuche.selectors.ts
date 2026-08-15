import { createSelector } from '@ngrx/store';
import { schulkatalogsucheFeature } from './schulkatalogsuche.reducer';
import { getBeschreibungSelectedOrt } from '../schulkatalogsuche-data.utils';

const { selectMKASchulkatalogsucheState } = schulkatalogsucheFeature;

export const selectOrte = createSelector(selectMKASchulkatalogsucheState, state => state.orte);

export const selectSchulen = createSelector(selectMKASchulkatalogsucheState, state => state.schulen);

export const selectSelectedOrt = createSelector(selectMKASchulkatalogsucheState, state => state.selectedOrt);

export const selectNameSelectedOrt = createSelector(selectSelectedOrt, ort =>
    ort === undefined ? '' : getBeschreibungSelectedOrt(ort)
);

export const selectSelectedSchule = createSelector(selectMKASchulkatalogsucheState, state => state.selectedSchule);

export const orteLoaded = createSelector(selectMKASchulkatalogsucheState, state => state.orteLoadingState === 'loaded');

export const schulenLoaded = createSelector(
    selectMKASchulkatalogsucheState,
    state => state.schulenLoadingState === 'loaded'
);

export const ortSelected = createSelector(selectMKASchulkatalogsucheState, state => state.selectedOrt !== undefined);

export const schuleSelected = createSelector(
    selectMKASchulkatalogsucheState,
    state => state.selectedSchule !== undefined
);

export const fromSchulkatalogsuche = {
    selectOrte,
    selectSchulen,
    selectSelectedOrt,
    selectNameSelectedOrt,
    selectSelectedSchule,
    orteLoaded,
    schulenLoaded,
    ortSelected,
    schuleSelected,
};
