import { createSelector } from '@ngrx/store';
import { wettbewerbFeature } from './wettbewerb.reducer';
import { WETTBEWERBSSTATUS } from '../../model/wettbewerb.model';

const { selectMKAWettbewerbState } = wettbewerbFeature;

const selectWettbewerb = createSelector(selectMKAWettbewerbState, state => state.wettbewerb);

const selectWettbewerbRunning = createSelector(
    selectWettbewerb,
    wettbewerb =>
        wettbewerb !== undefined &&
        (wettbewerb.status === WETTBEWERBSSTATUS.anmeldung ||
            wettbewerb.status === WETTBEWERBSSTATUS.downloadSchule ||
            wettbewerb.status === WETTBEWERBSSTATUS.downloadPrivat)
);

export const fromWettbewerb = {
    selectWettbewerb,
    selectWettbewerbRunning,
};
