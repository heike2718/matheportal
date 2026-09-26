import { Action } from '@ngrx/store';
import { Wettbewerb, WETTBEWERBSSTATUS } from '../../model/wettbewerb.model';
import { wettbewerbFeature } from './wettbewerb.reducer';
import { wettbewerbActions } from './wettbewerb.actions';
import { userLoggedOut } from '@matheportal/auth-api';

describe('wettebwerbFeature', () => {
    const unknownAction = { type: 'unknownAction' } as Action;

    const wettbewerb: Wettbewerb = {
        beginn: '01.01.2029',
        ende: '31.07.2029',
        freischaltungPrivat: '15.06.2029',
        freischaltungSchulen: '14.03.2029',
        jahr: 2029,
        status: WETTBEWERBSSTATUS.anmeldung,
    };

    describe('sanity checks', () => {
        it('should return the initial state, when unknown action and undefined state', () => {
            const state = wettbewerbFeature.reducer(undefined, unknownAction);
            expect(state.wettbewerb).not.toBeDefined();
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const state = wettbewerbFeature.reducer({ wettbewerb }, unknownAction);
            expect(state.wettbewerb).toEqual(wettbewerb);
        });
    });

    describe('wettbewerbGeladen', () => {
        it('should set wettbewerb', () => {
            const previousState = {
                wettbewerb: undefined,
            };

            const state = wettbewerbFeature.reducer(previousState, wettbewerbActions.wettbewerbGeladen({ wettbewerb }));

            expect(state).toEqual({ wettbewerb });
        });
    });

    describe('userLoggedOut', () => {
        it('should return the initial state when user logged out', () => {
            const state = wettbewerbFeature.reducer({ wettbewerb }, userLoggedOut);

            expect(state).toEqual({ wettbewerb: undefined });
        });
    });
});
