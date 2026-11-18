import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { userLoggedOut } from '@matheportal/auth-api';
import { Teilnahme } from '../../../model/teilnahme.model';
import { initialPrivatteilnahmeState, privatteilnahmeFeature, PrivatteilnahmeState } from './privatteilnahme.reducer';
import { PrivatteilnahmeActions } from './privatteilnahme.actions';

describe('teilnahmeReducer', () => {
    const teilnahme: Teilnahme = {
        angemeldetAm: '02.04.2026',
        anzahlKinder: 3,
        anzahlKlassen: 0,
        anzahlLoesungszettel: 2,
        auswertungsart: 'ONLINE',
        durchfuehrungsart: 'PRIVAT',
        jahr: 2026,
        kuerzel: 'P123456789',
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

    const notFoundResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        error: 'boom',
        url: '/schulen/',
    });

    describe('sanity checks', () => {
        const unknownAction = { type: 'unknownAction' } as Action;

        it('should return the initial state, when unknown action and undefined state', () => {
            const state = privatteilnahmeFeature.reducer(undefined, unknownAction);
            expect(state).toBe(initialPrivatteilnahmeState);
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const previousState: PrivatteilnahmeState = {
                teilnahme: undefined,
                teilnahmeLoadState: 'not-loaded',
            };
            const state = privatteilnahmeFeature.reducer(previousState, unknownAction);
            expect(state).toBe(previousState);
        });
    });

    describe('userLoggedOut', () => {
        it('should reset its state when logged out', () => {
            const previousState: PrivatteilnahmeState = {
                teilnahme,
                teilnahmeLoadState: 'loaded',
            };

            expect(privatteilnahmeFeature.reducer(previousState, userLoggedOut)).toBe(initialPrivatteilnahmeState);
        });
    });

    describe('privatteilnahmeLaden', () => {
        it.each(['loaded', 'technical-error'] as const)(
            'should reset state when teilnahmeLoadState is %',
            loadState => {
                const previousState: PrivatteilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: loadState,
                };

                const state = privatteilnahmeFeature.reducer(
                    previousState,
                    PrivatteilnahmeActions.privatteilnahmeLaden()
                );

                expect(state).toBe(initialPrivatteilnahmeState);
            }
        );

        it.each(['not-loaded', 'forbidden', 'unauthorized'] as const)(
            'should return the previous state when loadState is %s',
            loadState => {
                const previousState: PrivatteilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: loadState,
                };

                const state = privatteilnahmeFeature.reducer(
                    previousState,
                    PrivatteilnahmeActions.privatteilnahmeLaden()
                );

                expect(state).toBe(previousState);
            }
        );
    });

    describe('privatteilnahmeLaden', () => {
        it.each(['loaded', 'technical-error'] as const)(
            'should reset state when teilnahmeLoadState is %s',
            loadState => {
                const previousState: PrivatteilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: loadState,
                };

                const state = privatteilnahmeFeature.reducer(
                    previousState,
                    PrivatteilnahmeActions.privatteilnahmeLaden()
                );

                expect(state).toBe(initialPrivatteilnahmeState);
            }
        );

        it.each(['not-loaded', 'forbidden', 'unauthorized'] as const)(
            'should return the previous state when loadState is %s',
            loadState => {
                const previousState: PrivatteilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: loadState,
                };

                const state = privatteilnahmeFeature.reducer(
                    previousState,
                    PrivatteilnahmeActions.privatteilnahmeLaden()
                );

                expect(state).toBe(previousState);
            }
        );
    });

    describe('teilnahmeGeladen', () => {
        it('should set the state when teilnahmeGeladen', () => {
            expect(
                privatteilnahmeFeature.reducer(
                    initialPrivatteilnahmeState,
                    PrivatteilnahmeActions.teilnahmeGeladen({ teilnahme })
                )
            ).toEqual({
                teilnahme,
                teilnahmeLoadState: 'loaded',
            });
        });
    });

    describe('teilnahmeLadenFailed', () => {
        const previousState: PrivatteilnahmeState = {
            teilnahme,
            teilnahmeLoadState: 'not-loaded',
        };

        it('should set the state when unauthorized', () => {
            const state = privatteilnahmeFeature.reducer(
                previousState,
                PrivatteilnahmeActions.teilnahmeLadenFailed({ error: unauthorizedErrorResponse })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'unauthorized',
            });
        });

        it('should set the state when forbidden', () => {
            const state = privatteilnahmeFeature.reducer(
                previousState,
                PrivatteilnahmeActions.teilnahmeLadenFailed({ error: forbiddenErrorResponse })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'forbidden',
            });
        });

        it('should set the state when not-found', () => {
            const state = privatteilnahmeFeature.reducer(
                previousState,
                PrivatteilnahmeActions.teilnahmeLadenFailed({ error: notFoundResponse })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'not-found',
            });
        });

        it('should set the state when technical-error', () => {
            const state = privatteilnahmeFeature.reducer(
                previousState,
                PrivatteilnahmeActions.teilnahmeLadenFailed({ error: technicalErrorResponse })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'technical-error',
            });
        });

        it('should set the state when unexpected Error', () => {
            const state = privatteilnahmeFeature.reducer(
                previousState,
                PrivatteilnahmeActions.teilnahmeLadenFailed({
                    error: new Error('das ist jetzt wirklich unerwartet.'),
                })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'technical-error',
            });
        });
    });

    describe('teilnahmeAngemeldet', () => {
        it('should set the teilnahme and teilnahmeLoadState when teilnahme angemeldet and teilnahmeState initial', () => {
            const state = privatteilnahmeFeature.reducer(
                initialPrivatteilnahmeState,
                PrivatteilnahmeActions.teilnahmeAngemeldet({ teilnahme })
            );

            expect(state).toEqual({
                teilnahme,
                teilnahmeLoadState: 'loaded',
            });
        });
    });
});
