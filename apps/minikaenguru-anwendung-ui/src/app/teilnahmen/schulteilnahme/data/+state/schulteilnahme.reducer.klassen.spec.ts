import { initialSchulteilnahmeState, schulteilnahmeFeature, SchulteilnahmeState } from './schulteilnahme.reducer';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { createSchulteilnahmeTestdaten } from './schulteilnahme.reducer.testdaten';

describe('schulteilnahmeReducer: Klassen', () => {
    const { teilnahme, person, klassen, klassenAndereSchule, fehler } = createSchulteilnahmeTestdaten();

    describe('klassenLaden', () => {
        it('should reset klassen and klassenLoadState when teilname undefined', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: undefined,
                teilnahmeLoadState: 'not-loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klassenLaden({ schulkuerzel: 'S1234567' })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'not-loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
                ausgewaehlteKlasse: undefined,
            });
        });

        it.each(['loaded', 'not-found', 'technical-error'] as const)(
            'should reset klassen and klassenLoadState when teilnahme belongs to the same school and klassenLoadState is %s',
            klassenLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: {
                        ...teilnahme,
                        angemeldetDurch: {
                            schulkuerzel: 'S1234567',
                            fullName: 'Rita Reihe',
                        },
                    },
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState: 'loaded',
                    klassen,
                    klassenLoadState,
                    ausgewaehlteKlasse: undefined,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.klassenLaden({ schulkuerzel: 'S1234567' })
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
                    klassen: [],
                    klassenLoadState: 'not-loaded',
                    ausgewaehlteKlasse: undefined,
                });
            }
        );

        it.each(['unauthorized', 'forbidden'] as const)(
            'should preserve the state when teilnahme belongs to the same school and klassenLoadState is %s',
            klassenLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: {
                        ...teilnahme,
                        angemeldetDurch: {
                            schulkuerzel: 'S1234567',
                            fullName: 'Rita Reihe',
                        },
                    },
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState: 'loaded',
                    klassen,
                    klassenLoadState,
                    ausgewaehlteKlasse: undefined,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.klassenLaden({ schulkuerzel: 'S1234567' })
                );

                expect(state).toBe(previousState);
            }
        );

        it.each(['loaded', 'not-found', 'technical-error', 'forbidden'] as const)(
            'should reset klassen and klassenLoadState when teilnahme belongs to another school and klassenLoadState is %s',
            klassenLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: {
                        ...teilnahme,
                        angemeldetDurch: {
                            schulkuerzel: 'S1234567',
                            fullName: 'Rita Reihe',
                        },
                    },
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState: 'loaded',
                    klassen,
                    klassenLoadState,
                    ausgewaehlteKlasse: undefined,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.klassenLaden({ schulkuerzel: '7654321S' })
                );

                expect(state).toEqual({
                    teilnahme: {
                        ...teilnahme,
                        angemeldetDurch: {
                            schulkuerzel: 'S1234567',
                            fullName: 'Rita Reihe',
                        },
                    },
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState: 'loaded',
                    klassen: [],
                    klassenLoadState: 'not-loaded',
                    ausgewaehlteKlasse: undefined,
                });
            }
        );

        it('should preserve the state when klassenLoadState is unauthorized and teilnahme belongs to another school', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    angemeldetDurch: {
                        schulkuerzel: 'S1234567',
                        fullName: 'Rita Reihe',
                    },
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'unauthorized',
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klassenLaden({ schulkuerzel: '7654321S' })
            );

            expect(state).toBe(previousState);
        });

        it.each(['unauthorized', 'forbidden'] as const)(
            'should preserve klassen and klassenLoadState when teilnahme belongs to the same school and klassenLoadState is %s',
            klassenLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: {
                        ...teilnahme,
                        angemeldetDurch: {
                            schulkuerzel: 'S1234567',
                            fullName: 'Rita Reihe',
                        },
                    },
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState: 'loaded',
                    klassen,
                    klassenLoadState,
                    ausgewaehlteKlasse: undefined,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.klassenLaden({ schulkuerzel: 'S1234567' })
                );

                expect(state).toBe(previousState);
            }
        );
    });

    describe('klasseAusgewaehlt', () => {
        it('should reset klassen and klassenLoadState when teilname undefined', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: undefined,
                teilnahmeLoadState: 'not-loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klasseAusgewaehlt({ klasse: klassenAndereSchule[0] })
            );

            expect(state).toEqual({
                teilnahme: undefined,
                teilnahmeLoadState: 'not-loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
                ausgewaehlteKlasse: undefined,
            });
        });

        it.each(['unauthorized', 'forbidden'] as const)(
            'should preserve state when the action belongs to the same school and klassenLoadState is %s',
            klassenLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: {
                        ...teilnahme,
                        angemeldetDurch: {
                            schulkuerzel: 'S1234567',
                            fullName: 'Rita Reihe',
                        },
                    },
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState: 'loaded',
                    klassen,
                    klassenLoadState,
                    ausgewaehlteKlasse: undefined,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.klasseAusgewaehlt({ klasse: klassen[0] })
                );

                expect(state).toBe(previousState);
            }
        );

        it.each(['loaded', 'not-loaded', 'not-found', 'technical-error'] as const)(
            'should reset klassen and klassenLoadState state when the action belongs to the same school and klassenLoadState is %s',
            klassenLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: {
                        ...teilnahme,
                        angemeldetDurch: {
                            schulkuerzel: 'S1234567',
                            fullName: 'Rita Reihe',
                        },
                    },
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState: 'loaded',
                    klassen,
                    klassenLoadState,
                    ausgewaehlteKlasse: undefined,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.klasseAusgewaehlt({ klasse: klassen[0] })
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
                    klassen: [],
                    klassenLoadState: 'not-loaded',
                    ausgewaehlteKlasse: undefined,
                });
            }
        );

        it.each(['loaded', 'not-loaded', 'not-found', 'technical-error', 'forbidden', 'unauthorized'] as const)(
            'should reset klassen and klassenLoadState state when the action belongs to another school and klassenLoadState is %s',
            klassenLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: {
                        ...teilnahme,
                        angemeldetDurch: {
                            schulkuerzel: 'S1234567',
                            fullName: 'Rita Reihe',
                        },
                    },
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState: 'loaded',
                    klassen,
                    klassenLoadState,
                    ausgewaehlteKlasse: undefined,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.klasseAusgewaehlt({ klasse: klassenAndereSchule[0] })
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
                    klassen: [],
                    klassenLoadState: 'not-loaded',
                    ausgewaehlteKlasse: undefined,
                });
            }
        );
    });

    describe('klassenGeladen', () => {
        it('should not change the state when teilnahme undefined', () => {
            const state = schulteilnahmeFeature.reducer(
                initialSchulteilnahmeState,
                SchulteilnahmeActions.klassenGeladen({ schulkuerzel: '7654321S', klassen })
            );

            expect(state).toBe(initialSchulteilnahmeState);
        });

        it('should set klassen and the load state for the same school', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: { ...teilnahme, angemeldetDurch: person },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klassenGeladen({ schulkuerzel: 'S1234567', klassen })
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
                klassen: [
                    {
                        name: 'Fuchsklasse',
                        schulkuerzel: 'S1234567',
                        uuid: 'abcdef',
                    },
                    {
                        name: 'Tuxklasse',
                        schulkuerzel: 'S1234567',
                        uuid: '123456',
                    },
                ],
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: undefined,
            });
        });

        it('should preserve state when the action belongs to another school', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme,
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klassenGeladen({ schulkuerzel: '7654321S', klassen })
            );

            expect(state).toBe(previousState);
        });

        it.each(['not-loaded', 'not-found', 'unauthorized', 'forbidden', 'technical-error'] as const)(
            'should ignore classes from another school when klassenLoadState is %s',
            klassenLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState: 'loaded',
                    klassen: [],
                    klassenLoadState,
                    ausgewaehlteKlasse: undefined,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.klassenGeladen({ schulkuerzel: '7654321S', klassen })
                );

                expect(state).toBe(previousState);
            }
        );
    });

    describe('klassenLadenFailed', () => {
        const fehlerBeimLaden = [
            { name: 'HTTP 401', error: fehler.http401 },
            { name: 'HTTP 403', error: fehler.http403 },
            { name: 'HTTP 404', error: fehler.http404 },
            { name: 'HTTP 500', error: fehler.http500 },
            { name: 'unexpected error', error: fehler.unexpected },
        ];

        it.each([
            { name: 'HTTP 401', error: fehler.http401, expectedLoadState: 'unauthorized' },
            { name: 'HTTP 403', error: fehler.http403, expectedLoadState: 'forbidden' },
            { name: 'HTTP 404', error: fehler.http404, expectedLoadState: 'not-found' },
            { name: 'HTTP 500', error: fehler.http500, expectedLoadState: 'technical-error' },
            { name: 'unexpected error', error: fehler.unexpected, expectedLoadState: 'technical-error' },
        ] as const)(
            'should clear classes and set klassenLoadState to $expectedLoadState for $name and the same school',
            ({ error, expectedLoadState }) => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: { ...teilnahme, angemeldetDurch: person },
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState: 'loaded',
                    klassen,
                    klassenLoadState: 'loaded',
                    ausgewaehlteKlasse: undefined,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.klassenLadenFailed({
                        schulkuerzel: 'S1234567',
                        error,
                    })
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
                    klassen: [],
                    klassenLoadState: expectedLoadState,
                    ausgewaehlteKlasse: undefined,
                });
            }
        );

        it.each([
            { name: 'HTTP 401', error: fehler.http401 },
            { name: 'HTTP 403', error: fehler.http403 },
            { name: 'HTTP 500', error: fehler.http500 },
            { name: 'unexpected error', error: fehler.unexpected },
        ])('should ignore a late $name for another school', ({ error }) => {
            const previousState: SchulteilnahmeState = {
                teilnahme: { ...teilnahme, angemeldetDurch: person },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen: error === fehler.http500 ? [] : klassen,
                klassenLoadState: error === fehler.http500 ? 'not-loaded' : 'loaded',
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klassenLadenFailed({
                    schulkuerzel: '7654321S',
                    error,
                })
            );

            expect(state).toBe(previousState);
        });

        describe.each(fehlerBeimLaden)('without teilnahme and $name', ({ error }) => {
            it.each(['not-loaded', 'unauthorized', 'forbidden', 'not-found', 'technical-error'] as const)(
                'should ignore the error when teilnahmeLoadState is %s',
                teilnahmeLoadState => {
                    const previousState: SchulteilnahmeState = {
                        ...initialSchulteilnahmeState,
                        teilnahmeLoadState,
                    };

                    const state = schulteilnahmeFeature.reducer(
                        previousState,
                        SchulteilnahmeActions.klassenLadenFailed({
                            schulkuerzel: 'S1234567',
                            error,
                        })
                    );

                    expect(state).toBe(previousState);
                }
            );
        });
    });
});
