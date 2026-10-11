import { createSelector } from '@ngrx/store';
import { schulenFeature } from './schule.reducer';

const { selectMKASchuleState } = schulenFeature;

export const selectWettbewerbskontextLoadState = createSelector(
    selectMKASchuleState,
    state => state.wettbewerbskontextLoadState
);

export const selectWettbewerbskontextLoaded = createSelector(
    selectWettbewerbskontextLoadState,
    LoadState => LoadState === 'loaded'
);

export const selectSchulkollegiumLoaded = createSelector(
    selectMKASchuleState,
    state => state.schulkollegiumLoadState === 'loaded'
);

export const selectWettbewerbskontext = createSelector(selectMKASchuleState, state => state.wettbewerbskontext);

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
