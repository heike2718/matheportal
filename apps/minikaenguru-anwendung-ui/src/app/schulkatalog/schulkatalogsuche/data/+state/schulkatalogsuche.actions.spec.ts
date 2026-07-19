import { HttpErrorResponse } from '@angular/common/http';
import { Ort, Schule } from '../../model/schulkatalog.model';
import { schulkatalogsucheActions } from './schulkatalogsuche.actions';

const orte: Ort[] = [
    {
        kuerzel: 'ORT-1',
        name: 'erster Ort',
        land: {
            kuerzel: 'DE-BY',
            name: 'Bayern',
        },
    },
    {
        kuerzel: 'ORT-2',
        name: 'zweiter Ort',
        land: {
            kuerzel: 'DE-HE',
            name: 'Hessen',
        },
    },
];

const httpServerErrorResponse = new HttpErrorResponse({
    status: 500,
    statusText: 'Internal Server Error',
    error: 'boom',
    url: '/ORT-1/schulen/',
});

describe('schulkatalogsucheActions', () => {
    it('should create findOrte action', () => {
        const name = 'Halle (Saale)';
        const action = schulkatalogsucheActions.findOrte({ name });

        expect(action).toEqual({
            type: '[Schulkatalogsuche] findOrte',
            name,
        });
    });

    it('should create findOrteSucceeded action', () => {
        const action = schulkatalogsucheActions.findOrteSucceeded({ orte });

        expect(action).toEqual({
            type: '[Schulkatalogsuche] findOrteSucceeded',
            orte,
        });
    });

    it('should create findOrtFailed action when HttpErrorResponse', () => {
        const action = schulkatalogsucheActions.findOrteFailed({ error: httpServerErrorResponse });

        expect(action).toEqual({
            type: '[Schulkatalogsuche] findOrteFailed',
            error: httpServerErrorResponse,
        });
    });

    it('should create findSchulen action', () => {
        const name = 'Einstein';

        const action = schulkatalogsucheActions.findSchulen({ ort: orte[0], name });

        expect(action).toEqual({
            type: '[Schulkatalogsuche] findSchulen',
            ort: orte[0],
            name,
        });
    });

    it('should create findSchulenSucceeded action', () => {
        const ortId = orte[0].kuerzel;
        const schulen: Schule[] = [
            {
                ort: orte[0],
                kuerzel: 'SCHULE-1',
                name: 'Albert-Einstein-Schule',
            },
        ];
        const action = schulkatalogsucheActions.findSchulenSucceeded({ ortId, schulen });

        expect(action).toEqual({
            type: '[Schulkatalogsuche] findSchulenSucceeded',
            ortId,
            schulen,
        });
    });

    it('should create findSchulenFailed action when http error', () => {
        const action = schulkatalogsucheActions.findSchulenFailed({ error: httpServerErrorResponse });

        expect(action).toEqual({
            type: '[Schulkatalogsuche] findSchulenFailed',
            error: httpServerErrorResponse,
        });
    });

    it('should create ortSelected action', () => {
        const ort = orte[1];
        const action = schulkatalogsucheActions.ortSelected({ ort });

        expect(action).toEqual({
            type: '[Schulkatalogsuche] ortSelected',
            ort,
        });
    });

    it('should create ortSelected action', () => {
        const schule: Schule = {
            ort: orte[1],
            kuerzel: 'SCHULE-1',
            name: 'Albert-Einstein-Schule',
        };
        const action = schulkatalogsucheActions.schuleSelected({ schule });

        expect(action).toEqual({
            type: '[Schulkatalogsuche] schuleSelected',
            schule,
        });
    });

    it('should create resetSuche action', () => {
        const action = schulkatalogsucheActions.resetSuche();

        expect(action).toEqual({
            type: '[Schulkatalogsuche] resetSuche',
        });
    });
});
