import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Schule } from '../../../core/model/schulkatalog.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { schulenActions } from './schulen.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { mapErrorToAuthorizedResourceLoadState } from '@matheportal/shared-utils';
import { SchuleWettbewerbskontext } from '../../../core/model/schule-wettbewerbskontext.model';
import { wettbewerbsorganisationVerlassen } from '../../../lehrperson/api/lehrperson-store.events';

export const SCHULEN_FEATURE_KEY = 'MKASchulen';

export interface SchulenState {
    readonly schulenLoadingState: AUTHORIZED_RESOURCE_LOAD_STATE;
    readonly schulen: Schule[];
    readonly wettbewerbskontext: SchuleWettbewerbskontext | undefined;
    readonly wettbewerbskontextLoadingState: AUTHORIZED_RESOURCE_LOAD_STATE;
    readonly schulkollegiumLoadingState: AUTHORIZED_RESOURCE_LOAD_STATE;
}

export const initialSchulenState: SchulenState = {
    schulenLoadingState: 'not-loaded',
    schulen: [],
    wettbewerbskontext: undefined,
    wettbewerbskontextLoadingState: 'not-loaded',
    schulkollegiumLoadingState: 'not-loaded',
};

export const schulenFeature = createFeature({
    name: SCHULEN_FEATURE_KEY,
    reducer: createReducer<SchulenState>(
        initialSchulenState,
        on(schulenActions.schulenGeladen, (state, { schulen }) => ({
            ...state,
            schulenLoadingState: 'loaded',
            schulen,
        })),
        on(schulenActions.schulenLadenFailed, (state, { error }) => ({
            ...state,
            schulenLoadingState: mapErrorToAuthorizedResourceLoadState(error),
            schulen: [],
            wettbewerbskontextLoadingState: 'not-loaded',
            wettbewerbskontext: undefined,
            schulkollegiumLoadingState: 'not-loaded',
        })),
        on(schulenActions.wettbewerbskontextGeladen, (state, { wettbewerbskontext }) => ({
            ...state,
            wettbewerbskontext: wettbewerbskontext,
            wettbewerbskontextLoadingState: 'loaded',
        })),
        on(schulenActions.wettbewerbskontextLadenFailed, (state, { error }) => ({
            ...state,
            wettbewerbskontextLoadingState: mapErrorToAuthorizedResourceLoadState(error),
            wettbewerbskontext: undefined,
            schulkollegiumLoadingState: 'not-loaded',
        })),
        on(schulenActions.schulkollegiumGeladen, (state, { schulkollegium }) => {
            if (state.wettbewerbskontext && state.wettbewerbskontext.schule.kuerzel === schulkollegium.kuerzel) {
                return {
                    ...state,
                    wettbewerbskontext: { ...state.wettbewerbskontext, kollegen: schulkollegium.kollegium },
                    schulkollegiumLoadingState: 'loaded',
                };
            }
            return { ...state, schulkollegiumLoadingState: 'loaded' };
        }),
        on(schulenActions.schulkollegiumLadenFailed, (state, { error }) => {
            const neuerWettbewerbskontext = !state.wettbewerbskontext
                ? undefined
                : { ...state.wettbewerbskontext, kollegen: [] };
            return {
                ...state,
                wettbewerbskontext: neuerWettbewerbskontext,
                schulkollegiumLoadingState: mapErrorToAuthorizedResourceLoadState(error),
            };
        }),
        on(schulenActions.schulkollegiumLadenFailed, (state, { error }) => ({
            ...state,
            schulkollegiumLoadingState: mapErrorToAuthorizedResourceLoadState(error),
        })),
        on(wettbewerbsorganisationVerlassen, state => {
            return {
                ...state,
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadingState: 'not-loaded',
                schulkollegiumLoadingState: 'not-loaded',
            };
        }),
        on(userLoggedOut, () => initialSchulenState)
    ),
});
