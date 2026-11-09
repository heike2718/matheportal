import { createSelector } from '@ngrx/store';
import { teilnahmeFeature } from './teilnahme.reducer';

const { selectMKATeilnahmeState } = teilnahmeFeature;

export const selectTeilnahmeLoadState = createSelector(selectMKATeilnahmeState, state => state.teilnahmeLoadState);

export const selectTeilnahme = createSelector(selectMKATeilnahmeState, state => state.teilnahme);
