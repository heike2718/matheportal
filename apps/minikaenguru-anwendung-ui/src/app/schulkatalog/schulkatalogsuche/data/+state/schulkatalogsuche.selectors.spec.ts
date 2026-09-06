import { Ort, Schule } from '../../model/schulkatalog.model';
import { SchulkatalogsucheState } from './schulkatalogsuche.reducer';
import {
    orteLoaded,
    schulenLoaded,
    selectOrte,
    selectSchulen,
    selectSelectedOrt,
    selectSelectedSchule,
} from './schulkatalogsuche.selectors';

describe('schulkatalogsucheSelectors', () => {
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

    const state: SchulkatalogsucheState = {
        orte: orte,
        orteLoadingState: 'loaded',
        selectedOrt: orte[1],
        schulen: schulen,
        schulenLoadingState: 'loaded',
        selectedSchule: undefined,
    };

    it('should select the orte', () => {
        const result = selectOrte.projector(state);
        expect(result.length).toBe(2);
        expect(result[1]).toEqual(orte[1]);
    });

    it('should select the schulen', () => {
        const result = selectSchulen.projector(state);
        expect(result.length).toBe(2);
        expect(result[1].ort).toEqual(orte[1]);
    });

    it('should select the selectedOrt', () => {
        const result = selectSelectedOrt.projector(state);
        expect(result).toEqual(orte[1]);
    });

    it('should select the selected schule', () => {
        const result = selectSelectedSchule.projector(state);
        expect(result).toBeUndefined();
    });

    it('should select orteLoaded', () => {
        const result = orteLoaded.projector(state);
        expect(result).toBe(true);
    });

    it('should select schulenLoaded', () => {
        const result = schulenLoaded.projector({ ...state, schulenLoadingState: 'not-loaded' });
        expect(result).toBe(false);
    });
});
