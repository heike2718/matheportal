import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { userLoggedOut } from '@matheportal/auth-api';
import { Teilnahme } from '../../model/teilnahme.model';
import { initialTeilnahmeState, teilnahmeFeature, TeilnahmeState } from './teilnahme.reducer';
import { TeilnahmeActions } from './teilnahme.actions';

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

    describe('sanity checks', () => {
        const unknownAction = { type: 'unknownAction' } as Action;

        it('should return the initial state, when unknown action and undefined state', () => {
            const state = teilnahmeFeature.reducer(undefined, unknownAction);
            expect(state).toBe(initialTeilnahmeState);
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const previousState: TeilnahmeState = {
                teilnahme: undefined,
                teilnahmeLoadState: 'not-loaded',
            };
            const state = teilnahmeFeature.reducer(previousState, unknownAction);
            expect(state).toBe(previousState);
        });
    });

    describe('userLoggedOut', () => {
        it('should reset its state when logged out', () => {
            const previousState: TeilnahmeState = {
                teilnahme,
                teilnahmeLoadState: 'loaded',
            };

            expect(teilnahmeFeature.reducer(previousState, userLoggedOut)).toBe(initialTeilnahmeState);
        });
    });

    describe('privatteilnahmeLaden', () => {
        it.each(['loaded', 'technical-error'] as const)(
            'should reset state when teilnahmeLoadState is %',
            loadState => {
                const previousState: TeilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: loadState,
                };

                const state = teilnahmeFeature.reducer(previousState, TeilnahmeActions.privatteilnahmeLaden());

                expect(state).toBe(initialTeilnahmeState);
            }
        );

        it.each(['not-loaded', 'forbidden', 'unauthorized'] as const)(
            'should return the previous state when loadState is %s',
            loadState => {
                const previousState: TeilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: loadState,
                };

                const state = teilnahmeFeature.reducer(previousState, TeilnahmeActions.privatteilnahmeLaden());

                expect(state).toBe(previousState);
            }
        );
    });

    describe('privatteilnahmeLaden', () => {
        it.each(['loaded', 'technical-error'] as const)(
            'should reset state when teilnahmeLoadState is %s',
            loadState => {
                const previousState: TeilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: loadState,
                };

                const state = teilnahmeFeature.reducer(previousState, TeilnahmeActions.privatteilnahmeLaden());

                expect(state).toBe(initialTeilnahmeState);
            }
        );

        it.each(['not-loaded', 'forbidden', 'unauthorized'] as const)(
            'should return the previous state when loadState is %s',
            loadState => {
                const previousState: TeilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: loadState,
                };

                const state = teilnahmeFeature.reducer(previousState, TeilnahmeActions.privatteilnahmeLaden());

                expect(state).toBe(previousState);
            }
        );
    });

    describe('schulteilnahmeLaden', () => {
        const schulkuerzel = 'S1234567';
        it.each(['not-loaded', 'forbidden', 'unauthorized'] as const)(
            'should return the previous state when loadState is %s',
            loadState => {
                const previousState: TeilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: loadState,
                };

                const state = teilnahmeFeature.reducer(
                    previousState,
                    TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel })
                );

                expect(state).toBe(previousState);
            }
        );

        it('should return previous state when loadState is loaded and kuerzel is equal', () => {
            const previousState: TeilnahmeState = {
                teilnahme,
                teilnahmeLoadState: 'loaded',
            };

            const state = teilnahmeFeature.reducer(
                previousState,
                TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel: 'P123456789' })
            );

            expect(state).toBe(previousState);
        });

        it('should reset state when loadState is technical-error and kuerzel is equal', () => {
            const previousState: TeilnahmeState = {
                teilnahme,
                teilnahmeLoadState: 'technical-error',
            };

            const state = teilnahmeFeature.reducer(
                previousState,
                TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel: 'P123456789' })
            );

            expect(state).toBe(initialTeilnahmeState);
        });

        it.each(['loaded', 'technical-error'] as const)(
            'should reset state state when loadState is %s and kuerzel is different',
            loadState => {
                const previousState: TeilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: loadState,
                };

                const state = teilnahmeFeature.reducer(
                    previousState,
                    TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel })
                );

                expect(state).toBe(initialTeilnahmeState);
            }
        );
    });

    describe('teilnahmeGeladen', () => {
        it('should set the state when teilnahmeGeladen', () => {
            expect(
                teilnahmeFeature.reducer(initialTeilnahmeState, TeilnahmeActions.teilnahmeGeladen({ teilnahme }))
            ).toEqual({
                teilnahme,
                teilnahmeLoadState: 'loaded',
            });
        });
    });

    describe('teilnahmeLadenFailed', () => {
        const previousState: TeilnahmeState = {
            teilnahme,
            teilnahmeLoadState: 'not-loaded',
        };

        it('should set the state when unauthorized', () => {
            const state = teilnahmeFeature.reducer(
                previousState,
                TeilnahmeActions.teilnahmeLadenFailed({ error: unauthorizedErrorResponse })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'unauthorized',
            });
        });

        it('should set the state when forbidden', () => {
            const state = teilnahmeFeature.reducer(
                previousState,
                TeilnahmeActions.teilnahmeLadenFailed({ error: forbiddenErrorResponse })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'forbidden',
            });
        });

        it('should set the state when technical-error', () => {
            const state = teilnahmeFeature.reducer(
                previousState,
                TeilnahmeActions.teilnahmeLadenFailed({ error: technicalErrorResponse })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'technical-error',
            });
        });

        it('should set the state when unexpected Error', () => {
            const state = teilnahmeFeature.reducer(
                previousState,
                TeilnahmeActions.teilnahmeLadenFailed({
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
        it('should set the teilnahme and teilnahmeLoadState when teilnahme angemeldet', () => {
            const previousState: TeilnahmeState = {
                teilnahme: undefined,
                teilnahmeLoadState: 'not-found',
            };

            const state = teilnahmeFeature.reducer(previousState, TeilnahmeActions.teilnahmeAngemeldet({ teilnahme }));

            expect(state).toEqual({
                teilnahme,
                teilnahmeLoadState: 'loaded',
            });
        });
    });
});
