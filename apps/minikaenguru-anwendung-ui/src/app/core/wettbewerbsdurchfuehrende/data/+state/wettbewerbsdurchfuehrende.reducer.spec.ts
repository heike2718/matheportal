import { Action } from '@ngrx/store';
import { wettbewerbsdurchfuehrendeFeature, WettbewerbsdurchfuehrendeState } from './wettbewerbsdurchfuehrende.reducer';
import {
    DURCHFUEHRUNGSART,
    Wettbewerbsdurchfuehrender,
    ZUGANGSBERECHTIGUNG_UNTERLAGEN,
} from '../../model/wettbewerbsdurchfuehrende.model';
import { userLoggedOut } from '@matheportal/auth-api';
import { WettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';
import { HttpErrorResponse } from '@angular/common/http';

describe('wettbewerbsdurchfuehrendeFeature tests', () => {
    const unknownAction = { type: 'unknownAction' } as Action;

    const durchfuehrender: Wettbewerbsdurchfuehrender = {
        durchfuehrungsart: DURCHFUEHRUNGSART.schule,
        newsletter: true,
        zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.erteilt,
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
            const state = wettbewerbsdurchfuehrendeFeature.reducer(undefined, unknownAction);
            expect(state.durchfuehrender).not.toBeDefined();
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const state = wettbewerbsdurchfuehrendeFeature.reducer(
                { durchfuehrender, durchfuehrenderLoadState: 'loaded' },
                unknownAction
            );
            expect(state.durchfuehrender).toEqual(durchfuehrender);
        });
    });

    describe('wettbewerbsdurchfuehrenderAngelegt', () => {
        it('should map the responseDto when angelegt', () => {
            const responseDto: Wettbewerbsdurchfuehrender = {
                durchfuehrungsart: 'SCHULE',
                newsletter: true,
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            const state = wettbewerbsdurchfuehrendeFeature.reducer(
                { durchfuehrender: undefined, durchfuehrenderLoadState: 'not-loaded' },
                WettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ wettbewerbsdurchfuehrender: responseDto })
            );

            expect(state.durchfuehrender?.durchfuehrungsart).toBe(DURCHFUEHRUNGSART.schule);
            expect(state.durchfuehrender?.newsletter).toBeTruthy();
            expect(state.durchfuehrender?.zugangsberechtigungUnterlagen).toBe(ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard);
        });
    });

    describe('durchfuehrendenLaden', () => {
        it.each(['not-loaded', 'loaded'] as const)(
            'should return the same state when %s on durchfuehrendenLaden',
            loadState => {
                const previousState: WettbewerbsdurchfuehrendeState = {
                    durchfuehrenderLoadState: loadState,
                    durchfuehrender,
                };

                const state = wettbewerbsdurchfuehrendeFeature.reducer(
                    previousState,
                    WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden()
                );

                expect(state).toBe(previousState);
            }
        );

        it('should reset the state on durchfuehrendenLaden when technical-error', () => {
            const previousState: WettbewerbsdurchfuehrendeState = {
                durchfuehrenderLoadState: 'technical-error',
                durchfuehrender,
            };

            const state = wettbewerbsdurchfuehrendeFeature.reducer(
                previousState,
                WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden()
            );

            expect(state).toEqual({
                durchfuehrenderLoadState: 'not-loaded',
                durchfuehrender: undefined,
            });
        });
    });

    describe('durchfuehrendenGeladen', () => {
        it('should map the responseDto when geladen', () => {
            const responseDto: Wettbewerbsdurchfuehrender = {
                durchfuehrungsart: 'SCHULE',
                newsletter: true,
                zugangsberechtigungUnterlagen: 'STANDARD',
            };

            const expectedWettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender = {
                durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                newsletter: true,
                zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
            };

            const state = wettbewerbsdurchfuehrendeFeature.reducer(
                { durchfuehrender: undefined, durchfuehrenderLoadState: 'not-loaded' },
                WettbewerbsdurchfuehrendeActions.durchfuehrenderGeladen({ wettbewerbsdurchfuehrender: responseDto })
            );

            expect(state).toEqual({
                durchfuehrenderLoadState: 'loaded',
                durchfuehrender: expectedWettbewerbsdurchfuehrender,
            });
        });
    });

    describe('durchfuehrendenLadenFailed', () => {
        const previousState: WettbewerbsdurchfuehrendeState = {
            durchfuehrender,
            durchfuehrenderLoadState: 'loaded',
        };

        it('should set the expected state when unauthorized', () => {
            const state = wettbewerbsdurchfuehrendeFeature.reducer(
                previousState,
                WettbewerbsdurchfuehrendeActions.durchfuehrendenLadenFailed({ error: unauthorizedErrorResponse })
            );

            expect(state).toEqual({
                durchfuehrender: undefined,
                durchfuehrenderLoadState: 'unauthorized',
            });
        });

        it('should set the expected state when technical-error', () => {
            const state = wettbewerbsdurchfuehrendeFeature.reducer(
                previousState,
                WettbewerbsdurchfuehrendeActions.durchfuehrendenLadenFailed({ error: technicalErrorResponse })
            );

            expect(state).toEqual({
                durchfuehrender: undefined,
                durchfuehrenderLoadState: 'technical-error',
            });
        });
    });

    describe('userLoggedOut', () => {
        it('should return the initial state when user logged out', () => {
            const state = wettbewerbsdurchfuehrendeFeature.reducer(
                { durchfuehrender, durchfuehrenderLoadState: 'loaded' },
                userLoggedOut
            );

            expect(state).toEqual({
                durchfuehrenderLoadState: 'not-loaded',
                durchfuehrender: undefined,
            });
        });
    });
});
