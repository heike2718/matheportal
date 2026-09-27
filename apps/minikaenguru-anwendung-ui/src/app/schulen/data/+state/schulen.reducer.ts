import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Schule } from '../../../core/model/schulkatalog.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { schulenActions } from './schulen.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { mapErrorResourceLoadingState } from '@matheportal/shared-utils';
import { schuleFuerWettbewerbSelected } from '../../../lehrperson/api/lehrperson-store.events';

export const SCHULEN_FEATURE_KEY = 'MKASchulen';

export interface SchulenState {
    readonly schulenLoadState: RESOURCE_LOAD_STATE;
    readonly schulen: Schule[];
    readonly selectedSchulkuerzel: string | undefined;
}

const initialSchulenState: SchulenState = {
    schulenLoadState: 'not-loaded',
    schulen: [],
    selectedSchulkuerzel: undefined,
};

export const schulenFeature = createFeature({
    name: SCHULEN_FEATURE_KEY,
    reducer: createReducer<SchulenState>(
        initialSchulenState,
        on(schulenActions.schulenGeladen, (state, { schulen }) => ({
            ...state,
            schulenLoadState: 'loaded',
            schulen,
            selectedSchulkuerzel: undefined,
        })),
        on(schulenActions.schulenLadenFailed, (state, { error }) => ({
            ...state,
            schulenLoadState: mapErrorResourceLoadingState(error),
            schulen: [],
            selectedSchulkuerzel: undefined,
        })),
        on(schuleFuerWettbewerbSelected, (state, { schule }) => ({
            ...state,
            selectedSchulkuerzel: schule.kuerzel,
        })),
        on(userLoggedOut, () => initialSchulenState)
    ),
});
