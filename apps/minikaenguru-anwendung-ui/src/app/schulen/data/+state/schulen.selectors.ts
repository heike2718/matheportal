import { createSelector } from '@ngrx/store';
import { schulenFeature, SchulenState } from './schulen.reducer';
import { schulenLoaded } from '../../../schulkatalog/schulkatalogsuche/data/+state/schulkatalogsuche.selectors';
import { Schule } from '../../../core/model/schulkatalog.model';

const { selectMKASchulenState } = schulenFeature;

export const selectSchulen = createSelector(selectMKASchulenState, state => state.schulen);

export const selectSchulenLoaded = createSelector(
    selectMKASchulenState,
    state => state.schulenLoadingState === 'loaded'
);

export const selectSchulauswahlMoeglich = createSelector(
    schulenLoaded,
    selectSchulen,
    (loaded: boolean, schulen: Schule[]) => loaded && schulen.length > 1
);

export const selectWettbewerbskontextLoaded = createSelector(
    selectMKASchulenState,
    state => state.wettbewerbskontextLoadingState === 'loaded'
);

export const selectSchulkollegiumLoaded = createSelector(
    selectMKASchulenState,
    state => state.schulkollegiumLoadingState === 'loaded'
);

export const selectWettbewerbskontext = createSelector(selectMKASchulenState, state => state.wettbewerbskontext);

// export const selectSchule = createSelector(selectWettbewerbskontext, kontext => kontext && kontext.schule);

// export const selectAnmeldungMoeglich = createSelector(
//     selectWettbewerbskontext,
//     kontext => kontext && kontext.anmeldungMoeglich
// );

// export const selectVertragDSGVOVorhanden = createSelector(
//     selectWettbewerbskontext,
//     kontext => kontext && kontext.vertragDSGVOVorhanden
// );

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
