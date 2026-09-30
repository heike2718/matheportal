import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Schule } from '../../../core/model/schulkatalog.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { schulenActions } from './schulen.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { mapErrorResourceLoadingState } from '@matheportal/shared-utils';
import { SchuleWettbewerbskontext } from '../../../core/model/schule-wettbewerbskontext.model';

export const SCHULEN_FEATURE_KEY = 'MKASchulen';

export interface SchulenState {
    readonly schulenLoadingState: RESOURCE_LOAD_STATE;
    readonly schulen: Schule[];
    readonly selectedSchule: SchuleWettbewerbskontext | undefined;
}

export const initialSchulenState: SchulenState = {
    schulenLoadingState: 'not-loaded',
    schulen: [],
    selectedSchule: undefined,
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
            schulenLoadingState: mapErrorResourceLoadingState(error),
            schulen: [],
        })),
        on(userLoggedOut, () => initialSchulenState)
    ),
});
