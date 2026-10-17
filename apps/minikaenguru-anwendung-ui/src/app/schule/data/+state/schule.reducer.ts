import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { SchuleActions } from './schule.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { mapErrorToAuthorizedResourceLoadState } from '@matheportal/shared-utils';
import { SchuleWettbewerbskontext } from '../../../core/model/schule-wettbewerbskontext.model';
import { lehrpersonBerechtigungVerweigert } from '../../../lehrperson/api/lehrperson-store.events';

export const SCHULEN_FEATURE_KEY = 'MKASchule';

export interface SchulenState {
    readonly wettbewerbskontext: SchuleWettbewerbskontext | undefined;
    readonly wettbewerbskontextLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
    readonly schulkollegiumLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
}

export const initialSchulenState: SchulenState = {
    wettbewerbskontext: undefined,
    wettbewerbskontextLoadState: 'not-loaded',
    schulkollegiumLoadState: 'not-loaded',
};

export const schulenFeature = createFeature({
    name: SCHULEN_FEATURE_KEY,
    reducer: createReducer<SchulenState>(
        initialSchulenState,
        on(SchuleActions.wettbewerbskontextLaden, state => {
            return state.wettbewerbskontextLoadState === 'loaded' ||
                state.wettbewerbskontextLoadState === 'technical-error' ||
                state.wettbewerbskontextLoadState === 'forbidden'
                ? {
                      ...state,
                      wettbewerbskontext: undefined,
                      wettbewerbskontextLoadState: 'not-loaded',
                      schulkollegiumLoadState: 'not-loaded',
                  }
                : state;
        }),
        on(SchuleActions.wettbewerbskontextGeladen, (state, { wettbewerbskontext }) => ({
            ...state,
            wettbewerbskontext: wettbewerbskontext,
            wettbewerbskontextLoadState: 'loaded',
        })),
        on(SchuleActions.wettbewerbskontextLadenFailed, (state, { error }) => ({
            ...state,
            wettbewerbskontextLoadState: mapErrorToAuthorizedResourceLoadState(error),
            wettbewerbskontext: undefined,
            schulkollegiumLoadState: 'not-loaded',
        })),
        on(SchuleActions.schulkollegiumGeladen, (state, { schulkollegium }) => {
            if (state.wettbewerbskontext && state.wettbewerbskontext.schule.kuerzel === schulkollegium.kuerzel) {
                return {
                    ...state,
                    wettbewerbskontext: { ...state.wettbewerbskontext, kollegen: schulkollegium.kollegium },
                    schulkollegiumLoadState: 'loaded',
                };
            }
            return { ...state, schulkollegiumLoadState: 'loaded' };
        }),
        on(SchuleActions.schulkollegiumLadenFailed, (state, { error }) => {
            const neuerWettbewerbskontext = !state.wettbewerbskontext
                ? undefined
                : { ...state.wettbewerbskontext, kollegen: [] };
            return {
                ...state,
                wettbewerbskontext: neuerWettbewerbskontext,
                schulkollegiumLoadState: mapErrorToAuthorizedResourceLoadState(error),
            };
        }),
        on(lehrpersonBerechtigungVerweigert, state => {
            return {
                ...state,
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'forbidden',
                schulkollegiumLoadState: 'not-loaded',
            };
        }),
        on(SchuleActions.wettbewerbsorganisationVerlassen, state => {
            return {
                ...state,
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'not-loaded',
                schulkollegiumLoadState: 'not-loaded',
            };
        }),
        on(userLoggedOut, () => initialSchulenState)
    ),
});
