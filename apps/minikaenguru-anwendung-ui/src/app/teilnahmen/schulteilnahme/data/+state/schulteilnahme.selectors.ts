import { createSelector } from '@ngrx/store';
import { schulteilnahmeFeature } from './schulteilnahme.reducer';

const { selectMKASchulteilnahmeState } = schulteilnahmeFeature;

export const selectTeilnahmeLoadState = createSelector(selectMKASchulteilnahmeState, state => state.teilnahmeLoadState);

export const selectTeilnahme = createSelector(selectMKASchulteilnahmeState, state => state.teilnahme);

export const selectAktuelleTeilnahmeLoaded = createSelector(
    selectTeilnahmeLoadState,
    loadState => loadState === 'loaded' || loadState === 'not-found'
);

export const selectAngemeldet = createSelector(selectTeilnahme, teilnahme => teilnahme !== undefined);

export const selectAnmeldendePersonLoadState = createSelector(
    selectMKASchulteilnahmeState,
    state => state.anmeldendePersonLoadState
);
