import { createSelector } from '@ngrx/store';
import { wettbewerbsdurchfuehrendeFeature } from './wettbewerbsdurchfuehrende.reducer';

const { selectMKAWettbewerbsdurchfuehrendeState } = wettbewerbsdurchfuehrendeFeature;

const wettbewerbsdurchfuehrender = createSelector(
    selectMKAWettbewerbsdurchfuehrendeState,
    state => state.wettbewerbsdurchfuehrender
);

export const fromWettbewerbsdurchfuehrender = {
    wettbewerbsdurchfuehrender,
};
