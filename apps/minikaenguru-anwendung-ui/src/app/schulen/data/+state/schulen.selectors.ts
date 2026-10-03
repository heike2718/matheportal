import { createSelector } from '@ngrx/store';
import { schulenFeature } from './schulen.reducer';
import { Schule } from '../../../core/model/schulkatalog.model';

const { selectMKASchulenState } = schulenFeature;

export const selectSchulen = createSelector(selectMKASchulenState, state => state.schulen);

export const selectSchulenLoaded = createSelector(
    selectMKASchulenState,
    state => state.schulenLoadingState === 'loaded'
);

export const selectSchulauswahlMoeglich = createSelector(
    selectSchulenLoaded,
    selectSchulen,
    (loaded: boolean, schulen: Schule[]) => loaded && schulen.length > 1
);

export const selectWettbewerbskontextLoadingState = createSelector(
    selectMKASchulenState,
    state => state.wettbewerbskontextLoadingState
);

export const selectWettbewerbskontextLoaded = createSelector(
    selectWettbewerbskontextLoadingState,
    loadingState => loadingState === 'loaded'
);

export const selectSchulkollegiumLoaded = createSelector(
    selectMKASchulenState,
    state => state.schulkollegiumLoadingState === 'loaded'
);

export const selectWettbewerbskontext = createSelector(selectMKASchulenState, state => state.wettbewerbskontext);

export const selectTeilnahmen = createSelector(selectWettbewerbskontext, kontext =>
    kontext === undefined ? [] : kontext.teilnahmerefs
);

export const selectKollegen = createSelector(
    selectSchulkollegiumLoaded,
    selectWettbewerbskontext,
    (loaded, kontext) => {
        if (!loaded) {
            return [];
        }
        return kontext === undefined ? [] : kontext.kollegen;
    }
);

export const selectDsgvoVertragErforderlich = createSelector(
    selectWettbewerbskontextLoaded,
    selectWettbewerbskontext,
    (loaded, kontext) => (!loaded ? false : !kontext?.vertragDSGVOVorhanden)
);
