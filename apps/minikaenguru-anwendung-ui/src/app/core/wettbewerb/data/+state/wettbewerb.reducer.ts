import { createFeature, createReducer, on } from '@ngrx/store';
import { Wettbewerb } from '../../model/wettbewerb.model';
import { WettbewerbActions } from './wettbewerb.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { mapErrorToResourceLoadState } from '@matheportal/shared-utils';

const WETTBEWERB_FEATURE_KEY = 'MKAWettbewerb';

export interface WettbewerbState {
    readonly wettbewerbLoadState: RESOURCE_LOAD_STATE;
    readonly wettbewerb: Wettbewerb | undefined;
}

export const initialWettbewerbState: WettbewerbState = {
    wettbewerbLoadState: 'not-loaded',
    wettbewerb: undefined,
};

export const wettbewerbFeature = createFeature({
    name: WETTBEWERB_FEATURE_KEY,
    reducer: createReducer<WettbewerbState>(
        initialWettbewerbState,
        on(WettbewerbActions.wettbewerbLaden, state =>
            state.wettbewerbLoadState === 'technical-error' ? { ...state, wettbewerbLoadState: 'not-loaded' } : state
        ),
        on(WettbewerbActions.wettbewerbGeladen, (state, { wettbewerb }) => {
            return { ...state, wettbewerb, wettbewerbLoadState: 'loaded' };
        }),
        on(WettbewerbActions.wettbewerbLadenFailed, (state, { error }) => {
            return { ...state, wettbewerb: undefined, wettbewerbLoadState: mapErrorToResourceLoadState(error) };
        }),
        on(userLoggedOut, () => initialWettbewerbState)
    ),
});
