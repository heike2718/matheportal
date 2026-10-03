import { Action } from '@ngrx/store';
import { Ort, Schule } from '../../../core/model/schulkatalog.model';
import { initialSchulenState, schulenFeature, SchulenState } from './schulen.reducer';
import { schulenActions } from './schulen.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { userLoggedOut } from '@matheportal/auth-api';
import { SchuleWettbewerbskontext, Schulkollegium } from '../../../core/model/schule-wettbewerbskontext.model';
import { wettbewerbsorganisationVerlassen } from '../../../lehrperson/api/lehrperson-store.events';

describe('schulenReducer', () => {
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

    const wettbewerbskontext: SchuleWettbewerbskontext = {
        schule: schulen[0],
        anmeldungMoeglich: true,
        kollegen: ['Anna Johanna'],
        teilnahmerefs: [],
        vertragDSGVOVorhanden: true,
    };

    const authorizationErrorResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 401,
        statusText: 'unauthorized',
        error: 'boom',
        url: '/schulen/',
    });

    const technicalErrorResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/schulen/',
    });

    describe('sanity checks', () => {
        const unknownAction = { type: 'unknownAction' } as Action;

        it('should return the initial state, when unknown action and undefined state', () => {
            const state = schulenFeature.reducer(undefined, unknownAction);
            expect(state).toBe(initialSchulenState);
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const previousState: SchulenState = {
                schulenLoadingState: 'loaded',
                schulen,
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadingState: 'not-loaded',
                schulkollegiumLoadingState: 'not-loaded',
            };
            const state = schulenFeature.reducer(previousState, unknownAction);
            expect(state).toBe(previousState);
        });
    });

    describe('schulenGeladen', () => {
        it('should reset previously loaded wettbewerbskontext and schulkollegizm and set the loadingState and the schulen', () => {
            const previousState: SchulenState = {
                schulenLoadingState: 'not-loaded',
                schulen: [],
                wettbewerbskontext,
                wettbewerbskontextLoadingState: 'loaded',
                schulkollegiumLoadingState: 'loaded',
            };

            const state = schulenFeature.reducer(previousState, schulenActions.schulenGeladen({ schulen }));
            expect(state).toEqual({
                schulenLoadingState: 'loaded',
                schulen,
                wettbewerbskontext,
                wettbewerbskontextLoadingState: 'loaded',
                schulkollegiumLoadingState: 'loaded',
            });
        });
    });
    describe('schulenLadenFailed', () => {
        const previousState: SchulenState = {
            schulenLoadingState: 'not-loaded',
            schulen: [],
            wettbewerbskontext,
            wettbewerbskontextLoadingState: 'loaded',
            schulkollegiumLoadingState: 'loaded',
        };

        it('should reset previously loaded wettbewerbskontext and schulkollegium and set the loadingState when technical error', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.schulenLadenFailed({ error: technicalErrorResponse })
            );
            expect(state).toEqual({
                schulenLoadingState: 'technical-error',
                schulen: [],
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadingState: 'not-loaded',
                schulkollegiumLoadingState: 'not-loaded',
            });
        });
        it('should reset previously loaded wettbewerbskontext and schulkollegiumset the loadingState when session expired', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.schulenLadenFailed({ error: authorizationErrorResponse })
            );
            expect(state).toEqual({
                schulenLoadingState: 'unauthorized',
                schulen: [],
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadingState: 'not-loaded',
                schulkollegiumLoadingState: 'not-loaded',
            });
        });
    });

    describe('wettbewerbskontext tests', () => {
        const previousState: SchulenState = {
            ...initialSchulenState,
            schulen,
            schulenLoadingState: 'loaded',
        };

        it('should set the wettbewerbskontext', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.wettbewerbskontextGeladen({ wettbewerbskontext })
            );

            expect(state).toEqual({
                schulen,
                schulenLoadingState: 'loaded',
                wettbewerbskontext,
                wettbewerbskontextLoadingState: 'loaded',
                schulkollegiumLoadingState: 'not-loaded',
            });
        });
        it('should not set the wettbewerbskontext but the loading state when technical error on wettbewerbskontextLadenFailed', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.wettbewerbskontextLadenFailed({ error: technicalErrorResponse })
            );

            expect(state).toEqual({
                schulen,
                schulenLoadingState: 'loaded',
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadingState: 'technical-error',
                schulkollegiumLoadingState: 'not-loaded',
            });
        });
        it('should not set the wettbewerbskontext but the loading state when session expired on wettbewerbskontextLadenFailed', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.wettbewerbskontextLadenFailed({ error: authorizationErrorResponse })
            );

            expect(state).toEqual({
                schulen,
                schulenLoadingState: 'loaded',
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadingState: 'unauthorized',
                schulkollegiumLoadingState: 'not-loaded',
            });
        });
    });

    describe('schulkollegium tests', () => {
        const previousState: SchulenState = {
            schulen,
            schulenLoadingState: 'loaded',
            wettbewerbskontext,
            wettbewerbskontextLoadingState: 'loaded',
            schulkollegiumLoadingState: 'not-loaded',
        };

        it('should set the kollegium and the loading state when loaded and same schule', () => {
            const schulkollegium: Schulkollegium = {
                kuerzel: 'SCHULE-1',
                kollegium: ['Leo Lemma', 'Rita Reihe'],
            };

            const state = schulenFeature.reducer(
                previousState,
                schulenActions.schulkollegiumGeladen({ schulkollegium })
            );

            const expectedWettbewerbskontext = { ...wettbewerbskontext, kollegen: ['Leo Lemma', 'Rita Reihe'] };

            expect(state).toEqual({
                schulen,
                schulenLoadingState: 'loaded',
                wettbewerbskontext: expectedWettbewerbskontext,
                wettbewerbskontextLoadingState: 'loaded',
                schulkollegiumLoadingState: 'loaded',
            });
        });
        it('should not change the kollegium but set the loading state when loaded and other schule', () => {
            const schulkollegium: Schulkollegium = {
                kuerzel: 'SCHULE-2',
                kollegium: ['Leo Lemma', 'Rita Reihe'],
            };

            const state = schulenFeature.reducer(
                previousState,
                schulenActions.schulkollegiumGeladen({ schulkollegium })
            );

            expect(state).toEqual({
                schulen,
                schulenLoadingState: 'loaded',
                wettbewerbskontext,
                wettbewerbskontextLoadingState: 'loaded',
                schulkollegiumLoadingState: 'loaded',
            });
        });
        it('should not change the kollegium but set the loading state when technical error on schulkollegiumLadenFailed', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.schulkollegiumLadenFailed({ error: technicalErrorResponse })
            );

            const expectedWettbewerbskontext = { ...wettbewerbskontext, kollegen: [] };

            expect(state).toEqual({
                schulen,
                schulenLoadingState: 'loaded',
                wettbewerbskontext: expectedWettbewerbskontext,
                wettbewerbskontextLoadingState: 'loaded',
                schulkollegiumLoadingState: 'technical-error',
            });
        });
        it('should not change the kollegium but set the loading state when technical error on schulkollegiumLadenFailed', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.schulkollegiumLadenFailed({ error: authorizationErrorResponse })
            );

            const expectedWettbewerbskontext = { ...wettbewerbskontext, kollegen: [] };

            expect(state).toEqual({
                schulen,
                schulenLoadingState: 'loaded',
                wettbewerbskontext: expectedWettbewerbskontext,
                wettbewerbskontextLoadingState: 'loaded',
                schulkollegiumLoadingState: 'unauthorized',
            });
        });
    });

    describe('wettbewerbsorganisationVerlassen', () => {
        it('should reset wettbewerbskontext and loading states', () => {
            const previousState: SchulenState = {
                schulen,
                schulenLoadingState: 'loaded',
                wettbewerbskontext: { ...wettbewerbskontext, kollegen: ['Leo Lemma', 'Rita Reihe'] },
                wettbewerbskontextLoadingState: 'loaded',
                schulkollegiumLoadingState: 'loaded',
            };

            const state = schulenFeature.reducer(previousState, wettbewerbsorganisationVerlassen());

            expect(state).toEqual({
                schulen,
                schulenLoadingState: 'loaded',
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadingState: 'not-loaded',
                schulkollegiumLoadingState: 'not-loaded',
            });
        });
    });

    describe('reset and userLoggedOut', () => {
        const previousState: SchulenState = {
            schulenLoadingState: 'loaded',
            schulen: schulen,
            wettbewerbskontext: undefined,
            wettbewerbskontextLoadingState: 'not-loaded',
            schulkollegiumLoadingState: 'not-loaded',
        };

        it('should reset to the initialState on userLoggedOut', () => {
            const state = schulenFeature.reducer(previousState, userLoggedOut());
            expect(state).toBe(initialSchulenState);
        });
    });
});
