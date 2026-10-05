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

    const unauthorizedErrorResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 401,
        statusText: 'unauthorized',
        error: 'boom',
        url: '/schulen/',
    });

    const forbiddenErrorResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 403,
        statusText: 'forbidden',
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
                schulenLoadState: 'loaded',
                schulen,
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'not-loaded',
                schulkollegiumLoadState: 'not-loaded',
            };
            const state = schulenFeature.reducer(previousState, unknownAction);
            expect(state).toBe(previousState);
        });
    });

    describe('schulenGeladen', () => {
        it('should reset previously loaded wettbewerbskontext and schulkollegizm and set the LoadState and the schulen', () => {
            const previousState: SchulenState = {
                schulenLoadState: 'not-loaded',
                schulen: [],
                wettbewerbskontext,
                wettbewerbskontextLoadState: 'loaded',
                schulkollegiumLoadState: 'loaded',
            };

            const state = schulenFeature.reducer(previousState, schulenActions.schulenGeladen({ schulen }));
            expect(state).toEqual({
                schulenLoadState: 'loaded',
                schulen,
                wettbewerbskontext,
                wettbewerbskontextLoadState: 'loaded',
                schulkollegiumLoadState: 'loaded',
            });
        });
    });
    describe('schulenLadenFailed', () => {
        const previousState: SchulenState = {
            schulenLoadState: 'not-loaded',
            schulen: [],
            wettbewerbskontext,
            wettbewerbskontextLoadState: 'loaded',
            schulkollegiumLoadState: 'loaded',
        };

        it('should reset previously loaded wettbewerbskontext and schulkollegium and set the LoadState when technical error', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.schulenLadenFailed({ error: technicalErrorResponse })
            );
            expect(state).toEqual({
                schulenLoadState: 'technical-error',
                schulen: [],
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'not-loaded',
                schulkollegiumLoadState: 'not-loaded',
            });
        });
        it('should reset previously loaded wettbewerbskontext and schulkollegium and set the LoadState when session expired', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.schulenLadenFailed({ error: unauthorizedErrorResponse })
            );
            expect(state).toEqual({
                schulenLoadState: 'unauthorized',
                schulen: [],
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'not-loaded',
                schulkollegiumLoadState: 'not-loaded',
            });
        });
        it('should reset previously loaded wettbewerbskontext and schulkollegium and set the LoadState when forbidden', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.schulenLadenFailed({ error: forbiddenErrorResponse })
            );
            expect(state).toEqual({
                schulenLoadState: 'forbidden',
                schulen: [],
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'not-loaded',
                schulkollegiumLoadState: 'not-loaded',
            });
        });
    });

    describe('wettbewerbskontext tests', () => {
        const previousState: SchulenState = {
            ...initialSchulenState,
            schulen,
            schulenLoadState: 'loaded',
        };

        it('should set the wettbewerbskontext', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.wettbewerbskontextGeladen({ wettbewerbskontext })
            );

            expect(state).toEqual({
                schulen,
                schulenLoadState: 'loaded',
                wettbewerbskontext,
                wettbewerbskontextLoadState: 'loaded',
                schulkollegiumLoadState: 'not-loaded',
            });
        });
        it('should not set the wettbewerbskontext but the loading state when technical error on wettbewerbskontextLadenFailed', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.wettbewerbskontextLadenFailed({ error: technicalErrorResponse })
            );

            expect(state).toEqual({
                schulen,
                schulenLoadState: 'loaded',
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'technical-error',
                schulkollegiumLoadState: 'not-loaded',
            });
        });
        it('should not set the wettbewerbskontext but the loading state when session expired on wettbewerbskontextLadenFailed', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.wettbewerbskontextLadenFailed({ error: unauthorizedErrorResponse })
            );

            expect(state).toEqual({
                schulen,
                schulenLoadState: 'loaded',
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'unauthorized',
                schulkollegiumLoadState: 'not-loaded',
            });
        });
        it('should not set the wettbewerbskontext but the loading state when loading the wettbewerbskontext is forbidden', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.wettbewerbskontextLadenFailed({ error: forbiddenErrorResponse })
            );

            expect(state).toEqual({
                schulen,
                schulenLoadState: 'loaded',
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'forbidden',
                schulkollegiumLoadState: 'not-loaded',
            });
        });
    });

    describe('schulkollegium tests', () => {
        const previousState: SchulenState = {
            schulen,
            schulenLoadState: 'loaded',
            wettbewerbskontext,
            wettbewerbskontextLoadState: 'loaded',
            schulkollegiumLoadState: 'not-loaded',
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
                schulenLoadState: 'loaded',
                wettbewerbskontext: expectedWettbewerbskontext,
                wettbewerbskontextLoadState: 'loaded',
                schulkollegiumLoadState: 'loaded',
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
                schulenLoadState: 'loaded',
                wettbewerbskontext,
                wettbewerbskontextLoadState: 'loaded',
                schulkollegiumLoadState: 'loaded',
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
                schulenLoadState: 'loaded',
                wettbewerbskontext: expectedWettbewerbskontext,
                wettbewerbskontextLoadState: 'loaded',
                schulkollegiumLoadState: 'technical-error',
            });
        });
        it('should not change the kollegium but set the loading state when unauthorized on schulkollegiumLadenFailed', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.schulkollegiumLadenFailed({ error: unauthorizedErrorResponse })
            );

            const expectedWettbewerbskontext = { ...wettbewerbskontext, kollegen: [] };

            expect(state).toEqual({
                schulen,
                schulenLoadState: 'loaded',
                wettbewerbskontext: expectedWettbewerbskontext,
                wettbewerbskontextLoadState: 'loaded',
                schulkollegiumLoadState: 'unauthorized',
            });
        });
        it('should not change the kollegium but set the loading state when schulkollegiumLadenFailed with 403', () => {
            const state = schulenFeature.reducer(
                previousState,
                schulenActions.schulkollegiumLadenFailed({ error: forbiddenErrorResponse })
            );

            const expectedWettbewerbskontext = { ...wettbewerbskontext, kollegen: [] };

            expect(state).toEqual({
                schulen,
                schulenLoadState: 'loaded',
                wettbewerbskontext: expectedWettbewerbskontext,
                wettbewerbskontextLoadState: 'loaded',
                schulkollegiumLoadState: 'forbidden',
            });
        });
    });

    describe('wettbewerbsorganisationVerlassen', () => {
        it('should reset wettbewerbskontext and loading states', () => {
            const previousState: SchulenState = {
                schulen,
                schulenLoadState: 'loaded',
                wettbewerbskontext: { ...wettbewerbskontext, kollegen: ['Leo Lemma', 'Rita Reihe'] },
                wettbewerbskontextLoadState: 'loaded',
                schulkollegiumLoadState: 'loaded',
            };

            const state = schulenFeature.reducer(previousState, wettbewerbsorganisationVerlassen());

            expect(state).toEqual({
                schulen,
                schulenLoadState: 'loaded',
                wettbewerbskontext: undefined,
                wettbewerbskontextLoadState: 'not-loaded',
                schulkollegiumLoadState: 'not-loaded',
            });
        });
    });

    describe('reset and userLoggedOut', () => {
        const previousState: SchulenState = {
            schulenLoadState: 'loaded',
            schulen: schulen,
            wettbewerbskontext: undefined,
            wettbewerbskontextLoadState: 'not-loaded',
            schulkollegiumLoadState: 'not-loaded',
        };

        it('should reset to the initialState on userLoggedOut', () => {
            const state = schulenFeature.reducer(previousState, userLoggedOut());
            expect(state).toBe(initialSchulenState);
        });
    });
});
