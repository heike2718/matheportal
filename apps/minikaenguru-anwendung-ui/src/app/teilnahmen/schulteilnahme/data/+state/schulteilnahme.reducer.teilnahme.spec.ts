import { initialSchulteilnahmeState, schulteilnahmeFeature, SchulteilnahmeState } from './schulteilnahme.reducer';
import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { createSchulteilnahmeTestdaten } from './schulteilnahme.reducer.testdaten';

describe('schulteilnahmeReducer: Teilnahme', () => {
    const { teilnahme, klassen, fehlerfaelle } = createSchulteilnahmeTestdaten();

    describe('schulteilnahmeLaden', () => {
        it.each(['not-loaded', 'forbidden', 'unauthorized'] as const)(
            'should return the previous state when loadState is %s',
            teilnahmeLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState,
                    anmeldendePersonLoadState: 'not-loaded',
                    klassen: [],
                    klassenLoadState: 'not-loaded',
                    ausgewaehlteKlasse: undefined,
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel: 'S1234567' })
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
                ausgewaehlteKlasse: undefined,
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
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel: 'S1234567' })
            );

            expect(state).toBe(initialSchulteilnahmeState);
        });

        it.each(['loaded', 'technical-error'] as const)(
            'should reset state when loadState is %s and kuerzel is different',
            teilnahmeLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme,
                    teilnahmeLoadState,
                    anmeldendePersonLoadState: 'not-loaded',
                    klassen,
                    klassenLoadState: 'loaded',
                    ausgewaehlteKlasse: undefined,
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
            const state = schulteilnahmeFeature.reducer(
                initialSchulteilnahmeState,
                SchulteilnahmeActions.teilnahmeGeladen({ teilnahme })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    anzahlKinder: 3,
                    anzahlKlassen: 1,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
                ausgewaehlteKlasse: undefined,
            });
        });
    });

    describe('teilnahmeLadenFailed', () => {
        it.each(fehlerfaelle)(
            'should reset participation data and set teilnahmeLoadState for $name',
            ({ error, loadState }) => {
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
                    SchulteilnahmeActions.teilnahmeLadenFailed({ error })
                );

                expect(state).toEqual({
                    teilnahme: undefined,
                    teilnahmeLoadState: loadState,
                    anmeldendePersonLoadState: 'not-loaded',
                    klassen: [],
                    klassenLoadState: 'not-loaded',
                    ausgewaehlteKlasse: undefined,
                });
            }
        );
    });

    describe('teilnahmeAngemeldet', () => {
        it('should set the teilnahme and teilnahmeLoadState when initial state and teilnahme angemeldet', () => {
            const state = schulteilnahmeFeature.reducer(
                initialSchulteilnahmeState,
                SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    anzahlKinder: 3,
                    anzahlKlassen: 1,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen: [],
                klassenLoadState: 'not-loaded',
                ausgewaehlteKlasse: undefined,
            });
        });
    });
});
