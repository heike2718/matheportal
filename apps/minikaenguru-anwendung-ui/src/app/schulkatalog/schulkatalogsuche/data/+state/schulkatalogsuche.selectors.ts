import { createSelector } from '@ngrx/store';
import { schulkatalogsucheFeature } from './schulkatalogsuche.reducer';

const { selectSchulkatalogsucheState } = schulkatalogsucheFeature;

export const selectOrte = createSelector(selectSchulkatalogsucheState, state => state.orte);

export const selectSchulen = createSelector(selectSchulkatalogsucheState, state => state.schulen);

export const selectSelectedOrt = createSelector(selectSchulkatalogsucheState, state => state.selectedOrt);

export const selectSelectedSchule = createSelector(selectSchulkatalogsucheState, state => state.selectedSchule);
