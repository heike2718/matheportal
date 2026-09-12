import { HttpErrorResponse } from '@angular/common/http';
import {
    Land,
    LandMitOrtUndSchuleAnlegenRequest,
    Ort,
    OrtMitSchuleAnlegenRequest,
    Schule,
    SchuleAnlegenOderAendernRequest,
    Schulkuerzel,
} from '../../model/schulkatalog.model';
import { schulkatalogActions } from './schulkatalog.actions';

describe('schulkatalogActions', () => {
    const emailAuftraggeber = 'test@provider.de';

    const schulkuerzel: Schulkuerzel = {
        kuerzel: 'Z9876543',
    };

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
        it('should create the ortMitSchuleAnlegenSelected action', () => {
            const action = schulkatalogActions.ortMitSchuleAnlegenSelected({ land: laender[1] });
            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] ortMitSchuleAnlegenSelected',
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

        it('should create the backToLaenderRequested action', () => {
            const action = schulkatalogActions.backToLaenderRequested();

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] backToLaenderRequested',
            });
        });

        it('should create the landSelected action', () => {
            const action = schulkatalogActions.ortSelected({ ort: orte[0] });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] ortSelected',
                ort: orte[0],
            });
        });

        it('should create the schuleAnlegenSelected action', () => {
            const action = schulkatalogActions.schuleAnlegenSelected({ ort: orte[0] });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] schuleAnlegenSelected',
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

        it('should create the backToOrteRequested action', () => {
            const action = schulkatalogActions.backToOrteRequested();

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] backToOrteRequested',
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
    describe('schule umbenennen actions', () => {
        it('should create the schuleUmbenennen action', () => {
            const payload: SchuleAnlegenOderAendernRequest = {
                emailAuftraggeber,
                name: 'Heinrich-Heine-Schule',
            };

            const kuerzelSchule = schulen[0].kuerzel;

            const action = schulkatalogActions.schuleUmbenennen({ kuerzelSchule, payload });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] schuleUmbenennen',
                kuerzelSchule,
                payload,
            });
        });
        it('should create the schuleUmbenennenSucceeded action', () => {
            const action = schulkatalogActions.schuleUmbenennenSucceeded({ schulkuerzel });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] schuleUmbenennenSucceeded',
                schulkuerzel,
            });
        });

        it('should create the schuleUmbenennenFailed action', () => {
            const action = schulkatalogActions.schuleUmbenennenFailed({ error: httpServerErrorResponse });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] schuleUmbenennenFailed',
                error: httpServerErrorResponse,
            });
        });
    });
    describe('schule anlegen actions', () => {
        it('should create the ortMitSchuleAnlegen action', () => {
            const payload: OrtMitSchuleAnlegenRequest = {
                emailAuftraggeber,
                nameOrt: 'Hinterwäldchen',
                nameSchule: 'Grundschule Hinterwäldchen',
            };

            const action = schulkatalogActions.ortMitSchuleAnlegen({ kuerzelLand: laender[1].kuerzel, payload });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] ortMitSchuleAnlegen',
                kuerzelLand: laender[1].kuerzel,
                payload,
            });
        });

        it('should create the ortMitSchuleAnlegenSucceeded action', () => {
            const action = schulkatalogActions.ortMitSchuleAnlegenSucceeded({ schulkuerzel });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] ortMitSchuleAnlegenSucceeded',
                schulkuerzel,
            });
        });

        it('should create the ortMitSchuleAnlegenFailed action', () => {
            const action = schulkatalogActions.ortMitSchuleAnlegenFailed({ error: httpServerErrorResponse });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] ortMitSchuleAnlegenFailed',
                error: httpServerErrorResponse,
            });
        });

        it('should create the landMitOrtUndSchuleAnlegen action', () => {
            const payload: LandMitOrtUndSchuleAnlegenRequest = {
                emailAuftraggeber,
                kuerzelLand: 'ZY',
                nameLand: 'Zypern',
                nameOrt: 'Nissi Beach',
                nameSchule: 'Deutsche Schule Nissi Beach',
            };

            const action = schulkatalogActions.landMitOrtUndSchuleAnlegen({ payload });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] landMitOrtUndSchuleAnlegen',
                payload,
            });
        });

        it('should create the landMitOrtUndSchuleAnlegenSucceeded action', () => {
            const action = schulkatalogActions.landMitOrtUndSchuleAnlegenSucceeded({ schulkuerzel });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] landMitOrtUndSchuleAnlegenSucceeded',
                schulkuerzel,
            });
        });

        it('should create the landMitOrtUndSchuleAnlegenFailed action', () => {
            const action = schulkatalogActions.landMitOrtUndSchuleAnlegenFailed({ error: httpServerErrorResponse });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] landMitOrtUndSchuleAnlegenFailed',
                error: httpServerErrorResponse,
            });
        });
    });
});
