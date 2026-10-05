import { createSelector } from '@ngrx/store';
import { wettbewerbFeature } from './wettbewerb.reducer';
import { WETTBEWERBSSTATUS } from '../../model/wettbewerb.model';

const { selectMKAWettbewerbState } = wettbewerbFeature;

const selectWettbewerb = createSelector(selectMKAWettbewerbState, state => state.wettbewerb);

const selectWettbewerbLoadState = createSelector(selectMKAWettbewerbState, state => state.wettbewerbLoadState);

const selectWettbewerbLoaded = createSelector(selectWettbewerbLoadState, loadState => loadState === 'loaded');

const selectWettbewerbRunning = createSelector(
    selectWettbewerb,
    wettbewerb =>
        wettbewerb !== undefined &&
        (wettbewerb.status === WETTBEWERBSSTATUS.anmeldung ||
            wettbewerb.status === WETTBEWERBSSTATUS.downloadSchule ||
            wettbewerb.status === WETTBEWERBSSTATUS.downloadPrivat)
);

export const fromWettbewerb = {
    selectWettbewerbLoadState,
    selectWettbewerbLoaded,
    selectWettbewerb,
    selectWettbewerbRunning,
};
