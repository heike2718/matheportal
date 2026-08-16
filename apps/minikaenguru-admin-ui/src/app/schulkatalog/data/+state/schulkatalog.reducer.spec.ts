import { Action } from '@ngrx/store';
import { Land, Ort, Schule } from '../../model/schulkatalog.model';
import { initialSchulkatalogState, schulkatalogFeature, SchulkatalogState } from './schulkatalog.reducer';
import { schulkatalogActions } from './schulkatalog.actions';
import { HttpErrorResponse } from '@angular/common/http';

describe('schulkatalogReducer tests', () => {
    const createState = (overrides: Partial<SchulkatalogState> = {}): SchulkatalogState => ({
        ...initialSchulkatalogState,
        ...overrides,
    });

    const laender: Land[] = [
        {
            kuerzel: 'LAND-1',
            name: 'erstes Land',
            anzahlOrte: 23,
        },
        {
            kuerzel: 'LAND-2',
            name: 'zweites Land',
            anzahlOrte: 2,
        },
    ];

    const orte: Ort[] = [
        {
            land: laender[1],
            kuerzel: 'ORT-21',
            name: 'erster Ort im Land 2',
            anzahlSchulen: 2,
        },
        {
            land: laender[1],
            kuerzel: 'ORT-22',
            name: 'zweiter Ort im Land 2',
            anzahlSchulen: 8,
        },
    ];

    const schulen: Schule[] = [
        {
            ort: orte[0],
            kuerzel: 'SCHULE-1',
            name: 'erste Schule im Ort 21',
        },
        {
            ort: orte[0],
            kuerzel: 'SCHULE-2',
            name: 'zweite Schule im Ort 21',
        },
    ];

    describe('sanity checks', () => {
        const unknownAction = { type: 'unknownAction' } as Action;

        it('should return the initial state, when unknown action and undefined state', () => {
            const state = schulkatalogFeature.reducer(undefined, unknownAction);
            expect(state).toBe(initialSchulkatalogState);
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const previousState = createState({ orte, orteLoadingState: 'loaded', selectedOrt: orte[1] });
            const state = schulkatalogFeature.reducer(previousState, unknownAction);
            expect(state).toBe(previousState);
        });
    });

    describe('loadLaenderSucceeded', () => {
        const previousState = createState({
            selectedLand: laender[1],
            orte: orte,
            orteLoadingState: 'loaded',
            selectedOrt: orte[1],
            schulen: schulen,
            schulenLoadingState: 'loaded',
            selectedSchule: undefined,
        });

        it('should set laender and laenderLoadingState and reset orte and schulen when there are laender', () => {
            const state = schulkatalogFeature.reducer(
                previousState,
                schulkatalogActions.loadLaenderSucceeded({ laender })
            );

            expect(state).toEqual({
                laender,
                laenderLoadingState: 'loaded',
                selectedLand: undefined,
                orte: [],
                orteLoadingState: 'not-loaded',
                selectedOrt: undefined,
                schulen: [],
                schulenLoadingState: 'not-loaded',
                selectedSchule: undefined,
            });
        });

        it('should set laender and laenderLoadingState when there are no laender', () => {
            const state = schulkatalogFeature.reducer(
                previousState,
                schulkatalogActions.loadLaenderSucceeded({ laender: [] })
            );

            expect(state).toEqual({
                laender: [],
                laenderLoadingState: 'loaded',
                selectedLand: undefined,
                orte: [],
                orteLoadingState: 'not-loaded',
                selectedOrt: undefined,
                schulen: [],
                schulenLoadingState: 'not-loaded',
                selectedSchule: undefined,
            });
        });
    });

    describe('loadLaenderFailed', () => {
        const previousState = createState({
            selectedLand: laender[1],
            orte: orte,
            orteLoadingState: 'loaded',
            selectedOrt: orte[1],
            schulen: schulen,
            schulenLoadingState: 'loaded',
            selectedSchule: undefined,
        });
        const httpServerErrorResponse = new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
            error: 'boom',
            url: '/laender/',
        });
        it('should set laenderLoadedState correctly when loadLaenderFailed', () => {
            const state = schulkatalogFeature.reducer(
                previousState,
                schulkatalogActions.loadLaenderFailed({ error: httpServerErrorResponse })
            );

            expect(state).toEqual({
                laender: [],
                laenderLoadingState: 'technical-error',
                selectedLand: undefined,
                orte: [],
                orteLoadingState: 'not-loaded',
                selectedOrt: undefined,
                schulen: [],
                schulenLoadingState: 'not-loaded',
                selectedSchule: undefined,
            });
        });
    });
});
