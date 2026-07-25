import { Action } from '@ngrx/store';
import {
    initialSchulkatalogsucheState,
    schulkatalogsucheFeature,
    SchulkatalogsucheState,
} from './schulkatalogsuche.reducer';
import { Land, Ort, Schule } from '../../model/schulkatalog.model';
import { schulkatalogsucheActions } from './schulkatalogsuche.actions';
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
            },
            anzahlSchulen: 10,
        },
        {
            kuerzel: 'ORT-2',
            name: 'zweiter Ort',
            land: {
                kuerzel: 'DE-HE',
                name: 'Hessen',
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
            const previousState = createState({ orte, orteLoadingState: 'loaded', selectedOrt: orte[1] });
            const state = schulkatalogsucheFeature.reducer(previousState, unknownAction);
            expect(state).toBe(previousState);
        });
    });

    describe('findOrteSucceeded', () => {
        const previousState = createState();

        it('should set orte and orteLoadingState when orte found', () => {
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                schulkatalogsucheActions.findOrteSucceeded({ orte })
            );

            expect(state).toEqual({
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: undefined,
                schulen: [],
                schulenLoadingState: 'not-loaded',
                selectedSchule: undefined,
            });
        });
        it('should set  orte = [] and orteLoadingState when orte empty', () => {
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                schulkatalogsucheActions.findOrteSucceeded({ orte: [] })
            );

            expect(state).toEqual({
                orte: [],
                orteLoadingState: 'loaded',
                selectedOrt: undefined,
                schulen: [],
                schulenLoadingState: 'not-loaded',
                selectedSchule: undefined,
            });
        });
    });

    describe('loadSchulenSucceeded', () => {
        const previousState = createState({
            orte,
            orteLoadingState: 'loaded',
            selectedOrt: orte[1],
        });
        it('should set schulen and schulenLoadingState when same ortId', () => {
            const ortId = orte[1].kuerzel;
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                schulkatalogsucheActions.loadSchulenSucceeded({ ortId, schulen })
            );

            expect(state).toEqual({
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: orte[1],
                schulen,
                schulenLoadingState: 'loaded',
                selectedSchule: undefined,
            });
        });
        it('should return previous state when not the same ortId as before', () => {
            const ortId = 'ORT-9';

            const state = schulkatalogsucheFeature.reducer(
                previousState,
                schulkatalogsucheActions.loadSchulenSucceeded({ ortId, schulen })
            );

            expect(state).toBe(previousState);
        });
        it('should set schulen and schulenLOadingState when empty and and same ortId', () => {
            const ortId = orte[1].kuerzel;

            const state = schulkatalogsucheFeature.reducer(
                previousState,
                schulkatalogsucheActions.loadSchulenSucceeded({ ortId, schulen: [] })
            );

            expect(state).toEqual({
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: orte[1],
                schulen: [],
                schulenLoadingState: 'loaded',
                selectedSchule: undefined,
            });
        });
        it('should return previousState when empty and other ortId', () => {
            const ortId = 'ORT-3';

            const state = schulkatalogsucheFeature.reducer(
                previousState,
                schulkatalogsucheActions.loadSchulenSucceeded({ ortId, schulen: [] })
            );

            expect(state).toBe(previousState);
        });
    });

    describe('ortSelected', () => {
        const previousState = createState({ orte, orteLoadingState: 'loaded' });
        it('should set selectedOrt, keep orte and reset schulen and selectedSchule', () => {
            const ort = orte[0];

            const state = schulkatalogsucheFeature.reducer(
                previousState,
                schulkatalogsucheActions.ortSelected({ ort })
            );

            expect(state).toEqual({
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: ort,
                schulen: [],
                schulenLoadingState: 'not-loaded',
                selectedSchule: undefined,
            });
        });
    });

    describe('schuleSelected', () => {
        const previousState = createState({
            orte,
            orteLoadingState: 'loaded',
            selectedOrt: orte[1],
            schulen,
            schulenLoadingState: 'loaded',
        });
        it('should set selectedSchule when ortId and schule.ort fit', () => {
            const schule = schulen[0];
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                schulkatalogsucheActions.schuleSelected({ schule })
            );

            expect(state).toEqual({
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: orte[1],
                schulen,
                schulenLoadingState: 'loaded',
                selectedSchule: schule,
            });
        });
        it('should return previousState when ortId and schule.ort do not fit', () => {
            const land: Land = {
                kuerzel: 'CH',
                name: 'Schweiz',
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
                schulkatalogsucheActions.schuleSelected({ schule })
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

        it('should set loadingState correctly when findOrteFailed with httpError', () => {
            // schulkatalogsuche-data.utils is responsible for the correct mapping and therefore comletely tested in its own spec
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                schulkatalogsucheActions.findOrteFailed({ error: httpServerErrorResponse })
            );

            expect(state).toEqual({
                orte: [],
                orteLoadingState: 'technical-error',
                selectedOrt: undefined,
                schulen: [],
                schulenLoadingState: 'not-loaded',
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
        const previousState = createState({ orte, orteLoadingState: 'loaded', selectedOrt: orte[1] });
        it('should set schulenLoadedState correctly when findSchulenFailed', () => {
            // schulkatalogsuche-data.utils is responsible for the correct mapping and therefore comletely tested in its own spec
            const state = schulkatalogsucheFeature.reducer(
                previousState,
                schulkatalogsucheActions.loadSchulenFailed({ error: httpServerErrorResponse })
            );

            expect(state).toEqual({
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: orte[1],
                schulen: [],
                schulenLoadingState: 'technical-error',
                selectedSchule: undefined,
            });
        });
    });

    describe('reset and userLoggedOut', () => {
        const previousState: SchulkatalogsucheState = {
            orte,
            orteLoadingState: 'loaded',
            selectedOrt: orte[1],
            schulen,
            schulenLoadingState: 'loaded',
            selectedSchule: schulen[1],
        };

        it('should reset to the initialState on resetSuche', () => {
            const state = schulkatalogsucheFeature.reducer(previousState, schulkatalogsucheActions.resetSuche());

            expect(state).toBe(initialSchulkatalogsucheState);
        });

        it('should reset to the initialState on userLoggedOut', () => {
            const state = schulkatalogsucheFeature.reducer(previousState, userLoggedOut());

            expect(state).toBe(initialSchulkatalogsucheState);
        });
    });
});
