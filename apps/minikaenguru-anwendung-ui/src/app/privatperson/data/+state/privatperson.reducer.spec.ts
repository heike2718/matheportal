import { HttpErrorResponse } from '@angular/common/http';
import { PrivatpersonWettbewerbskontext } from '../../model/privatperson.model';
import { Action } from '@ngrx/store';
import { initialPrivatpersonState, privatpersonFeature, PrivatpersonState } from './privatperson.reducer';
import { userLoggedOut } from '@matheportal/auth-api';
import { PrivatpersonActions } from './privatperson.actions';

describe('privatpersonReducer', () => {
    const wettbewerbskontext: PrivatpersonWettbewerbskontext = {
        anmeldungMoeglich: true,
        teilnahmerefs: [],
    };

    const unauthorizedErrorResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 401,
        statusText: 'unauthorized',
        error: 'boom',
        url: '/schulen/',
    });

    const forbiddenErrorResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 403,
        statusText: 'forbidden',
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
        const unknownAction = { type: 'unknownAction' } as Action;

        it('should return the initial state, when unknown action and undefined state', () => {
            const state = privatpersonFeature.reducer(undefined, unknownAction);
            expect(state).toBe(initialPrivatpersonState);
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const previousState: PrivatpersonState = {
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'not-loaded',
            };
            const state = privatpersonFeature.reducer(previousState, unknownAction);
            expect(state).toBe(previousState);
        });
    });

    describe('userLoggedOut', () => {
        it('should reset its state when logged out', () => {
            const previousState: PrivatpersonState = {
                wettbewerbskontext,
                wettbewerbskontextLoadState: 'loaded',
            };

            expect(privatpersonFeature.reducer(previousState, userLoggedOut)).toBe(initialPrivatpersonState);
        });
    });

    describe('wettbewerbskontextLaden', () => {
        it.each(['loaded', 'technical-error'] as const)(
            'should reset state when wettbewerbskontextLoadState is %',
            loadState => {
                const previousState: PrivatpersonState = {
                    wettbewerbskontext,
                    wettbewerbskontextLoadState: loadState,
                };

                const state = privatpersonFeature.reducer(previousState, PrivatpersonActions.wettbewerbskontextLaden());

                expect(state).toBe(initialPrivatpersonState);
            }
        );

        it.each(['not-loaded', 'forbidden', 'unauthorized'] as const)(
            'should return the previous state when loadState is %s',
            loadState => {
                const previousState: PrivatpersonState = {
                    wettbewerbskontext,
                    wettbewerbskontextLoadState: loadState,
                };

                const state = privatpersonFeature.reducer(previousState, PrivatpersonActions.wettbewerbskontextLaden());

                expect(state).toBe(previousState);
            }
        );
    });

    describe('wettbewerbskontextGeladen', () => {
        it('should set the state when wettbewerbskontextGeladen', () => {
            expect(
                privatpersonFeature.reducer(
                    initialPrivatpersonState,
                    PrivatpersonActions.wettbewerbskontextGeladen({ wettbewerbskontext })
                )
            ).toEqual({
                wettbewerbskontext,
                wettbewerbskontextLoadState: 'loaded',
            });
        });
    });

    describe('wettbewerbskontextLadenFailed', () => {
        const previousState: PrivatpersonState = {
            wettbewerbskontext,
            wettbewerbskontextLoadState: 'not-loaded',
        };

        it('should set the state when unauthorized', () => {
            const state = privatpersonFeature.reducer(
                previousState,
                PrivatpersonActions.wettbewerbskontextLadenFailed({ error: unauthorizedErrorResponse })
            );

            expect(state).toEqual({
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'unauthorized',
            });
        });

        it('should set the state when forbidden', () => {
            const state = privatpersonFeature.reducer(
                previousState,
                PrivatpersonActions.wettbewerbskontextLadenFailed({ error: forbiddenErrorResponse })
            );

            expect(state).toEqual({
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'forbidden',
            });
        });

        it('should set the state when technical-error', () => {
            const state = privatpersonFeature.reducer(
                previousState,
                PrivatpersonActions.wettbewerbskontextLadenFailed({ error: technicalErrorResponse })
            );

            expect(state).toEqual({
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'technical-error',
            });
        });

        it('should set the state when unexpected Error', () => {
            const state = privatpersonFeature.reducer(
                previousState,
                PrivatpersonActions.wettbewerbskontextLadenFailed({
                    error: new Error('das ist jetzt wirklich unerwartet.'),
                })
            );

            expect(state).toEqual({
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'technical-error',
            });
        });
    });
});
