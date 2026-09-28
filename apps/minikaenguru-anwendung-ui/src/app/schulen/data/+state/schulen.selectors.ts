import { createSelector } from '@ngrx/store';
import { schulenFeature } from './schulen.reducer';

const { selectMKASchulenState } = schulenFeature;

export const selectSchulen = createSelector(selectMKASchulenState, state => state.schulen);

export const selectSchulenLoaded = createSelector(
    selectMKASchulenState,
    state => state.schulenLoadingState === 'loaded'
);
