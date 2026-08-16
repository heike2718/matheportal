import { Land, Ort } from '../../model/schulkatalog.model';
import { SchulkatalogState } from './schulkatalog.reducer';
import { fromSchulkatalog } from './schulkatalog.selectors';

describe('schulkatalogSelectors', () => {
    const laender: Land[] = [
        {
            kuerzel: 'LAND-1',
            name: 'erstes Land',
            anzahlOrte: 5,
        },
        {
            kuerzel: 'LAND-2',
            name: 'zweites Land',
            anzahlOrte: 2,
        },
    ];

    const orte: Ort[] = [
        {
            land: laender[0],
            kuerzel: 'ORT-11',
            name: 'erster Ort',
            anzahlSchulen: 10,
        },
        {
            land: laender[0],
            kuerzel: 'ORT-12',
            name: 'zweiter Ort',
            anzahlSchulen: 2,
        },
        {
            land: laender[0],
            kuerzel: 'ORT-13',
            name: 'dritter Ort',
            anzahlSchulen: 24,
        },
    ];

    const state: SchulkatalogState = {
        laender,
        laenderLoadingState: 'loaded',
        selectedLand: laender[0],
        orte,
        orteLoadingState: 'loaded',
        selectedOrt: orte[1],
        schulen: [],
        schulenLoadingState: 'not-loaded',
        selectedSchule: undefined,
    };

    it('should select the laender', () => {
        const result = fromSchulkatalog.selectLaender.projector(state);
        expect(result.length).toBe(2);
    });

    it('should select laenderLoaded', () => {
        const result = fromSchulkatalog.selectLaenderLoadad.projector(state);
        expect(result).toBe(true);
    });

    it('should select landSelected', () => {
        const result = fromSchulkatalog.selectLandSelected.projector(state.selectedLand);
        expect(result).toBe(true);
    });

    it('should select selectedLand', () => {
        const result = fromSchulkatalog.selectSelectedLand.projector(state);
        expect(result).toBe(laender[0]);
    });

    it('should select the orte', () => {
        const result = fromSchulkatalog.selectOrte.projector(state);
        expect(result.length).toBe(3);
    });

    it('should select orteLoaded', () => {
        const result = fromSchulkatalog.selectOrteLoaded.projector(state);
        expect(result).toBe(true);
    });

    it('should select ortSelected', () => {
        const result = fromSchulkatalog.selectOrtSelected.projector(state.selectedOrt);
        expect(result).toBe(true);
    });

    it('should select selectedOrt', () => {
        const result = fromSchulkatalog.selectSelectedOrt.projector(state);
        expect(result).toBe(orte[1]);
    });

    it('should select beschreibungSelectedOrt', () => {
        expect(fromSchulkatalog.selectSelectedOrt.projector(state)).toBe(orte[1]);
        const result = fromSchulkatalog.selectBeschreibungSelectedOrt.projector(state);
        expect(result).toBe('zweiter Ort (erstes Land)');
    });

    it('should select the schulen', () => {
        const result = fromSchulkatalog.selectSchulen.projector(state);
        expect(result.length).toBe(0);
    });

    it('should select schulenLoaded', () => {
        const result = fromSchulkatalog.selectSchulenLoaded.projector(state);
        expect(result).toBe(false);
    });

    it('should select schuleSelected', () => {
        const result = fromSchulkatalog.selectSchuleSelected.projector(state.selectedSchule);
        expect(result).toBe(false);
    });

    it('should select selectedSchule', () => {
        const result = fromSchulkatalog.selectSelectedSchule.projector(state);
        expect(result).toBeUndefined();
    });
});
