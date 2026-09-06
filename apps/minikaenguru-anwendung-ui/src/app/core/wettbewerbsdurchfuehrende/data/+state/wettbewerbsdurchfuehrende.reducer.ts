import { createFeature, createReducer, on } from '@ngrx/store';
import {
    WettbewerbsdurchfuehrenderDraft,
    WettbewerbsdurchfuehrenderDto,
} from '../../model/wettbewerbsdurchfuehrende.model';
import { wettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';
import { userLoggedOut } from '@matheportal/auth-api';

const WETTBEWERBSDURCHFUEHRENDE_FEATURE_KEY = 'MKAWettbewerbsdurchfuehrende';

export interface WettbewerbsdurchfuehrendeState {
    readonly draft: WettbewerbsdurchfuehrenderDraft | undefined;
    readonly wettbewerbsdurchfuehrender: WettbewerbsdurchfuehrenderDto | undefined;
}

const initialWettbewerbsdurchfuehrendeState: WettbewerbsdurchfuehrendeState = {
    draft: undefined,
    wettbewerbsdurchfuehrender: undefined,
};

export const wettbewerbsdurchfuehrendeFeature = createFeature({
    name: WETTBEWERBSDURCHFUEHRENDE_FEATURE_KEY,
    reducer: createReducer<WettbewerbsdurchfuehrendeState>(
        initialWettbewerbsdurchfuehrendeState,
        on(wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt, (state, { responseDto }) => {
            return { ...state, wettbewerbsdurchfuehrender: responseDto, draft: undefined };
        }),
        on(userLoggedOut, () => initialWettbewerbsdurchfuehrendeState)
    ),
});
