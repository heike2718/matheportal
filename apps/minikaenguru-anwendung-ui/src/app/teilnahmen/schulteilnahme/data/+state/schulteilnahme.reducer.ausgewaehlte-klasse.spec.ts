import { SchulteilnahmeActions } from './schulteilnahme.actions';
import { initialSchulteilnahmeState, schulteilnahmeFeature, SchulteilnahmeState } from './schulteilnahme.reducer';
import { createSchulteilnahmeTestdaten } from './schulteilnahme.reducer.testdaten';

describe('schulteilnahmeReducer: ausgewaehlte Klasse', () => {
    const { teilnahme, klassen, klassenAndereSchule } = createSchulteilnahmeTestdaten();

    describe('klasseAusRouteErmittelt', () => {
        it('should not change the state when teilnahme undefined', () => {
            const state = schulteilnahmeFeature.reducer(
                initialSchulteilnahmeState,
                SchulteilnahmeActions.klasseAusRouteErmittelt({ klasse: klassen[0] })
            );

            expect(state).toBe(initialSchulteilnahmeState);
        });

        it('should set ausgewaehlteKlasse for the same school', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: { ...teilnahme, angemeldetDurch: undefined },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-found',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klasseAusRouteErmittelt({ klasse: klassen[0] })
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
                ausgewaehlteKlasse: {
                    name: 'Fuchsklasse',
                    schulkuerzel: 'S1234567',
                    uuid: 'abcdef',
                },
            });
        });

        it('should set the other klasse for the same school', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: { ...teilnahme, angemeldetDurch: undefined },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-found',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: {
                    name: 'Fuchsklasse',
                    schulkuerzel: 'S1234567',
                    uuid: 'abcdef',
                },
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klasseAusRouteErmittelt({ klasse: klassen[1] })
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
                ausgewaehlteKlasse: {
                    name: 'Tuxklasse',
                    schulkuerzel: 'S1234567',
                    uuid: '123456',
                },
            });
        });

        it('should preserve the state when the klasse belongs to another school', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: { ...teilnahme, angemeldetDurch: undefined },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-found',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: {
                    name: 'Fuchsklasse',
                    schulkuerzel: 'S1234567',
                    uuid: 'abcdef',
                },
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klasseAusRouteErmittelt({ klasse: klassenAndereSchule[0] })
            );

            expect(state).toBe(previousState);
        });
    });
});
