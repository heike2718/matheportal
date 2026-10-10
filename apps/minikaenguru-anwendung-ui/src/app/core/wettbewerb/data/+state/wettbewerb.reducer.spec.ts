import { Action } from '@ngrx/store';
import { Wettbewerb, WETTBEWERBSSTATUS } from '../../model/wettbewerb.model';
import { initialWettbewerbState, wettbewerbFeature, WettbewerbState } from './wettbewerb.reducer';
import { WettbewerbActions } from './wettbewerb.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { HttpErrorResponse } from '@angular/common/http';

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

    const unauthorizedErrorResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 401,
        statusText: 'unauthorized',
        error: 'boom',
        url: '/schulen/',
    });

    const technicalErrorResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/schulen/',
    });

    describe('sanity checks', () => {
        it('should return the initial state, when unknown action and undefined state', () => {
            const state = wettbewerbFeature.reducer(undefined, unknownAction);
            expect(state.wettbewerb).not.toBeDefined();
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const state = wettbewerbFeature.reducer({ wettbewerb, wettbewerbLoadState: 'loaded' }, unknownAction);
            expect(state.wettbewerb).toEqual(wettbewerb);
        });
    });

    describe('wettbewerbLaden', () => {
        it.each(['not-loaded', 'loaded'] as const)(
            'should not reset the wettbewerbLoadState when %s on wettbewerbLaden',
            loadState => {
                const previousState: WettbewerbState = {
                    wettbewerbLoadState: loadState,
                    wettbewerb,
                };

                const state = wettbewerbFeature.reducer(previousState, WettbewerbActions.wettbewerbLaden());

                expect(state).toBe(previousState);
            }
        );

        it('should reset the wettbewerbLoadState when technical-error on wettbewerbLaden', () => {
            const previousState: WettbewerbState = {
                wettbewerbLoadState: 'technical-error',
                wettbewerb: undefined,
            };

            const state = wettbewerbFeature.reducer(previousState, WettbewerbActions.wettbewerbLaden());

            expect(state).toEqual({
                wettbewerbLoadState: 'not-loaded',
                wettbewerb: undefined,
            });
        });
    });

    describe('wettbewerbGeladen', () => {
        it('should set wettbewerb and loadState', () => {
            const previousState: WettbewerbState = {
                wettbewerbLoadState: 'not-loaded',
                wettbewerb: undefined,
            };

            const state = wettbewerbFeature.reducer(previousState, WettbewerbActions.wettbewerbGeladen({ wettbewerb }));

            expect(state).toEqual({ wettbewerbLoadState: 'loaded', wettbewerb });
        });
    });

    describe('wettbewerbLadenFailed', () => {
        const previousState: WettbewerbState = { wettbewerbLoadState: 'loaded', wettbewerb };

        it('should set the expected wettbewerbLoadState when unauthorized', () => {
            const state = wettbewerbFeature.reducer(
                previousState,
                WettbewerbActions.wettbewerbLadenFailed({ error: unauthorizedErrorResponse })
            );

            expect(state).toEqual({
                wettbewerbLoadState: 'unauthorized',
                wettbewerb: undefined,
            });
        });

        it('should set the expected wettbewerbLoadState when technical error', () => {
            const state = wettbewerbFeature.reducer(
                previousState,
                WettbewerbActions.wettbewerbLadenFailed({ error: technicalErrorResponse })
            );

            expect(state).toEqual({
                wettbewerbLoadState: 'technical-error',
                wettbewerb: undefined,
            });
        });
    });

    describe('userLoggedOut', () => {
        it('should return the initial state when user logged out', () => {
            const state = wettbewerbFeature.reducer({ wettbewerbLoadState: 'loaded', wettbewerb }, userLoggedOut);

            expect(state).toBe(initialWettbewerbState);
        });
    });
});
