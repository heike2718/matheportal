import { describe, expect, it } from 'vitest';
import { createSchulteilnahmeTestdaten } from './schulteilnahme.reducer.testdaten';
import { initialSchulteilnahmeState, schulteilnahmeFeature, SchulteilnahmeState } from './schulteilnahme.reducer';
import { SchulteilnahmeActions } from './schulteilnahme.actions';

describe('schulteilnahmeReducer Create Update Delete', () => {
    const { teilnahme, klassen, neueKlasse, neueKlasseAndereSchule, fehler } = createSchulteilnahmeTestdaten();

    describe('klasseAngelegt', () => {
        it('should preserve state when teilnahme undefined', () => {
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
                SchulteilnahmeActions.klasseAngelegt({ klasse: neueKlasse })
            );

            expect(state).toBe(previousState);
        });

        it('should add neue klasse to klassen when it belongs to the same school', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    anzahlKlassen: 2,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klasseAngelegt({ klasse: neueKlasse })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: undefined,
                    anzahlKinder: 3,
                    anzahlKlassen: 3,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
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
                    {
                        name: 'Luchsklasse',
                        schulkuerzel: 'S1234567',
                        uuid: 'eeeeee',
                    },
                ],
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: undefined,
            });
        });

        it('should preserve state when klasse belongs to another school', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: { ...teilnahme, anzahlKlassen: 2 },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klasseAngelegt({ klasse: neueKlasseAndereSchule })
            );

            expect(state).toEqual({
                teilnahme: {
                    angemeldetAm: '02.04.2026',
                    angemeldetDurch: undefined,
                    anzahlKinder: 3,
                    anzahlKlassen: 2,
                    anzahlLoesungszettel: 2,
                    auswertungsart: 'ONLINE',
                    durchfuehrungsart: 'SCHULE',
                    jahr: 2026,
                    kuerzel: 'S1234567',
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
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
    });

    describe('klasseAnlegenFailed', () => {
        it.each([
            { name: 'HTTP 400', error: fehler.http400 },
            { name: 'HTTP 401', error: fehler.http401 },
            { name: 'HTTP 403', error: fehler.http403 },
            { name: 'HTTP 404', error: fehler.http404 },
            { name: 'HTTP 409', error: fehler.http409 },
            { name: 'HTTP 500', error: fehler.http500 },
            { name: 'unexpected error', error: fehler.unexpected },
        ])('should preserve state with %name teilnahme undefined', ({ error }) => {
            const state = schulteilnahmeFeature.reducer(
                initialSchulteilnahmeState,
                SchulteilnahmeActions.klasseAnlegenFailed({ schulkuerzel: 'S1234567', error })
            );

            expect(state).toBe(initialSchulteilnahmeState);
        });

        it.each([
            { name: 'HTTP 400', error: fehler.http400 },
            { name: 'HTTP 401', error: fehler.http401 },
            { name: 'HTTP 403', error: fehler.http403 },
            { name: 'HTTP 404', error: fehler.http404 },
            { name: 'HTTP 409', error: fehler.http409 },
            { name: 'HTTP 500', error: fehler.http500 },
            { name: 'unexpected error', error: fehler.unexpected },
        ])('should preserve state with %name and the same school', ({ error }) => {
            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    anzahlKlassen: 2,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klasseAnlegenFailed({ schulkuerzel: 'S1234567', error })
            );

            expect(state).toBe(previousState);
        });

        it.each([
            { name: 'HTTP 400', error: fehler.http400 },
            { name: 'HTTP 401', error: fehler.http401 },
            { name: 'HTTP 403', error: fehler.http403 },
            { name: 'HTTP 404', error: fehler.http404 },
            { name: 'HTTP 409', error: fehler.http409 },
            { name: 'HTTP 500', error: fehler.http500 },
            { name: 'unexpected error', error: fehler.unexpected },
        ])('should preserve state with %name and another school', ({ error }) => {
            const previousState: SchulteilnahmeState = {
                teilnahme: {
                    ...teilnahme,
                    anzahlKlassen: 2,
                },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(
                previousState,
                SchulteilnahmeActions.klasseAnlegenFailed({ schulkuerzel: '7654321S', error })
            );

            expect(state).toBe(previousState);
        });
    });
});
