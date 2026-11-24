import { initialSchulteilnahmeState, schulteilnahmeFeature, SchulteilnahmeState } from './schulteilnahme.reducer';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { createSchulteilnahmeTestdaten } from './schulteilnahme.reducer.testdaten';

describe('schulteilnahmeReducer: anmeldende Person', () => {
    const { teilnahme, person, fremdePerson, klassen, fehler } = createSchulteilnahmeTestdaten();

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
            'should clear the person and set the load state to $expectedLoadState for $name and the same school',
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
                    anmeldendePersonLoadState: expectedLoadState,
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

        it.each(fehlerBeimLaden)('should ignore a late $name for another school', ({ error }) => {
            const previousState: SchulteilnahmeState = {
                teilnahme: { ...teilnahme, angemeldetDurch: person },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: error === fehler.unexpected ? klassen[0] : undefined,
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
