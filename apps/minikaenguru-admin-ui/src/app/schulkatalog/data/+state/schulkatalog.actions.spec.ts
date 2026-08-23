import { HttpErrorResponse } from '@angular/common/http';
import { Land, Ort, Schule } from '../../model/schulkatalog.model';
import { schulkatalogActions } from './schulkatalog.actions';

describe('schulkatalogActions', () => {
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

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/ORT-1/schulen/',
    });

    describe('schulkatalog: laender actions', () => {
        it('should create the loadLaender action', () => {
            const action = schulkatalogActions.loadLaender();

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadLaender',
            });
        });

        it('should create the loadLaenderSucceeded action', () => {
            const action = schulkatalogActions.loadLaenderSucceeded({ laender });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadLaenderSucceeded',
                laender,
            });
        });

        it('should create the loadLaenderFailed action', () => {
            const action = schulkatalogActions.loadLaenderFailed({ error: httpServerErrorResponse });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadLaenderFailed',
                error: httpServerErrorResponse,
            });
        });

        it('should create the landSelected action', () => {
            const action = schulkatalogActions.landSelected({ land: laender[1] });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] landSelected',
                land: laender[1],
            });
        });
    });
    describe('schulkatalog: orte actions', () => {
        it('should create the loadOrte action', () => {
            const action = schulkatalogActions.loadOrte({ land: laender[1] });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadOrte',
                land: laender[1],
            });
        });

        it('should create the loadOrteSucceeded action', () => {
            const action = schulkatalogActions.loadOrteSucceeded({ orte });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadOrteSucceeded',
                orte,
            });
        });

        it('should create the loadOrteFailed action', () => {
            const action = schulkatalogActions.loadOrteFailed({ error: httpServerErrorResponse });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadOrteFailed',
                error: httpServerErrorResponse,
            });
        });

        it('should create the landSelected action', () => {
            const action = schulkatalogActions.ortSelected({ ort: orte[0] });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] ortSelected',
                ort: orte[0],
            });
        });
    });
    describe('schulkatalog: schulen actions', () => {
        it('should create the loadSchulen action', () => {
            const action = schulkatalogActions.loadSchulen({ ort: orte[0] });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadSchulen',
                ort: orte[0],
            });
        });

        it('should create the loadSchulenSucceeded action', () => {
            const action = schulkatalogActions.loadSchulenSucceeded({ schulen });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadSchulenSucceeded',
                schulen,
            });
        });

        it('should create the loadSchulenFailed action', () => {
            const action = schulkatalogActions.loadSchulenFailed({ error: httpServerErrorResponse });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadSchulenFailed',
                error: httpServerErrorResponse,
            });
        });
        it('should create the schuleUmbenennenSelected action', () => {
            const action = schulkatalogActions.schuleUmbenennenSelected({ schule: schulen[0] });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] schuleUmbenennenSelected',
                schule: schulen[0],
            });
        });
    });
});
