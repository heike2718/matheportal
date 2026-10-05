import { HttpErrorResponse } from '@angular/common/http';
import {
    Land,
    LandMitOrtUndSchuleAnlegenRequest,
    Ort,
    OrtMitSchuleAnlegenRequest,
    Schule,
    SchuleAnlegenOderAendernRequest,
    SCHULKATALOG_ADMIN_KONTEXT,
    Schulkuerzel,
} from '../../model/schulkatalog.model';
import { SchulkatalogActions } from './schulkatalog.actions';

describe('SchulkatalogActions', () => {
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
        const payload: LandMitOrtUndSchuleAnlegenRequest = {
            emailAuftraggeber: 'test@provider.de',
            kuerzelLand: 'TT',
            nameLand: 'Tatütata',
            nameOrt: 'Trallala',
            nameSchule: 'Trullerschule',
        };

        it('should create the loadLaender action', () => {
            const action = SchulkatalogActions.loadLaender();

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadLaender',
            });
        });

        it('should create the loadLaenderSucceeded action', () => {
            const action = SchulkatalogActions.loadLaenderSucceeded({ laender });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadLaenderSucceeded',
                laender,
            });
        });

        it('should create the landSelected action', () => {
            const action = SchulkatalogActions.landSelected({ land: laender[1] });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] landSelected',
                land: laender[1],
            });
        });

        it('should create the ortMitSchuleAnlegenRequested action', () => {
            const action = SchulkatalogActions.ortMitSchuleAnlegenRequested();
            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] ortMitSchuleAnlegenRequested',
            });
        });

        it('should create the landMitOrtUndSchuleAnlegen action', () => {
            const action = SchulkatalogActions.landMitOrtUndSchuleAnlegen({ payload });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] landMitOrtUndSchuleAnlegen',
                payload,
            });
        });

        it('should create the landMitOrtUndSchuleAnlegenSucceeded action', () => {
            const action = SchulkatalogActions.landMitOrtUndSchuleAnlegenSucceeded({ schulkuerzel });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] landMitOrtUndSchuleAnlegenSucceeded',
                schulkuerzel,
            });
        });
    });
    describe('schulkatalog: orte actions', () => {
        const payload: OrtMitSchuleAnlegenRequest = {
            emailAuftraggeber: 'test@provider.de',
            nameOrt: 'Trallala',
            nameSchule: 'Trullerschule',
        };

        it('should create the loadOrte action', () => {
            const action = SchulkatalogActions.loadOrte({ land: laender[1] });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadOrte',
                land: laender[1],
            });
        });

        it('should create the loadOrteSucceeded action', () => {
            const action = SchulkatalogActions.loadOrteSucceeded({ orte });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadOrteSucceeded',
                orte,
            });
        });

        it('should create the backToLaenderRequested action', () => {
            const action = SchulkatalogActions.backToLaenderRequested();

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] backToLaenderRequested',
            });
        });

        it('should create the landSelected action', () => {
            const action = SchulkatalogActions.ortSelected({ ort: orte[0] });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] ortSelected',
                ort: orte[0],
            });
        });

        it('should create the schuleAnlegenRequested action', () => {
            const action = SchulkatalogActions.schuleAnlegenRequested();

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] schuleAnlegenRequested',
            });
        });

        it('should create the ortMitSchuleAnlegen action', () => {
            const action = SchulkatalogActions.ortMitSchuleAnlegen({ land: laender[0], payload });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] ortMitSchuleAnlegen',
                land: laender[0],
                payload,
            });
        });

        it('should create the ortMitSchuleAnlegenSucceeded action', () => {
            const action = SchulkatalogActions.ortMitSchuleAnlegenSucceeded({ land: laender[0], schulkuerzel });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] ortMitSchuleAnlegenSucceeded',
                land: laender[0],
                schulkuerzel,
            });
        });
    });
    describe('schulkatalog: schulen actions', () => {
        const payload: SchuleAnlegenOderAendernRequest = {
            emailAuftraggeber,
            name: 'Heinrich-Heine-Schule',
        };

        it('should create the loadSchulen action', () => {
            const action = SchulkatalogActions.loadSchulen({ ort: orte[0] });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadSchulen',
                ort: orte[0],
            });
        });

        it('should create the loadSchulenSucceeded action', () => {
            const action = SchulkatalogActions.loadSchulenSucceeded({ schulen });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadSchulenSucceeded',
                schulen,
            });
        });

        it('should create the backToOrteRequested action', () => {
            const action = SchulkatalogActions.backToOrteRequested();

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] backToOrteRequested',
            });
        });

        it('should create the schuleAnlegenRequested action', () => {
            const action = SchulkatalogActions.schuleAnlegenRequested();

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] schuleAnlegenRequested',
            });
        });

        it('should create the schuleAnlegen action', () => {
            const action = SchulkatalogActions.schuleAnlegen({ ort: orte[0], payload });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] schuleAnlegen',
                ort: orte[0],
                payload,
            });
        });

        it('should create the schuleAnlegenSucceeded action', () => {
            const action = SchulkatalogActions.schuleAnlegenSucceeded({ ort: orte[0], schulkuerzel });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] schuleAnlegenSucceeded',
                ort: orte[0],
                schulkuerzel,
            });
        });

        it('should create the schuleUmbenennenRequested action', () => {
            const action = SchulkatalogActions.schuleAnlegenRequested();

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] schuleAnlegenRequested',
            });
        });

        it('should create the schuleUmbenennen action', () => {
            const action = SchulkatalogActions.schuleUmbenennen({ schule: schulen[0], payload });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] schuleUmbenennen',
                schule: schulen[0],
                payload,
            });
        });
        it('should create the schuleUmbenennenSucceeded action', () => {
            const action = SchulkatalogActions.schuleUmbenennenSucceeded({ schule: schulen[0], schulkuerzel });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] schuleUmbenennenSucceeded',
                schule: schulen[0],
                schulkuerzel,
            });
        });
    });

    it.each([SCHULKATALOG_ADMIN_KONTEXT.laender, SCHULKATALOG_ADMIN_KONTEXT.orte, SCHULKATALOG_ADMIN_KONTEXT.schulen])(
        'should create the loadActionFailed action with kontext %s',
        kontext => {
            const action = SchulkatalogActions.loadActionFailed({ kontext, error: httpServerErrorResponse });

            expect(action).toEqual({
                type: '[MKAdmin Schulkatalog] loadActionFailed',
                kontext,
                error: httpServerErrorResponse,
            });
        }
    );

    it('should create the changeActionFailed action', () => {
        const action = SchulkatalogActions.changeActionFailed({ error: httpServerErrorResponse });

        expect(action).toEqual({
            type: '[MKAdmin Schulkatalog] changeActionFailed',
            error: httpServerErrorResponse,
        });
    });
});
