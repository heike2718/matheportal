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
            anzahlOrte: 17,
        },
        anzahlSchulen: 10,
    },
    {
        kuerzel: 'ORT-2',
        name: 'zweiter Ort',
        land: {
            kuerzel: 'DE-HE',
            name: 'Hessen',
            anzahlOrte: 7,
        },
        anzahlSchulen: 5,
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
            type: '[MKA Schulkatalogsuche] findOrte',
            name,
        });
    });

    it('should create findOrteSucceeded action', () => {
        const action = schulkatalogsucheActions.findOrteSucceeded({ orte });

        expect(action).toEqual({
            type: '[MKA Schulkatalogsuche] findOrteSucceeded',
            orte,
        });
    });

    it('should create findOrtFailed action when HttpErrorResponse', () => {
        const action = schulkatalogsucheActions.findOrteFailed({ error: httpServerErrorResponse });

        expect(action).toEqual({
            type: '[MKA Schulkatalogsuche] findOrteFailed',
            error: httpServerErrorResponse,
        });
    });

    it('should create loadSchulen action', () => {
        const action = schulkatalogsucheActions.loadSchulen({ ort: orte[0] });

        expect(action).toEqual({
            type: '[MKA Schulkatalogsuche] loadSchulen',
            ort: orte[0],
        });
    });

    it('should create loadSchulenSucceeded action', () => {
        const ortId = orte[0].kuerzel;
        const schulen: Schule[] = [
            {
                ort: orte[0],
                kuerzel: 'SCHULE-1',
                name: 'Albert-Einstein-Schule',
            },
        ];
        const action = schulkatalogsucheActions.loadSchulenSucceeded({ ortId, schulen });

        expect(action).toEqual({
            type: '[MKA Schulkatalogsuche] loadSchulenSucceeded',
            ortId,
            schulen,
        });
    });

    it('should create loadSchulenFailed action when http error', () => {
        const error = new Error('uiuiui');
        const action = schulkatalogsucheActions.loadSchulenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Schulkatalogsuche] loadSchulenFailed',
            error,
        });
    });

    it('should create ortSelected action', () => {
        const ort = orte[1];
        const action = schulkatalogsucheActions.ortSelected({ ort });

        expect(action).toEqual({
            type: '[MKA Schulkatalogsuche] ortSelected',
            ort,
        });
    });

    it('should create orteCleared action', () => {
        const action = schulkatalogsucheActions.orteCleared();

        expect(action).toEqual({
            type: '[MKA Schulkatalogsuche] orteCleared',
        });
    });

    it('should create schulenCleared action', () => {
        const action = schulkatalogsucheActions.schulenCleared();

        expect(action).toEqual({
            type: '[MKA Schulkatalogsuche] schulenCleared',
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
            type: '[MKA Schulkatalogsuche] schuleSelected',
            schule,
        });
    });

    it('should create resetSuche action', () => {
        const action = schulkatalogsucheActions.resetSuche();

        expect(action).toEqual({
            type: '[MKA Schulkatalogsuche] resetSuche',
        });
    });
});
