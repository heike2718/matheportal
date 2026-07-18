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

describe('Schulkatalogsuche actions tests', () => {
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

    it('should create findOrtFailed action', () => {
        const action = schulkatalogsucheActions.findOrteFailed();

        expect(action).toEqual({
            type: '[Schulkatalogsuche] findOrteFailed',
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

    it('should create findOrteSucceeded action', () => {
        const schulen: Schule[] = [
            {
                ort: orte[0],
                kuerzel: 'SCHULE-1',
                name: 'Albert-Einstein-Schule',
            },
        ];
        const action = schulkatalogsucheActions.findSchulenSucceeded({ schulen });

        expect(action).toEqual({
            type: '[Schulkatalogsuche] findSchulenSucceeded',
            schulen,
        });
    });

    it('should create findSchulenFailed action', () => {
        const action = schulkatalogsucheActions.findSchulenFailed();

        expect(action).toEqual({
            type: '[Schulkatalogsuche] findSchulenFailed',
        });
    });
});
