import { Schule } from '../../../core/model/schulkatalog.model';
import { SchulenState } from './schulen.reducer';
import { selectSchulen } from './schulen.selectors';

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
    };

    it('should expose schulen', () => {
        const result = selectSchulen.projector(state);
        expect(result).toEqual(schulen);
    });
});
