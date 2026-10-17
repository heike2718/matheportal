import { createSelector } from '@ngrx/store';
import { privatpersonFeature } from './privatperson.reducer';

const { selectMKAPrivatpersonState } = privatpersonFeature;

export const selectWettbewerbskontextLoadState = createSelector(
    selectMKAPrivatpersonState,
    state => state.wettbewerbskontextLoadState
);

export const selectWettbewerbskontext = createSelector(selectMKAPrivatpersonState, state => state.wettbewerbskontext);

export const selectTeilnahmen = createSelector(selectWettbewerbskontext, kontext =>
    kontext === undefined ? [] : kontext.teilnahmerefs
);
