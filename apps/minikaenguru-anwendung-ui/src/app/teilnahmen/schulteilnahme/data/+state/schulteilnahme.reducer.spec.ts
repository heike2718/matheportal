import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { userLoggedOut } from '@matheportal/auth-api';
import { Person, Teilnahme } from '../../../model/teilnahme.model';
import { DURCHFUEHRUNGSART } from '../../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import {
    lehrpersonBerechtigungVerweigert,
    schuleAusgewaehlt,
} from '../../../../lehrperson/api/lehrperson-store.events';
import { initialSchulteilnahmeState, schulteilnahmeFeature, SchulteilnahmeState } from './schulteilnahme.reducer';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { Klasse } from '../../model/klasse.model';

describe('teilnahmeReducer', () => {
    const teilnahme: Teilnahme = {
        angemeldetAm: '02.04.2026',
        anzahlKinder: 3,
        anzahlKlassen: 1,
        anzahlLoesungszettel: 2,
        auswertungsart: 'ONLINE',
        durchfuehrungsart: 'SCHULE',
        jahr: 2026,
        kuerzel: 'S1234567',
    };

    const fuchsklasse: Klasse = {
        name: 'Fuchsklasse',
        schulkuerzel: 'S1234567',
        uuid: 'abcdef',
    };

    const tuxklasse: Klasse = {
        name: 'Tuxklasse',
        schulkuerzel: 'S1234567',
        uuid: '123456',
    };

    const klassen: Klasse[] = [fuchsklasse, tuxklasse];

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
            const state = schulteilnahmeFeature.reducer(undefined, unknownAction);
            expect(state).toBe(initialSchulteilnahmeState);
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme,
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
            };
            const state = schulteilnahmeFeature.reducer(previousState, unknownAction);
            expect(state).toBe(previousState);
        });
    });

    describe('userLoggedOut', () => {
        it('should reset its state when logged out', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme,
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            expect(schulteilnahmeFeature.reducer(previousState, userLoggedOut)).toBe(initialSchulteilnahmeState);
        });
    });

    describe('schulteilnahmeLaden', () => {
        const schulkuerzel = 'S1234567';
        it.each(['not-loaded', 'forbidden', 'unauthorized'] as const)(
            'should return the previous state when loadState is %s',
            loadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: loadState,
                    anmeldendePersonLoadState: 'not-loaded',
                    klassen: [],
                    klassenLoadState: 'not-loaded',
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel })
                );

                expect(state).toBe(previousState);
            }
        );

        it('should return previous state when loadState is loaded and kuerzel is equal', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme,
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel: 'S1234567' })
            );

            expect(state).toBe(previousState);
        });

        it('should reset state when loadState is technical-error and kuerzel is equal', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme,
                teilnahmeLoadState: 'technical-error',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel: 'S1234567' })
            );

            expect(state).toBe(initialSchulteilnahmeState);
        });

        it.each(['loaded', 'technical-error'] as const)(
            'should reset state state when loadState is %s and kuerzel is different',
            loadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: loadState,
                    anmeldendePersonLoadState: 'not-loaded',
                    klassen,
                    klassenLoadState: 'loaded',
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel: '7654321S' })
                );

                expect(state).toBe(initialSchulteilnahmeState);
            }
        );
    });

    describe('teilnahmeGeladen', () => {
        it('should set the state when teilnahmeGeladen', () => {
            expect(
                schulteilnahmeFeature.reducer(
                    initialSchulteilnahmeState,
                    SchulteilnahmeActions.teilnahmeGeladen({ teilnahme })
                )
            ).toEqual({
                teilnahme,
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
            });
        });
    });

    describe('teilnahmeLadenFailed', () => {
        const previousState: SchulteilnahmeState = {
            teilnahme: undefined,
            teilnahmeLoadState: 'not-loaded',
            anmeldendePersonLoadState: 'not-loaded',
            klassen,
            klassenLoadState: 'loaded',
        };

        it('should reset all attributes and set teilnahmeLoadState when teilnahmeLadenFailed with unauthorized', () => {
            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.teilnahmeLadenFailed({ error: unauthorizedErrorResponse })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'unauthorized',
                anmeldendePersonLoadState: 'not-loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
            });
        });

        it('should reset all attributes and set teilnahmeLoadState when teilnahmeLadenFailed with forbidden', () => {
            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.teilnahmeLadenFailed({ error: forbiddenErrorResponse })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'forbidden',
                anmeldendePersonLoadState: 'not-loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
            });
        });

        it('should reset all attributes and set teilnahmeLoadState when teilnahmeLadenFailed with not-found', () => {
            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.teilnahmeLadenFailed({ error: notFoundResponse })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'not-found',
                anmeldendePersonLoadState: 'not-loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
            });
        });

        it('should reset all attributes and set teilnahmeLoadState when teilnahmeLadenFailed with technical-error', () => {
            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.teilnahmeLadenFailed({ error: technicalErrorResponse })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'technical-error',
                anmeldendePersonLoadState: 'not-loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
            });
        });
        it('should reset all attributes and set teilnahmeLoadState when teilnahmeLadenFailed with unexpected error', () => {
            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.teilnahmeLadenFailed({ error: new Error('uiuiui') })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'technical-error',
                anmeldendePersonLoadState: 'not-loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
            });
        });
    });

    describe('teilnahmeAngemeldet', () => {
        it('should set the teilnahme and teilnahmeLoadState when teilnahme angemeldet and SchulteilnahmeState initial', () => {
            const state = schulteilnahmeFeature.reducer(
                initialSchulteilnahmeState,
                SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme })
            );

            expect(state).toEqual({
                teilnahme,
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
            });
        });
    });

    describe('anmeldendePerson tests', () => {
        it('should not change the state when teilnahme undefined', () => {
            const state = schulteilnahmeFeature.reducer(
                initialSchulteilnahmeState,
                SchulteilnahmeActions.anmeldendePersonGeladen({
                    person: { schulkuerzel: '7654321S', fullName: 'Leo Lemma' },
                })
            );

            expect(state).toBe(initialSchulteilnahmeState);
        });

        it('should set angemeldetDurch and the load state when anmeldendePersonGeladen and same schulkuerzel', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: undefined,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const person: Person = {
                schulkuerzel: 'S1234567',
                fullName: 'Rita Reihe',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonGeladen({ person })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: {
                        schulkuerzel: 'S1234567',
                        fullName: 'Rita Reihe',
                    },
                    anzahlKinder: 3,
                    anzahlKlassen: 1,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            });
        });

        it('should not change the anmeldende person and the anmeldendePersonLoadState when Person belongs to another school', () => {
            const person: Person = {
                schulkuerzel: 'S1234567',
                fullName: 'Rita Reihe',
            };

            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonGeladen({
                    person: { schulkuerzel: '7654321S', fullName: 'Leo Lemma' },
                })
            );

            expect(state).toBe(previousState);
        });

        it.each(['not-loaded', 'not-found', 'unauthorized', 'forbidden', 'technical-error'] as const)(
            'should not change the anmeldende person and the anmeldendePersonLoadState when anmeldendePersonLadState %s and angemeldetePerson belongs to another school',
            anmeldendePersonLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: {
                        ...teilnahme,
                        durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                        kuerzel: 'S1234567',
                    },
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState,
                    klassen,
                    klassenLoadState: 'loaded',
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.anmeldendePersonGeladen({
                        person: { schulkuerzel: '7654321S', fullName: 'Leo Lemma' },
                    })
                );

                expect(state).toBe(previousState);
            }
        );

        it('should reset the anmeldende person and set the load state when anmeldendePersonLadenFailed with technical-error and the same schulkuerzel', () => {
            const person: Person = {
                schulkuerzel: 'S1234567',
                fullName: 'Rita Reihe',
            };

            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonLadenFailed({
                    schulkuerzel: 'S1234567',
                    error: technicalErrorResponse,
                })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: undefined,
                    anzahlKinder: 3,
                    anzahlKlassen: 1,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'technical-error',
                klassen,
                klassenLoadState: 'loaded',
            });
        });

        it('should ignore anmeldendePersonLadenFailed with technical-error for another schulkuerzel (trifft verspätet ein)', () => {
            const person: Person = {
                schulkuerzel: 'S1234567',
                fullName: 'Rita Reihe',
            };

            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonLadenFailed({
                    schulkuerzel: '7654321S',
                    error: technicalErrorResponse,
                })
            );

            expect(state).toBe(previousState);
        });

        it('should reset the anmeldende person and set the load state when anmeldendePersonLadenFailed with unauthorized and the same schulkuerzel', () => {
            const person: Person = {
                schulkuerzel: 'S1234567',
                fullName: 'Rita Reihe',
            };

            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonLadenFailed({
                    schulkuerzel: 'S1234567',
                    error: unauthorizedErrorResponse,
                })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: undefined,
                    anzahlKinder: 3,
                    anzahlKlassen: 1,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'unauthorized',
                klassen,
                klassenLoadState: 'loaded',
            });
        });

        it('should ignore anmeldendePersonLadenFailed with unauthorized when it has another schulkuerzel (trifft verspätet ein)', () => {
            const person: Person = {
                schulkuerzel: 'S1234567',
                fullName: 'Rita Reihe',
            };

            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonLadenFailed({
                    schulkuerzel: '7654321S',
                    error: unauthorizedErrorResponse,
                })
            );

            expect(state).toBe(previousState);
        });

        it('should reset the anmeldende person and set the load state when anmeldendePersonLadenFailed with forbidden and the same schulkuerzel', () => {
            const person: Person = {
                schulkuerzel: 'S1234567',
                fullName: 'Rita Reihe',
            };

            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonLadenFailed({
                    schulkuerzel: 'S1234567',
                    error: forbiddenErrorResponse,
                })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: undefined,
                    anzahlKinder: 3,
                    anzahlKlassen: 1,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'forbidden',
                klassen,
                klassenLoadState: 'loaded',
            });
        });

        it('should ignore anmeldendePersonLadenFailed with forbidden when it has another schulkuerzel (trifft verspätet ein)', () => {
            const person: Person = {
                schulkuerzel: 'S1234567',
                fullName: 'Rita Reihe',
            };

            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonLadenFailed({
                    schulkuerzel: '7654321S',
                    error: forbiddenErrorResponse,
                })
            );

            expect(state).toBe(previousState);
        });

        it('should reset the anmeldende person and set the load state when anmeldendePersonLadenFailed with not-found and the same schulkuerzel', () => {
            const person: Person = {
                schulkuerzel: 'S1234567',
                fullName: 'Rita Reihe',
            };

            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonLadenFailed({ schulkuerzel: 'S1234567', error: notFoundResponse })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: undefined,
                    anzahlKinder: 3,
                    anzahlKlassen: 1,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-found',
                klassen,
                klassenLoadState: 'loaded',
            });
        });

        it('should ignore anmeldendePersonLadenFailed with not-found when it has another schulkuerzel (trifft verspätet ein)', () => {
            const person: Person = {
                schulkuerzel: 'S1234567',
                fullName: 'Rita Reihe',
            };

            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonLadenFailed({ schulkuerzel: '7654321S', error: notFoundResponse })
            );

            expect(state).toBe(previousState);
        });

        it('should reset the anmeldende person and set the load state when anmeldendePersonLadenFailed with unexpected error with same schulkuerzel', () => {
            const person: Person = {
                schulkuerzel: 'S1234567',
                fullName: 'Rita Reihe',
            };

            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonLadenFailed({
                    schulkuerzel: 'S1234567',
                    error: new Error('uiuiui'),
                })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: undefined,
                    anzahlKinder: 3,
                    anzahlKlassen: 1,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'technical-error',
                klassen,
                klassenLoadState: 'loaded',
            });
        });

        it('should ignore anmeldendePersonLadenFailed with unexpected error when it has another schulkuerzel (trifft verspätet ein)', () => {
            const person: Person = {
                schulkuerzel: 'S1234567',
                fullName: 'Rita Reihe',
            };

            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                    kuerzel: 'S1234567',
                    angemeldetDurch: person,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonLadenFailed({
                    schulkuerzel: '7654321S',
                    error: new Error('uiuiui'),
                })
            );

            expect(state).toBe(previousState);
        });

        it.each(['not-loaded', 'unauthorized', 'forbidden', 'not-found', 'technical-error'] as const)(
            'should ignore anmeldendePersonLadenFailed on unauthorized (trifft verspätet ein) when teilnahme undefined and teilnahmeLoadState is %s',
            teilnahmeLoadState => {
                const previousState: SchulteilnahmeState = {
                    ...initialSchulteilnahmeState,
                    teilnahmeLoadState,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.anmeldendePersonLadenFailed({
                        schulkuerzel: 'S1234567',
                        error: unauthorizedErrorResponse,
                    })
                );

                expect(state).toBe(previousState);
            }
        );

        it.each(['not-loaded', 'unauthorized', 'forbidden', 'not-found', 'technical-error'] as const)(
            'should ignore anmeldendePersonLadenFailed on forbidden (trifft verspätet ein) when teilnahme undefined and teilnahmeLoadState is %s',
            teilnahmeLoadState => {
                const previousState: SchulteilnahmeState = {
                    ...initialSchulteilnahmeState,
                    teilnahmeLoadState,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.anmeldendePersonLadenFailed({
                        schulkuerzel: 'S1234567',
                        error: forbiddenErrorResponse,
                    })
                );

                expect(state).toBe(previousState);
            }
        );

        it.each(['not-loaded', 'unauthorized', 'forbidden', 'not-found', 'technical-error'] as const)(
            'should ignore anmeldendePersonLadenFailed on not-found (trifft verspätet ein) when teilnahme undefined and teilnahmeLoadState is %s',
            teilnahmeLoadState => {
                const previousState: SchulteilnahmeState = {
                    ...initialSchulteilnahmeState,
                    teilnahmeLoadState,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.anmeldendePersonLadenFailed({
                        schulkuerzel: 'S1234567',
                        error: notFoundResponse,
                    })
                );

                expect(state).toBe(previousState);
            }
        );

        it.each(['not-loaded', 'unauthorized', 'forbidden', 'not-found', 'technical-error'] as const)(
            'should ignore anmeldendePersonLadenFailed on technical-error (trifft verspätet ein) when teilnahme undefined and teilnahmeLoadState is %s',
            teilnahmeLoadState => {
                const previousState: SchulteilnahmeState = {
                    ...initialSchulteilnahmeState,
                    teilnahmeLoadState,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.anmeldendePersonLadenFailed({
                        schulkuerzel: 'S1234567',
                        error: technicalErrorResponse,
                    })
                );

                expect(state).toBe(previousState);
            }
        );

        it.each(['not-loaded', 'unauthorized', 'forbidden', 'not-found', 'technical-error'] as const)(
            'should ignore anmeldendePersonLadenFailed on unexpected Error (trifft verspätet ein) when teilnahme undefined and teilnahmeLoadState is %s',
            teilnahmeLoadState => {
                const previousState: SchulteilnahmeState = {
                    ...initialSchulteilnahmeState,
                    teilnahmeLoadState,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.anmeldendePersonLadenFailed({
                        schulkuerzel: 'S1234567',
                        error: new Error('uiuiui'),
                    })
                );

                expect(state).toBe(previousState);
            }
        );
    });

    describe('lehrpersonBerechtigungVerweigert', () => {
        const schulteilnahme: Teilnahme = {
            ...teilnahme,
            durchfuehrungsart: 'SCHULE',
            kuerzel: 'S1234567',
            angemeldetDurch: { schulkuerzel: 'S1234567', fullName: 'Rita Reihe' },
        };

        it('should reset the state when lehrpersonBerechtigungVerweigert', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: schulteilnahme,
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(previousState, lehrpersonBerechtigungVerweigert);

            expect(state).toBe(initialSchulteilnahmeState);
        });
    });

    describe('schuleAusgewaehlt', () => {
        const schulteilnahme: Teilnahme = {
            angemeldetAm: '02.04.2026',
            angemeldetDurch: undefined,
            anzahlKinder: 3,
            anzahlKlassen: 1,
            anzahlLoesungszettel: 2,
            auswertungsart: 'ONLINE',
            durchfuehrungsart: 'SCHULE',
            jahr: 2026,
            kuerzel: 'S1234567',
        };

        it('should reset to initial state when schuleAusgewaehlt with other schulkuerzel', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...schulteilnahme,
                    angemeldetDurch: { schulkuerzel: 'S1234567', fullName: 'Rita Reihe' },
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
            };

            const state = schulteilnahmeFeature.reducer(previousState, schuleAusgewaehlt({ schulkuerzel: '7654321S' }));

            expect(state).toBe(initialSchulteilnahmeState);
        });

        it.each(['not-loaded', 'loaded', 'not-found', 'unauthorized', 'forbidden', 'technical-error'] as const)(
            'should not change the state when schuleAusgewaehlt with same schulkuerzel in case anmeldendePersonLoadState is %s',
            anmeldendePersonLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: schulteilnahme,
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState,
                    klassen,
                    klassenLoadState: 'loaded',
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    schuleAusgewaehlt({ schulkuerzel: 'S1234567' })
                );

                expect(state).toBe(initialSchulteilnahmeState);
            }
        );

        it.each(['not-loaded', 'loaded', 'not-found', 'unauthorized', 'forbidden', 'technical-error'] as const)(
            'should not change  state when schuleAusgewaehlt with same schulkuerzel in case teilnahmeLoadState is %s',
            teilnahmeLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: schulteilnahme,
                    teilnahmeLoadState,
                    anmeldendePersonLoadState: 'not-loaded',
                    klassen,
                    klassenLoadState: 'loaded',
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    schuleAusgewaehlt({ schulkuerzel: 'S1234567' })
                );

                expect(state).toBe(initialSchulteilnahmeState);
            }
        );
    });
});
