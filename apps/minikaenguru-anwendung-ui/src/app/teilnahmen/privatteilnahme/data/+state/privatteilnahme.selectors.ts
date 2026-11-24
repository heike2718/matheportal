import { createSelector } from '@ngrx/store';
import { privatteilnahmeFeature } from './privatteilnahme.reducer';

const { selectMKAPrivatteilnahmeState } = privatteilnahmeFeature;

export const selectTeilnahmeLoadState = createSelector(
    selectMKAPrivatteilnahmeState,
    state => state.teilnahmeLoadState
);

export const selectTeilnahme = createSelector(selectMKAPrivatteilnahmeState, state => state.teilnahme);

export const selectAktuelleTeilnahmeLoaded = createSelector(
    selectTeilnahmeLoadState,
    loadState => loadState === 'loaded' || loadState === 'not-found'
);

export const selectAngemeldet = createSelector(selectTeilnahme, teilnahme => teilnahme !== undefined);
