import { Schule } from '../../../core/model/schulkatalog.model';
import { LehrpersonState } from './lehrperson.reducer';
import { selectSchulauswahlMoeglich, selectSchulen, selectSchulenLoaded } from './lehrperson.selectors';

describe('lehrpersonSelectors', () => {
    const schulen: Schule[] = [
        {
            kuerzel: 'SCHULE-1',
            name: 'Neuhofschule',
            ort: {
                kuerzel: 'ORT-1',
                name: 'erster Ort',
                land: {
                    kuerzel: 'DE-BY',
                    name: 'Bayern',
                    anzahlOrte: 19,
                },
                anzahlSchulen: 1,
            },
        },
    ];

    const state: LehrpersonState = {
        schulenLoadState: 'loaded',
        schulen: schulen,
    };

    it('should expose schulen', () => {
        const result = selectSchulen.projector(state);
        expect(result).toEqual(schulen);
    });

    it('should expose selectSchulenLoaded return true when loaded', () => {
        const result = selectSchulenLoaded.projector(state);
        expect(result).toEqual(true);
    });

    describe('selectSchulenLloaded', () => {
        const theState: LehrpersonState = {
            schulen,
            schulenLoadState: 'not-loaded',
        };

        it('should selectSchulenLoaded return false when not-loaded', () => {
            const result = selectSchulenLoaded.projector(theState);
            expect(result).toEqual(false);
        });
        it('should selectSchulenLoaded return false when technical-error', () => {
            const result = selectSchulenLoaded.projector(theState);
            expect(result).toEqual(false);
        });
        it('should selectSchulenLoaded return false when unauthorized', () => {
            const result = selectSchulenLoaded.projector(theState);
            expect(result).toEqual(false);
        });
    });

    describe('selectSchulauswahlMoeglich', () => {
        it('should return false when loaded and only one school', () => {
            const result = selectSchulauswahlMoeglich.projector(true, schulen);
            expect(result).toBe(false);
        });
        it('should return false when not loaded and only one school', () => {
            const result = selectSchulauswahlMoeglich.projector(false, schulen);
            expect(result).toBe(false);
        });
        it('should return false when loaded and no school at all', () => {
            const result = selectSchulauswahlMoeglich.projector(true, []);
            expect(result).toBe(false);
        });
        it('should return true when loaded and more than one school', () => {
            const result = selectSchulauswahlMoeglich.projector(true, [
                ...schulen,
                {
                    kuerzel: 'SCHULE-2',
                    name: 'Bauhausschule',
                    ort: {
                        kuerzel: 'ORT-2',
                        name: 'zweiter Ort',
                        land: {
                            kuerzel: 'DE-SN',
                            name: 'Sachsen-Anhalt',
                            anzahlOrte: 13,
                        },
                        anzahlSchulen: 2,
                    },
                },
            ]);
            expect(result).toBe(true);
        });
    });
});
