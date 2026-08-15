import { createSelector } from '@ngrx/store';
import { wettbewerbsdurchfuehrendeFeature } from './wettbewerbsdurchfuehrende.reducer';
import { assertDefined } from '@matheportal/shared-utils';

const { selectMKAWettbewerbsdurchfuehrendeState } = wettbewerbsdurchfuehrendeFeature;

const wettbewerbsdurchfuehrender = createSelector(
    selectMKAWettbewerbsdurchfuehrendeState,
    state => state.wettbewerbsdurchfuehrender
);

const definedWettbewerbsdurchfuehrender = createSelector(wettbewerbsdurchfuehrender, wettbewerbsdurchfuehrender => {
    return assertDefined(wettbewerbsdurchfuehrender, 'erwarten, dass wettbewerbsdurchfuehrender defined ist');
});

export const fromWettbewerbsdurchfuehrender = {
    definedWettbewerbsdurchfuehrender,
};
