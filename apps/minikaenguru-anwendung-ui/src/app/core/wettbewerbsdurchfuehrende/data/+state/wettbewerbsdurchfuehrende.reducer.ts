import { createFeature, createReducer, on } from '@ngrx/store';
import { Wettbewerbsdurchfuehrender } from '../../model/wettbewerbsdurchfuehrende.model';
import { WettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { mapErrorToResourceLoadState } from '@matheportal/shared-utils';

const WETTBEWERBSDURCHFUEHRENDE_FEATURE_KEY = 'MKAWettbewerbsdurchfuehrende';

export interface WettbewerbsdurchfuehrendeState {
    readonly durchfuehrenderLoadState: RESOURCE_LOAD_STATE;
    readonly durchfuehrender: Wettbewerbsdurchfuehrender | undefined;
}

const initialWettbewerbsdurchfuehrendeState: WettbewerbsdurchfuehrendeState = {
    durchfuehrenderLoadState: 'not-loaded',
    durchfuehrender: undefined,
};

export const wettbewerbsdurchfuehrendeFeature = createFeature({
    name: WETTBEWERBSDURCHFUEHRENDE_FEATURE_KEY,
    reducer: createReducer<WettbewerbsdurchfuehrendeState>(
        initialWettbewerbsdurchfuehrendeState,
        on(WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden, state =>
            state.durchfuehrenderLoadState === 'technical-error'
                ? { ...state, durchfuehrenderLoadState: 'not-loaded', durchfuehrender: undefined }
                : state
        ),
        on(
            WettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt,
            WettbewerbsdurchfuehrendeActions.durchfuehrenderGeladen,
            (state, { wettbewerbsdurchfuehrender: responseDto }) => {
                return {
                    ...state,
                    durchfuehrender: responseDto,
                    durchfuehrenderLoadState: 'loaded',
                };
            }
        ),
        on(WettbewerbsdurchfuehrendeActions.durchfuehrendenLadenFailed, (state, { error }) => {
            return {
                ...state,
                durchfuehrender: undefined,
                durchfuehrenderLoadState: mapErrorToResourceLoadState(error),
            };
        }),
        on(userLoggedOut, () => initialWettbewerbsdurchfuehrendeState)
    ),
});
