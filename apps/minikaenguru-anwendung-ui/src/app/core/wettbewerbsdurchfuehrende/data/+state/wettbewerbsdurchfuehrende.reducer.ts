import { createFeature, createReducer, on } from '@ngrx/store';
import { Wettbewerbsdurchfuehrender } from '../../model/wettbewerbsdurchfuehrende.model';
import { wettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';
import { userLoggedOut } from '@matheportal/auth-api';

const WETTBEWERBSDURCHFUEHRENDE_FEATURE_KEY = 'MKAWettbewerbsdurchfuehrende';

export interface WettbewerbsdurchfuehrendeState {
    readonly wettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender | undefined;
}

const initialWettbewerbsdurchfuehrendeState: WettbewerbsdurchfuehrendeState = {
    wettbewerbsdurchfuehrender: undefined,
};

export const wettbewerbsdurchfuehrendeFeature = createFeature({
    name: WETTBEWERBSDURCHFUEHRENDE_FEATURE_KEY,
    reducer: createReducer<WettbewerbsdurchfuehrendeState>(
        initialWettbewerbsdurchfuehrendeState,
        on(wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt, (state, { responseDto }) => {
            return { ...state, wettbewerbsdurchfuehrender: responseDto };
        }),
        on(userLoggedOut, () => initialWettbewerbsdurchfuehrendeState)
    ),
});
