import { Land, Ort } from '../model/schulkatalog.model';
import { getBeschreibungSelectedOrt } from './schulkatalogsuche-data.utils';

describe('schulkatalogsuche-data.utils', () => {
    it('should getBeschreibungSelectedOrt work when names differ', () => {
        const land: Land = {
            kuerzel: 'DE-BY',
            name: 'Bayern',
        };
        const ort: Ort = {
            land,
            kuerzel: 'ORT-1',
            name: 'Kleinkuckucksdorf',
            anzahlSchulen: 3,
        };

        const result = getBeschreibungSelectedOrt(ort);

        expect(result).toBe('Kleinkuckucksdorf (Bayern)');
    });
    it('should getBeschreibungSelectedOrt work when names ar equal', () => {
        const land: Land = {
            kuerzel: 'DE-HH',
            name: 'Hamburg',
        };
        const ort: Ort = {
            land,
            kuerzel: 'ORT-1',
            name: 'Hamburg',
            anzahlSchulen: 356,
        };

        const result = getBeschreibungSelectedOrt(ort);

        expect(result).toBe('Hamburg');
    });
});
