import { createFeature, createReducer, on } from '@ngrx/store';
import {
    mapDto,
    WETTBEWERBSDURCHFUEHRENDE_FEATURE_KEY,
    Wettbewerbsdurchfuehrender,
} from '../../model/wettbewerbsdurchfuehrende.model';
import { wettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';
import { userLoggedOut } from '@matheportal/auth-api';

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
