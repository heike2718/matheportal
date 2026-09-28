import { Action } from '@ngrx/store';
import { Ort, Schule } from '../../../core/model/schulkatalog.model';
import { initialSchulenState, schulenFeature, SchulenState } from './schulen.reducer';
import { components } from '../../../generated/api-types';
import { schulenActions } from './schulen.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { userLoggedOut } from '@matheportal/auth-api';

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

    describe('sanity checks', () => {
        const unknownAction = { type: 'unknownAction' } as Action;

        it('should return the initial state, when unknown action and undefined state', () => {
            const state = schulenFeature.reducer(undefined, unknownAction);
            expect(state).toBe(initialSchulenState);
        });
        it('should return the previous state, when unknown action and defined state', () => {
            const previousState: SchulenState = { schulenLoadingState: 'loaded', schulen };
            const state = schulenFeature.reducer(previousState, unknownAction);
            expect(state).toBe(previousState);
        });
    });

    describe('schulenGeladen', () => {
        it('should set the loadingState and the schulen', () => {
            const state = schulenFeature.reducer(initialSchulenState, schulenActions.schulenGeladen({ schulen }));
            expect(state).toEqual({ schulenLoadingState: 'loaded', schulen });
        });
    });
    describe('schulenLadenFailed', () => {
        it('should set the loadingState when technical error', () => {
            const httpErrorResponse: HttpErrorResponse = new HttpErrorResponse({
                status: 500,
                statusText: 'Internal Server Error',
                error: 'boom',
                url: '/schulen/',
            });
            const state = schulenFeature.reducer(
                initialSchulenState,
                schulenActions.schulenLadenFailed({ error: httpErrorResponse })
            );
            expect(state).toEqual({ schulenLoadingState: 'technical-error', schulen: [] });
        });
        it('should set the loadingState when session expired', () => {
            const httpErrorResponse: HttpErrorResponse = new HttpErrorResponse({
                status: 401,
                statusText: 'Internal Server Error',
                error: 'boom',
                url: '/schulen/',
            });
            const state = schulenFeature.reducer(
                initialSchulenState,
                schulenActions.schulenLadenFailed({ error: httpErrorResponse })
            );
            expect(state).toEqual({ schulenLoadingState: 'unauthorized', schulen: [] });
        });
    });

    describe('reset and userLoggedOut', () => {
        const previousState: SchulenState = {
            schulenLoadingState: 'loaded',
            schulen: schulen,
        };

        it('should reset to the initialState on userLoggedOut', () => {
            const state = schulenFeature.reducer(previousState, userLoggedOut());
            expect(state).toBe(initialSchulenState);
        });
    });
});
