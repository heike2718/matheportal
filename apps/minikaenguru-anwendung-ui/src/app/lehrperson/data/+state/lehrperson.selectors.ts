import { createSelector } from '@ngrx/store';
import { lehrpersonFeature } from './lehrperson.reducer';
import { Schule } from '../../../core/model/schulkatalog.model';

const { selectMKALehrpersonState } = lehrpersonFeature;

export const selectSchulen = createSelector(selectMKALehrpersonState, state => state.schulen);

export const selectSchulenLoadState = createSelector(selectMKALehrpersonState, state => state.schulenLoadState);

export const selectSchulenLoaded = createSelector(
    selectMKALehrpersonState,
    state => state.schulenLoadState === 'loaded'
);

export const selectSchulauswahlMoeglich = createSelector(
    selectSchulenLoaded,
    selectSchulen,
    (loaded: boolean, schulen: Schule[]) => loaded && schulen.length > 1
);
