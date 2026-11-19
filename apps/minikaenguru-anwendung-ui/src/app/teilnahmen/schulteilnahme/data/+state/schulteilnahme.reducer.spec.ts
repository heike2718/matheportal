import { Action } from '@ngrx/store';
import { userLoggedOut } from '@matheportal/auth-api';
import {
    lehrpersonBerechtigungVerweigert,
    schuleAusgewaehlt,
} from '../../../../lehrperson/api/lehrperson-store.events';
import { initialSchulteilnahmeState, schulteilnahmeFeature, SchulteilnahmeState } from './schulteilnahme.reducer';
import { createSchulteilnahmeTestdaten } from './schulteilnahme.reducer.testdaten';

describe('schulteilnahmeReducer: Grundverhalten und Zurücksetzen', () => {
    const { teilnahme, person, klassen } = createSchulteilnahmeTestdaten();

    describe('sanity checks', () => {
        const unknownAction: Action = { type: 'unknownAction' };

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
                ausgewaehlteKlasse: undefined,
            };

            const state = schulteilnahmeFeature.reducer(previousState, unknownAction);

            expect(state).toBe(previousState);
        });
    });

    describe('lehrpersonBerechtigungVerweigert', () => {
        it('should reset the state when lehrpersonBerechtigungVerweigert', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: { ...teilnahme, angemeldetDurch: person },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: klassen[0],
            };

            const state = schulteilnahmeFeature.reducer(previousState, lehrpersonBerechtigungVerweigert);

            expect(state).toBe(initialSchulteilnahmeState);
        });
    });

    describe('schuleAusgewaehlt', () => {
        const schulteilnahme = { ...teilnahme, angemeldetDurch: undefined };

        it('should reset to initial state when schuleAusgewaehlt with other schulkuerzel', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme: { ...schulteilnahme, angemeldetDurch: person },
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: klassen[0],
            };

            const state = schulteilnahmeFeature.reducer(previousState, schuleAusgewaehlt({ schulkuerzel: '7654321S' }));

            expect(state).toBe(initialSchulteilnahmeState);
        });

        it.each(['not-loaded', 'loaded', 'not-found', 'unauthorized', 'forbidden', 'technical-error'] as const)(
            'should reset state for the same school when anmeldendePersonLoadState is %s',
            anmeldendePersonLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: schulteilnahme,
                    teilnahmeLoadState: 'loaded',
                    anmeldendePersonLoadState,
                    klassen,
                    klassenLoadState: 'loaded',
                    ausgewaehlteKlasse: klassen[0],
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    schuleAusgewaehlt({ schulkuerzel: 'S1234567' })
                );

                expect(state).toBe(initialSchulteilnahmeState);
            }
        );

        it.each(['not-loaded', 'loaded', 'not-found', 'unauthorized', 'forbidden', 'technical-error'] as const)(
            'should reset state for the same school when teilnahmeLoadState is %s',
            teilnahmeLoadState => {
                const previousState: SchulteilnahmeState = {
                    teilnahme: schulteilnahme,
                    teilnahmeLoadState,
                    anmeldendePersonLoadState: 'not-loaded',
                    klassen,
                    klassenLoadState: 'loaded',
                    ausgewaehlteKlasse: klassen[0],
                };

                const state = schulteilnahmeFeature.reducer(
                    previousState,
                    schuleAusgewaehlt({ schulkuerzel: 'S1234567' })
                );

                expect(state).toBe(initialSchulteilnahmeState);
            }
        );
    });

    describe('userLoggedOut', () => {
        it('should reset its state when logged out', () => {
            const previousState: SchulteilnahmeState = {
                teilnahme,
                teilnahmeLoadState: 'loaded',
                anmeldendePersonLoadState: 'not-loaded',
                klassen,
                klassenLoadState: 'loaded',
                ausgewaehlteKlasse: klassen[0],
            };

            expect(schulteilnahmeFeature.reducer(previousState, userLoggedOut)).toBe(initialSchulteilnahmeState);
        });
    });
});
