import { Action, State } from '@ngrx/store';
import { Land, Ort, Schule } from '../../model/schulkatalog.model';
import { initialSchulkatalogState, schulkatalogFeature, SchulkatalogState } from './schulkatalog.reducer';
import { schulkatalogActions } from './schulkatalog.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { userLoggedOut } from '@matheportal/auth-api';

describe('schulkatalogReducer tests', () => {
    const createState = (overrides: Partial<SchulkatalogState> = {}): SchulkatalogState => ({
        ...initialSchulkatalogState,
        ...overrides,
    });

    const httpServerAuthErroResponse = new HttpErrorResponse({
        status: 403,
        statusText: 'forbidden',
        error: 'boom',
        url: '/laender/',
    });

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/laender/',
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

    describe('laender action tests', () => {
        describe('loadLaender', () => {
            it('should return the initial state on loadLaender', () => {
                const previousState = createState({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte,
                    orteLoadingState: 'loaded',
                    selectedOrt: orte[0],
                    schulen,
                    schulenLoadingState: 'loaded',
                    selectedSchule: schulen[0],
                });

                const state = schulkatalogFeature.reducer(previousState, schulkatalogActions.loadLaender());

                expect(state).toBe(initialSchulkatalogState);
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

            it('should set laenderLoadedState correctly when loadLaenderFailed with 403', () => {
                const state = schulkatalogFeature.reducer(
                    previousState,
                    schulkatalogActions.loadLaenderFailed({ error: httpServerAuthErroResponse })
                );

                expect(state).toEqual({
                    laender: [],
                    laenderLoadingState: 'unauthorized',
                    selectedLand: undefined,
                    orte: [],
                    orteLoadingState: 'not-loaded',
                    selectedOrt: undefined,
                    schulen: [],
                    schulenLoadingState: 'not-loaded',
                    selectedSchule: undefined,
                });
            });

            it('should set laenderLoadedState correctly when loadLaenderFailed with 500', () => {
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

        it('should set the selectedLand and reset orte and schulen', () => {
            const previousState = createState({
                laender,
                laenderLoadingState: 'loaded',
                selectedLand: laender[1],
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: orte[0],
                schulen,
                schulenLoadingState: 'loaded',
                selectedSchule: schulen[0],
            });

            const state = schulkatalogFeature.reducer(
                previousState,
                schulkatalogActions.landSelected({ land: laender[0] })
            );

            expect(state).toEqual({
                laender,
                laenderLoadingState: 'loaded',
                selectedLand: laender[0],
                orte: [],
                orteLoadingState: 'not-loaded',
                selectedOrt: undefined,
                schulen: [],
                schulenLoadingState: 'not-loaded',
                selectedSchule: undefined,
            });
        });
    });

    describe('orte actions tests', () => {
        describe('loadOrte test', () => {
            it('should reset orte and schulen on loadOrte', () => {
                const previousState = createState({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte,
                    orteLoadingState: 'loaded',
                    selectedOrt: orte[0],
                    schulen,
                    schulenLoadingState: 'loaded',
                    selectedSchule: schulen[0],
                });

                const state = schulkatalogFeature.reducer(
                    previousState,
                    schulkatalogActions.loadOrte({ land: laender[1] })
                );

                expect(state).toEqual({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte: [],
                    orteLoadingState: 'not-loaded',
                    selectedOrt: undefined,
                    schulen: [],
                    schulenLoadingState: 'not-loaded',
                    selectedSchule: undefined,
                });
            });
        });
        describe('loadOrteSucceeded tests', () => {
            const previousState = createState({
                laender,
                laenderLoadingState: 'loaded',
                selectedLand: laender[1],
                orte: [],
                orteLoadingState: 'not-loaded',
                selectedOrt: undefined,
                schulen: [],
                schulenLoadingState: 'not-loaded',
                selectedSchule: undefined,
            });

            it('should set orteLoadingState and orte on loadOrteSucceeded with orte', () => {
                const state = schulkatalogFeature.reducer(
                    previousState,
                    schulkatalogActions.loadOrteSucceeded({ orte })
                );

                expect(state).toEqual({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte,
                    orteLoadingState: 'loaded',
                    selectedOrt: undefined,
                    schulen: [],
                    schulenLoadingState: 'not-loaded',
                    selectedSchule: undefined,
                });
            });
            it('should set orteLoadingState and orte on loadOrteSucceeded with empty orte', () => {
                const state = schulkatalogFeature.reducer(
                    previousState,
                    schulkatalogActions.loadOrteSucceeded({ orte: [] })
                );

                expect(state).toEqual({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte: [],
                    orteLoadingState: 'loaded',
                    selectedOrt: undefined,
                    schulen: [],
                    schulenLoadingState: 'not-loaded',
                    selectedSchule: undefined,
                });
            });
        });
        describe('loadOrteFailed tests', () => {
            const previousState = createState({
                laender,
                laenderLoadingState: 'loaded',
                selectedLand: laender[1],
                orte: [],
                orteLoadingState: 'not-loaded',
                selectedOrt: undefined,
                schulen: [],
                schulenLoadingState: 'not-loaded',
                selectedSchule: undefined,
            });
            it('should set orteLoadingState correctly when loadOrteFailed with 403', () => {
                const state = schulkatalogFeature.reducer(
                    previousState,
                    schulkatalogActions.loadOrteFailed({ error: httpServerAuthErroResponse })
                );

                expect(state).toEqual({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte: [],
                    orteLoadingState: 'unauthorized',
                    selectedOrt: undefined,
                    schulen: [],
                    schulenLoadingState: 'not-loaded',
                    selectedSchule: undefined,
                });
            });

            it('should set orteLoadingState correctly when loadOrteFailed with 500', () => {
                const state = schulkatalogFeature.reducer(
                    previousState,
                    schulkatalogActions.loadOrteFailed({ error: httpServerErrorResponse })
                );

                expect(state).toEqual({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte: [],
                    orteLoadingState: 'technical-error',
                    selectedOrt: undefined,
                    schulen: [],
                    schulenLoadingState: 'not-loaded',
                    selectedSchule: undefined,
                });
            });
        });

        it('should set the selectedOrt and reset schulen', () => {
            const previousState = createState({
                laender,
                laenderLoadingState: 'loaded',
                selectedLand: laender[1],
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: orte[0],
                schulen,
                schulenLoadingState: 'loaded',
                selectedSchule: schulen[0],
            });

            const state = schulkatalogFeature.reducer(previousState, schulkatalogActions.ortSelected({ ort: orte[1] }));

            expect(state).toEqual({
                laender,
                laenderLoadingState: 'loaded',
                selectedLand: laender[1],
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: orte[1],
                schulen: [],
                schulenLoadingState: 'not-loaded',
                selectedSchule: undefined,
            });
        });
    });

    describe('schulen actions tests', () => {
        describe('loadSchulen test', () => {
            it('should reset schulen on loadSchulen', () => {
                const previousState = createState({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte,
                    orteLoadingState: 'loaded',
                    selectedOrt: orte[0],
                    schulen,
                    schulenLoadingState: 'loaded',
                    selectedSchule: schulen[0],
                });

                const state = schulkatalogFeature.reducer(
                    previousState,
                    schulkatalogActions.loadSchulen({ ort: orte[0] })
                );

                expect(state).toEqual({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte,
                    orteLoadingState: 'loaded',
                    selectedOrt: orte[0],
                    schulen: [],
                    schulenLoadingState: 'not-loaded',
                    selectedSchule: undefined,
                });
            });
        });
        describe('loadSchulenSucceeded tests', () => {
            const previousState = createState({
                laender,
                laenderLoadingState: 'loaded',
                selectedLand: laender[1],
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: orte[0],
                schulen: [],
                schulenLoadingState: 'not-loaded',
                selectedSchule: undefined,
            });
            it('schould set the schulenLoadedState and schulen when schulen not empty', () => {
                const state = schulkatalogFeature.reducer(
                    previousState,
                    schulkatalogActions.loadSchulenSucceeded({ schulen })
                );

                expect(state).toEqual({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte,
                    orteLoadingState: 'loaded',
                    selectedOrt: orte[0],
                    schulen,
                    schulenLoadingState: 'loaded',
                    selectedSchule: undefined,
                });
            });
            it('schould set the schulenLoadedState and schulen when schulen empty', () => {
                const state = schulkatalogFeature.reducer(
                    previousState,
                    schulkatalogActions.loadSchulenSucceeded({ schulen: [] })
                );

                expect(state).toEqual({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte,
                    orteLoadingState: 'loaded',
                    selectedOrt: orte[0],
                    schulen: [],
                    schulenLoadingState: 'loaded',
                    selectedSchule: undefined,
                });
            });
        });
        describe('loadSchulenFailed tests', () => {
            const previousState = createState({
                laender,
                laenderLoadingState: 'loaded',
                selectedLand: laender[1],
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: orte[0],
                schulen: [],
                schulenLoadingState: 'not-loaded',
                selectedSchule: undefined,
            });
            it('should set schulenLoadingState correctly when loadSchulenFailed with 403', () => {
                const state = schulkatalogFeature.reducer(
                    previousState,
                    schulkatalogActions.loadSchulenFailed({ error: httpServerAuthErroResponse })
                );

                expect(state).toEqual({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte,
                    orteLoadingState: 'loaded',
                    selectedOrt: orte[0],
                    schulen: [],
                    schulenLoadingState: 'unauthorized',
                    selectedSchule: undefined,
                });
            });

            it('should set schulenLoadingState correctly when loadSchulenFailed with 500', () => {
                const state = schulkatalogFeature.reducer(
                    previousState,
                    schulkatalogActions.loadSchulenFailed({ error: httpServerErrorResponse })
                );

                expect(state).toEqual({
                    laender,
                    laenderLoadingState: 'loaded',
                    selectedLand: laender[1],
                    orte,
                    orteLoadingState: 'loaded',
                    selectedOrt: orte[0],
                    schulen: [],
                    schulenLoadingState: 'technical-error',
                    selectedSchule: undefined,
                });
            });
        });
        it('should set the selectedSchule', () => {
            const previousState = createState({
                laender,
                laenderLoadingState: 'loaded',
                selectedLand: laender[1],
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: orte[0],
                schulen,
                schulenLoadingState: 'loaded',
                selectedSchule: undefined,
            });

            const state = schulkatalogFeature.reducer(
                previousState,
                schulkatalogActions.schuleSelected({ schule: schulen[1] })
            );

            expect(state).toEqual({
                laender,
                laenderLoadingState: 'loaded',
                selectedLand: laender[1],
                orte,
                orteLoadingState: 'loaded',
                selectedOrt: orte[0],
                schulen,
                schulenLoadingState: 'loaded',
                selectedSchule: schulen[1],
            });
        });
    });
    describe('reset actions', () => {
        const previousState = createState({
            laender,
            laenderLoadingState: 'loaded',
            selectedLand: laender[1],
            orte,
            orteLoadingState: 'loaded',
            selectedOrt: orte[0],
            schulen,
            schulenLoadingState: 'loaded',
            selectedSchule: schulen[1],
        });

        it('should return the initialState on resetSchulkatalog', () => {
            const state = schulkatalogFeature.reducer(previousState, schulkatalogActions.resetSchulkatalog());

            expect(state).toBe(initialSchulkatalogState);
        });

        it('should return the initialState on loggedOut', () => {
            const state = schulkatalogFeature.reducer(previousState, userLoggedOut);

            expect(state).toBe(initialSchulkatalogState);
        });
    });
});
