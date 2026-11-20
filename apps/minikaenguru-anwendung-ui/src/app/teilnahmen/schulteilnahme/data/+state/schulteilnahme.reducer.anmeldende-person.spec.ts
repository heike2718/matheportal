import { initialSchulteilnahmeState, schulteilnahmeFeature, SchulteilnahmeState } from './schulteilnahme.reducer';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { createSchulteilnahmeTestdaten } from './schulteilnahme.reducer.testdaten';

describe('schulteilnahmeReducer: anmeldende Person', () => {
    const { teilnahme, person, fremdePerson, klassen, fehlerfaelle } = createSchulteilnahmeTestdaten();

    describe('anmeldendePersonGeladen', () => {
        it('should not change the state when teilnahme undefined', () => {
            const state = schulteilnahmeFeature.reducer(
                initialSchulteilnahmeState,
                SchulteilnahmeActions.anmeldendePersonGeladen({ person: fremdePerson })
            );

            expect(state).toBe(initialSchulteilnahmeState);
        });

        it('should set angemeldetDurch and the load state for the same school', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: { ...teilnahme, angemeldetDurch: undefined },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: undefined,
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

        it('should preserve the state when the received person belongs to another school', () => {
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
                SchulteilnahmeActions.anmeldendePersonGeladen({ person: fremdePerson })
            );

            expect(state).toBe(previousState);
        });

        it.each(['not-loaded', 'not-found', 'unauthorized', 'forbidden', 'technical-error'] as const)(
            'should ignore a person from another school when anmeldendePersonLoadState is %s',
            anmeldendePersonLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState,
                    klassen,
                    klassenLoadState: 'loaded',
                    ausgewaehlteKlasse: undefined,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.anmeldendePersonGeladen({ person: fremdePerson })
                );

                expect(state).toBe(previousState);
            }
        );
    });

    describe('anmeldendePersonLadenFailed', () => {
        it.each(fehlerfaelle)(
            'should clear the person and set the load state for $name and the same school',
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
                    SchulteilnahmeActions.anmeldendePersonLadenFailed({
                        schulkuerzel: 'S1234567',
                        error,
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
                    anmeldendePersonLoadState: loadState,
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
            }
        );

        it.each(fehlerfaelle)('should ignore a late $name for another school', ({ name, error }) => {
            const previousState: SchulteilnahmeState = {
                teilnahme: { ...teilnahme, angemeldetDurch: person },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: name === 'unexpected error' ? klassen[0] : undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.anmeldendePersonLadenFailed({
                    schulkuerzel: '7654321S',
                    error,
                })
            );

            expect(state).toBe(previousState);
        });

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
                        SchulteilnahmeActions.anmeldendePersonLadenFailed({
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
