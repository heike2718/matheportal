import { Schule } from '../../../core/model/schulkatalog.model';
import { SchulenState } from './schulen.reducer';
import { selectSchulen, selectSchulenLoaded } from './schulen.selectors';

describe('schulenSelectors', () => {
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

    const state: SchulenState = {
        schulenLoadingState: 'loaded',
        schulen: schulen,
        wettbewerbskontext: undefined,
        wettbewerbskontextLoadingState: 'not-loaded',
        schulkollegiumLoadingState: 'not-loaded',
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
        const theState: SchulenState = {
            schulen,
            schulenLoadingState: 'not-loaded',
            wettbewerbskontext: undefined,
            wettbewerbskontextLoadingState: 'not-loaded',
            schulkollegiumLoadingState: 'not-loaded',
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

    it('should expose selectedSchule undefined', () => {
        const result = selectSchulen.projector(state);
        expect(result).toEqual(schulen);
    });
});
