import { createSelector } from '@ngrx/store';
import { wettbewerbsdurchfuehrendeFeature } from './wettbewerbsdurchfuehrende.reducer';

const { selectMKAWettbewerbsdurchfuehrendeState } = wettbewerbsdurchfuehrendeFeature;

const selectDurchfuehrender = createSelector(selectMKAWettbewerbsdurchfuehrendeState, state => state.durchfuehrender);

const selectDurchfuehrenderLoadState = createSelector(
    selectMKAWettbewerbsdurchfuehrendeState,
    state => state.durchfuehrenderLoadState
);

const selectDurchfuehrenderGeladen = createSelector(
    selectDurchfuehrenderLoadState,
    loadState => loadState === 'loaded'
);

export const fromWettbewerbsdurchfuehrender = {
    selectDurchfuehrender,
    selectDurchfuehrenderLoadState,
    selectDurchfuehrenderGeladen,
};
