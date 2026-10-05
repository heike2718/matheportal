import { Action } from '@ngrx/store';
import {
    initialSchulkatalogsucheState,
    schulkatalogsucheFeature,
    SchulkatalogsucheState,
} from './schulkatalogsuche.reducer';
import { Land, Ort, Schule } from '../../../../core/model/schulkatalog.model';
import { SchulkatalogsucheActions } from './schulkatalogsuche.actions';
import { userLoggedOut } from '@matheportal/auth-api';
import { HttpErrorResponse } from '@angular/common/http';

describe('schulkatalogsucheFeature tests', () => {
    const createState = (overrides: Partial<SchulkatalogsucheState> = {}): SchulkatalogsucheState => ({
        ...initialSchulkatalogsucheState,
        ...overrides,
    });

    const orte: Ort[] = [
        {
            kuerzel: 'ORT-1',
            name: 'erster Ort',
            land: {
                kuerzel: 'DE-BY',
                name: 'Bayern',
                anzahlOrte: 19,
            },
            anzahlSchulen: 10,
        },
        {
            kuerzel: 'ORT-2',
            name: 'zweiter Ort',
            land: {
                kuerzel: 'DE-HE',
                name: 'Hessen',
                anzahlOrte: 8,
            },
            anzahlSchulen: 5,
        },
    ];

    const schulen: Schule[] = [
        {
            ort: orte[1],
            kuerzel: 'SCHULE-1',
            name: 'Neuhofschule',
        },
        {
            ort: orte[1],
            kuerzel: 'SCHULE-2',
            name: 'Albert-Einstein-Schule',
        },
    ];

    describe('sanity checks', () => {
        const unknownAction = { type: 'unknownAction' } as Action;

        it('should return the initial state, when unknown action and undefined state', () => {
            const state = schulkatalogsucheFeature.reducer(undefined, unknownAction);
            expect(state).toBe(initialSchulkatalogsucheState);
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const previousState = createState({ orte, orteLoadState: 'loaded', selectedOrt: orte[1] });
            const state = schulkatalogsucheFeature.reducer(previousState, unknownAction);
            expect(state).toBe(previousState);
        });
    });

    describe('findOrteSucceeded', () => {
        const previousState = createState();

        it('should set orte and orteLoadState when orte found', () => {
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                SchulkatalogsucheActions.findOrteSucceeded({ orte })
            );

            expect(state).toEqual({
                orte,
                orteLoadState: 'loaded',
                selectedOrt: undefined,
                schulen: [],
                schulenLoadState: 'not-loaded',
                selectedSchule: undefined,
            });
        });
        it('should set  orte = [] and orteLoadState when orte empty', () => {
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                SchulkatalogsucheActions.findOrteSucceeded({ orte: [] })
            );

            expect(state).toEqual({
                orte: [],
                orteLoadState: 'loaded',
                selectedOrt: undefined,
                schulen: [],
                schulenLoadState: 'not-loaded',
                selectedSchule: undefined,
            });
        });
    });

    describe('loadSchulenSucceeded', () => {
        const previousState = createState({
            orte,
            orteLoadState: 'loaded',
            selectedOrt: orte[1],
        });
        it('should set schulen and schulenLoadState when same ortId', () => {
            const ortId = orte[1].kuerzel;
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                SchulkatalogsucheActions.loadSchulenSucceeded({ ortId, schulen })
            );

            expect(state).toEqual({
                orte,
                orteLoadState: 'loaded',
                selectedOrt: orte[1],
                schulen,
                schulenLoadState: 'loaded',
                selectedSchule: undefined,
            });
        });
        it('should return previous state when not the same ortId as before', () => {
            const ortId = 'ORT-9';

            const state = schulkatalogsucheFeature.reducer(
                previousState,
                SchulkatalogsucheActions.loadSchulenSucceeded({ ortId, schulen })
            );

            expect(state).toBe(previousState);
        });
        it('should set schulen and schulenLoadState when empty and and same ortId', () => {
            const ortId = orte[1].kuerzel;

            const state = schulkatalogsucheFeature.reducer(
                previousState,
                SchulkatalogsucheActions.loadSchulenSucceeded({ ortId, schulen: [] })
            );

            expect(state).toEqual({
                orte,
                orteLoadState: 'loaded',
                selectedOrt: orte[1],
                schulen: [],
                schulenLoadState: 'loaded',
                selectedSchule: undefined,
            });
        });
        it('should return previousState when empty and other ortId', () => {
            const ortId = 'ORT-3';

            const state = schulkatalogsucheFeature.reducer(
                previousState,
                SchulkatalogsucheActions.loadSchulenSucceeded({ ortId, schulen: [] })
            );

            expect(state).toBe(previousState);
        });
    });

    describe('ortSelected', () => {
        const previousState = createState({
            orte,
            orteLoadState: 'loaded',
            schulen: schulen,
            schulenLoadState: 'loaded',
            selectedSchule: schulen[1],
        });
        it('should set selectedOrt, keep orte and reset schulen and selectedSchule', () => {
            const ort = orte[0];

            const state = schulkatalogsucheFeature.reducer(
                previousState,
                SchulkatalogsucheActions.ortSelected({ ort })
            );

            expect(state).toEqual({
                orte,
                orteLoadState: 'loaded',
                selectedOrt: ort,
                schulen: [],
                schulenLoadState: 'not-loaded',
                selectedSchule: undefined,
            });
        });
    });

    describe('orteCleared', () => {
        it('should return the initial state when orteCleared', () => {
            const previousState = createState({
                orte,
                orteLoadState: 'loaded',
                selectedOrt: orte[1],
                schulen,
                schulenLoadState: 'loaded',
                selectedSchule: schulen[1],
            });

            const state = schulkatalogsucheFeature.reducer(previousState, SchulkatalogsucheActions.orteCleared());

            expect(state).toBe(initialSchulkatalogsucheState);
        });
    });

    describe('schuleSelected', () => {
        const previousState = createState({
            orte,
            orteLoadState: 'loaded',
            selectedOrt: orte[1],
            schulen,
            schulenLoadState: 'loaded',
        });
        it('should set selectedSchule when ortId and schule.ort fit', () => {
            const schule = schulen[0];
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                SchulkatalogsucheActions.schuleSelected({ schule })
            );

            expect(state).toEqual({
                orte,
                orteLoadState: 'loaded',
                selectedOrt: orte[1],
                schulen,
                schulenLoadState: 'loaded',
                selectedSchule: schule,
            });
        });
        it('should return previousState when ortId and schule.ort do not fit', () => {
            const land: Land = {
                kuerzel: 'CH',
                name: 'Schweiz',
                anzahlOrte: 15,
            };
            const ort: Ort = {
                land,
                kuerzel: 'SCHULE-9',
                name: 'Primarschule Rültigasse',
                anzahlSchulen: 4,
            };
            const schule: Schule = {
                ort,
                kuerzel: 'SCHULE-9',
                name: 'Primarschule Rütli',
            };
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                SchulkatalogsucheActions.schuleSelected({ schule })
            );

            expect(state).toBe(previousState);
        });
    });

    describe('findOrteFailed', () => {
        const httpServerErrorResponse = new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
            error: 'boom',
            url: '/orte/',
        });
        const previousState = initialSchulkatalogsucheState;

        it('should set LoadState correctly when findOrteFailed with httpError', () => {
            // schulkatalogsuche-data.utils is responsible for the correct mapping and therefore comletely tested in its own spec
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                SchulkatalogsucheActions.findOrteFailed({ error: httpServerErrorResponse })
            );

            expect(state).toEqual({
                orte: [],
                orteLoadState: 'technical-error',
                selectedOrt: undefined,
                schulen: [],
                schulenLoadState: 'not-loaded',
                selectedSchule: undefined,
            });
        });
    });

    describe('loadSchulenFailed', () => {
        const httpServerErrorResponse = new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
            error: 'boom',
            url: '/ORT-1/schulen/',
        });
        const previousState = createState({ orte, orteLoadState: 'loaded', selectedOrt: orte[1] });
        it('should set schulenLoadedState correctly when findSchulenFailed', () => {
            // schulkatalogsuche-data.utils is responsible for the correct mapping and therefore completely tested in its own spec
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                SchulkatalogsucheActions.loadSchulenFailed({ error: httpServerErrorResponse })
            );

            expect(state).toEqual({
                orte,
                orteLoadState: 'loaded',
                selectedOrt: orte[1],
                schulen: [],
                schulenLoadState: 'technical-error',
                selectedSchule: undefined,
            });
        });
    });

    describe('schulenCleared', () => {
        it('should set reset schulen and LoadState when schulenCleared', () => {
            const previousState = createState({
                orte,
                orteLoadState: 'loaded',
                selectedOrt: orte[1],
                schulen,
                schulenLoadState: 'loaded',
                selectedSchule: schulen[1],
            });

            const state = schulkatalogsucheFeature.reducer(previousState, SchulkatalogsucheActions.schulenCleared());

            expect(state).toEqual({
                orte,
                orteLoadState: 'loaded',
                selectedOrt: orte[1],
                schulen: [],
                schulenLoadState: 'not-loaded',
                selectedSchule: undefined,
            });
        });
    });

    describe('reset and userLoggedOut', () => {
        const previousState: SchulkatalogsucheState = {
            orte,
            orteLoadState: 'loaded',
            selectedOrt: orte[1],
            schulen,
            schulenLoadState: 'loaded',
            selectedSchule: schulen[1],
        };

        it('should reset to the initialState on resetSuche', () => {
            const state = schulkatalogsucheFeature.reducer(previousState, SchulkatalogsucheActions.resetSuche());

            expect(state).toBe(initialSchulkatalogsucheState);
        });

        it('should reset to the initialState on userLoggedOut', () => {
            const state = schulkatalogsucheFeature.reducer(previousState, userLoggedOut());

            expect(state).toBe(initialSchulkatalogsucheState);
        });
    });
});
