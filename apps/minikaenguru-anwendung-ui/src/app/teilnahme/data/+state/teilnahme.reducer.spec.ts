import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { userLoggedOut } from '@matheportal/auth-api';
import { Person, Teilnahme } from '../../model/teilnahme.model';
import { initialTeilnahmeState, teilnahmeFeature, TeilnahmeState } from './teilnahme.reducer';
import { TeilnahmeActions } from './teilnahme.actions';
import { DURCHFUEHRUNGSART } from '../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { schuleDataProvider } from '../../../schule/api/schule-data.provider';
import { lehrpersonBerechtigungVerweigert } from '../../../lehrperson/api/lehrperson-store.events';

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
            const state = teilnahmeFeature.reducer(undefined, unknownAction);
            expect(state).toBe(initialTeilnahmeState);
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const previousState: TeilnahmeState = {
                teilnahme: undefined,
                teilnahmeLoadState: 'not-loaded',
                anmeldendePersonLoadState: 'not-loaded',
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
                anmeldendePersonLoadState: 'not-loaded',
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
                    anmeldendePersonLoadState: 'not-loaded',
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
                    anmeldendePersonLoadState: 'not-loaded',
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
                    anmeldendePersonLoadState: 'not-loaded',
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
                    anmeldendePersonLoadState: 'not-loaded',
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
                    anmeldendePersonLoadState: 'not-loaded',
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
                anmeldendePersonLoadState: 'not-loaded',
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
                anmeldendePersonLoadState: 'not-loaded',
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
                    anmeldendePersonLoadState: 'not-loaded',
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
                anmeldendePersonLoadState: 'not-loaded',
            });
        });
    });

    describe('teilnahmeLadenFailed', () => {
        const previousState: TeilnahmeState = {
            teilnahme,
            teilnahmeLoadState: 'not-loaded',
            anmeldendePersonLoadState: 'not-loaded',
        };

        it.each(['SCHULE', 'PRIVAT'] as const)(
            'should set the state when unauthorized and durchfuehrungsart %s',
            durchfuehrungsart => {
                const state = teilnahmeFeature.reducer(
                    previousState,
                    TeilnahmeActions.teilnahmeLadenFailed({ durchfuehrungsart, error: unauthorizedErrorResponse })
                );

                expect(state).toEqual({
                    teilnahme: undefined,
                    teilnahmeLoadState: 'unauthorized',
                    anmeldendePersonLoadState: 'not-loaded',
                });
            }
        );

        it.each(['SCHULE', 'PRIVAT'] as const)(
            'should set the state when forbidden and durchfuehrungsart %s',
            durchfuehrungsart => {
                const state = teilnahmeFeature.reducer(
                    previousState,
                    TeilnahmeActions.teilnahmeLadenFailed({ durchfuehrungsart, error: forbiddenErrorResponse })
                );

                expect(state).toEqual({
                    teilnahme: undefined,
                    teilnahmeLoadState: 'forbidden',
                    anmeldendePersonLoadState: 'not-loaded',
                });
            }
        );

        it.each(['SCHULE', 'PRIVAT'] as const)(
            'should set the state when technical-error and durchfuehrungsart %s',
            durchfuehrungsart => {
                const state = teilnahmeFeature.reducer(
                    previousState,
                    TeilnahmeActions.teilnahmeLadenFailed({ durchfuehrungsart, error: technicalErrorResponse })
                );

                expect(state).toEqual({
                    teilnahme: undefined,
                    teilnahmeLoadState: 'technical-error',
                    anmeldendePersonLoadState: 'not-loaded',
                });
            }
        );

        it.each(['SCHULE', 'PRIVAT'] as const)(
            'should set the state when unexpected Error and durchfuehrungsart %s',
            durchfuehrungsart => {
                const state = teilnahmeFeature.reducer(
                    previousState,
                    TeilnahmeActions.teilnahmeLadenFailed({
                        durchfuehrungsart,
                        error: new Error('das ist jetzt wirklich unerwartet.'),
                    })
                );

                expect(state).toEqual({
                    teilnahme: undefined,
                    teilnahmeLoadState: 'technical-error',
                    anmeldendePersonLoadState: 'not-loaded',
                });
            }
        );
    });

    describe('teilnahmeAngemeldet', () => {
        it('should set the teilnahme and teilnahmeLoadState when teilnahme angemeldet', () => {
            const previousState: TeilnahmeState = {
                teilnahme: undefined,
                teilnahmeLoadState: 'not-found',
                anmeldendePersonLoadState: 'not-loaded',
            };

            const state = teilnahmeFeature.reducer(previousState, TeilnahmeActions.teilnahmeAngemeldet({ teilnahme }));

            expect(state).toEqual({
                teilnahme,
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
            });
        });
    });

    describe('anmeldendePerson tests', () => {
        it('should set angemeldet durch and the load state when anmeldendePersonGeladen and same schulkuerzel', () => {
            const previousState: TeilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: undefined,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
            };

            const person: Person = {
                schulkuerzel: 'S12345678',
                fullName: 'Rita Reihe',
            };

            const state = teilnahmeFeature.reducer(previousState, TeilnahmeActions.anmeldendePersonGeladen({ person }));

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: {
                        schulkuerzel: 'S12345678',
                        fullName: 'Rita Reihe',
                    },
                    anzahlKinder: 3,
                    anzahlKlassen: 0,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
            });
        });

        it('should not change the anmeldende person but set the load state when loaded but other school', () => {
            const person: Person = {
                schulkuerzel: 'S12345678',
                fullName: 'Rita Reihe',
            };

            const previousState: TeilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
            };

            const state = teilnahmeFeature.reducer(
                previousState,
                TeilnahmeActions.anmeldendePersonGeladen({ person: { schulkuerzel: '7654321', fullName: 'Leo Lemma' } })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: {
                        schulkuerzel: 'S12345678',
                        fullName: 'Rita Reihe',
                    },
                    anzahlKinder: 3,
                    anzahlKlassen: 0,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
            });
        });

        it('should reset the anmeldende person and set the load state when anmeldendePersonLadenFailed with technical-error', () => {
            const person: Person = {
                schulkuerzel: 'S12345678',
                fullName: 'Rita Reihe',
            };

            const previousState: TeilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
            };

            const state = teilnahmeFeature.reducer(
                previousState,
                TeilnahmeActions.anlemdendePersonLadenFailed({ error: technicalErrorResponse })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: undefined,
                    anzahlKinder: 3,
                    anzahlKlassen: 0,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'technical-error',
            });
        });

        it('should reset the anmeldende person and set the load state when anmeldendePersonLadenFailed with unauthorized', () => {
            const person: Person = {
                schulkuerzel: 'S12345678',
                fullName: 'Rita Reihe',
            };

            const previousState: TeilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
            };

            const state = teilnahmeFeature.reducer(
                previousState,
                TeilnahmeActions.anlemdendePersonLadenFailed({ error: unauthorizedErrorResponse })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: undefined,
                    anzahlKinder: 3,
                    anzahlKlassen: 0,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'unauthorized',
            });
        });

        it('should reset the anmeldende person and set the load state when anmeldendePersonLadenFailed with forbidden', () => {
            const person: Person = {
                schulkuerzel: 'S12345678',
                fullName: 'Rita Reihe',
            };

            const previousState: TeilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
            };

            const state = teilnahmeFeature.reducer(
                previousState,
                TeilnahmeActions.anlemdendePersonLadenFailed({ error: forbiddenErrorResponse })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: undefined,
                    anzahlKinder: 3,
                    anzahlKlassen: 0,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'forbidden',
            });
        });

        it('should reset the anmeldende person and set the load state when anmeldendePersonLadenFailed with not-found', () => {
            const person: Person = {
                schulkuerzel: 'S12345678',
                fullName: 'Rita Reihe',
            };

            const previousState: TeilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
            };

            const state = teilnahmeFeature.reducer(
                previousState,
                TeilnahmeActions.anlemdendePersonLadenFailed({ error: notFoundResponse })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: undefined,
                    anzahlKinder: 3,
                    anzahlKlassen: 0,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-found',
            });
        });

        it('should reset the anmeldende person and set the load state when anmeldendePersonLadenFailed with unexpected error', () => {
            const person: Person = {
                schulkuerzel: 'S12345678',
                fullName: 'Rita Reihe',
            };

            const previousState: TeilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
            };

            const state = teilnahmeFeature.reducer(
                previousState,
                TeilnahmeActions.anlemdendePersonLadenFailed({ error: new Error('uiuiui') })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: undefined,
                    anzahlKinder: 3,
                    anzahlKlassen: 0,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'technical-error',
            });
        });
    });

    describe('lehrpersonBerechtigungVerweigert', () => {
        const schulteilnahme: Teilnahme = {
            ...teilnahme,
            durchfuehrungsart: 'SCHULE',
            kuerzel: 'S1234567',
            angemeldetDurch: { schulkuerzel: 'S12345678', fullName: 'Rita Reihe' },
        };

        it('should reset the state when lehrpersonBerechtigungVerweigert', () => {
            const previousState: TeilnahmeState = {
                teilnahme: schulteilnahme,
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
            };

            const state = teilnahmeFeature.reducer(previousState, lehrpersonBerechtigungVerweigert);

            expect(state).toBe(initialTeilnahmeState);
        });
    });
});
