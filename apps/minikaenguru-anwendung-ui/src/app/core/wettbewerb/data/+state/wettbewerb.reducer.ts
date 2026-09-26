import { createFeature, createReducer, on } from '@ngrx/store';
import { Wettbewerb } from '../../model/wettbewerb.model';
import { wettbewerbActions } from './wettbewerb.actions';
import { userLoggedOut } from '@matheportal/auth-api';

const WETTBEWERB_FEATURE_KEY = 'MKAWettbewerb';

export interface WettbewerbState {
    readonly wettbewerb: Wettbewerb | undefined;
}

const initialWettbewerbState: WettbewerbState = {
    wettbewerb: undefined,
};

export const wettbewerbFeature = createFeature({
    name: WETTBEWERB_FEATURE_KEY,
    reducer: createReducer<WettbewerbState>(
        initialWettbewerbState,
        on(wettbewerbActions.wettbewerbLoaded, (state, { wettbewerb }) => {
            return { ...state, wettbewerb };
        }),
        on(userLoggedOut, () => initialWettbewerbState)
    ),
});
