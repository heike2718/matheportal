import { initialSchulteilnahmeState, schulteilnahmeFeature, SchulteilnahmeState } from './schulteilnahme.reducer';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { createSchulteilnahmeTestdaten } from './schulteilnahme.reducer.testdaten';

describe('schulteilnahmeReducer: Klassen', () => {
    const { teilnahme, person, klassen, klassenAndereSchule, fehlerfaelle } = createSchulteilnahmeTestdaten();

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
        it.each(fehlerfaelle)(
            'should clear classes and set klassenLoadState for $name and the same school',
            ({ error, loadState }) => {
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
                    klassenLoadState: loadState,
                    ausgewaehlteKlasse: undefined,
                });
            }
        );

        it.each(fehlerfaelle.filter(fehlerfall => fehlerfall.name !== 'not-found'))(
            'should ignore a late $name for another school',
            ({ name, error }) => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: { ...teilnahme, angemeldetDurch: person },
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState: 'loaded',
                    klassen: name === 'technical-error' ? [] : klassen,
                    klassenLoadState: name === 'technical-error' ? 'not-loaded' : 'loaded',
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
            }
        );

        describe.each(fehlerfaelle)('without teilnahme and $name', ({ error }) => {
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
