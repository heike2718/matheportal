import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Schule } from '../../../core/model/schulkatalog.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { LehrpersonActions } from './lehrperson.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { mapErrorToAuthorizedResourceLoadState } from '@matheportal/shared-utils';

export const LEHRPERSON_FEATURE_KEY = 'MKALehrperson';

export interface LehrpersonState {
    readonly schulenLoadState: AUTHORIZED_RESOURCE_LOAD_STATE;
    readonly schulen: Schule[];
}

export const initialLehrpersonState: LehrpersonState = {
    schulenLoadState: 'not-loaded',
    schulen: [],
};

export const lehrpersonFeature = createFeature({
    name: LEHRPERSON_FEATURE_KEY,
    reducer: createReducer<LehrpersonState>(
        initialLehrpersonState,
        on(LehrpersonActions.schulenLadenFailed, (state, { error }) => {
            const newSchulenLoadState = mapErrorToAuthorizedResourceLoadState(error);
            if (newSchulenLoadState === 'technical-error') {
                return {
                    ...state,
                    schulenLoadState: mapErrorToAuthorizedResourceLoadState(error),
                    schulen: [],
                };
            }
            return {
                ...state,
                schulenLoadState: newSchulenLoadState,
                schulen: [],
            };
        }),
        on(LehrpersonActions.schulenGeladen, (state, { schulen }) => ({
            ...state,
            schulenLoadState: 'loaded',
            schulen,
        })),
        on(userLoggedOut, () => initialLehrpersonState)
    ),
});
