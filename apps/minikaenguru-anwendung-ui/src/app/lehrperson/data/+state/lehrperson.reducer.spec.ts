import { HttpErrorResponse } from '@angular/common/http';
import { Ort, Schule } from '../../../core/model/schulkatalog.model';
import { LehrpersonActions } from './lehrperson.actions';
import { lehrpersonFeature, LehrpersonState } from './lehrperson.reducer';

describe('lehrpersonReducer', () => {
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

    describe('schulenGeladen', () => {
        it('should set the loadState and the schulen', () => {
            const previousState: LehrpersonState = {
                schulenLoadState: 'not-loaded',
                schulen: [],
            };

            const state = lehrpersonFeature.reducer(previousState, LehrpersonActions.schulenGeladen({ schulen }));
            expect(state).toEqual({
                schulenLoadState: 'loaded',
                schulen,
            });
        });
    });
    describe('schulenLadenFailed', () => {
        const previousState: LehrpersonState = {
            schulenLoadState: 'not-loaded',
            schulen: [],
        };

        it('should reset schulen and set the correct loadDtate when technical error', () => {
            const state = lehrpersonFeature.reducer(
                previousState,
                LehrpersonActions.schulenLadenFailed({ error: technicalErrorResponse })
            );
            expect(state).toEqual({
                schulenLoadState: 'technical-error',
                schulen: [],
            });
        });
        it('should reset schulen and set the correct loadDtate when session expired', () => {
            const state = lehrpersonFeature.reducer(
                previousState,
                LehrpersonActions.schulenLadenFailed({ error: unauthorizedErrorResponse })
            );
            expect(state).toEqual({
                schulenLoadState: 'unauthorized',
                schulen: [],
            });
        });
        it('should reset schulen and set the correct loadDtate when forbidden', () => {
            const state = lehrpersonFeature.reducer(
                previousState,
                LehrpersonActions.schulenLadenFailed({ error: forbiddenErrorResponse })
            );
            expect(state).toEqual({
                schulenLoadState: 'forbidden',
                schulen: [],
            });
        });
    });
});
