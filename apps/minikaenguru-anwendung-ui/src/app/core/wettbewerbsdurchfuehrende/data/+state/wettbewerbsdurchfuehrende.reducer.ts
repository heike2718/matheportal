import { createFeature, createReducer, on } from '@ngrx/store';
import { Wettbewerbsdurchfuehrender } from '../../model/wettbewerbsdurchfuehrende.model';
import { wettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { mapDto } from '../wettbewerbsdurchfuehrende-data.utils';

const WETTBEWERBSDURCHFUEHRENDE_FEATURE_KEY = 'wettbewerbsdurchfuehrende';

export interface WettbewerbsdurchfuehrendeState {
    wettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender | undefined;
}

const initialWettbewerbsdurchfuehrendeState: WettbewerbsdurchfuehrendeState = {
    wettbewerbsdurchfuehrender: undefined,
};

export const wettbewerbsdurchfuehrendeFeature = createFeature({
    name: WETTBEWERBSDURCHFUEHRENDE_FEATURE_KEY,
    reducer: createReducer<WettbewerbsdurchfuehrendeState>(
        initialWettbewerbsdurchfuehrendeState,
        on(wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt, (state, action) => {
            return { ...state, wettbewerbsdurchfuehrender: mapDto(action.responseDto) };
        }),
        on(userLoggedOut, () => initialWettbewerbsdurchfuehrendeState)
    ),
});
