import { VERANSTALTERTYP } from './minikaenguru-context.model';
import { resolveVeranstaltertyp } from './minikaenguru-context.utils';

describe('resolveVeranstaltertyp', () => {
    it('should return none when null', () => {
        const result = resolveVeranstaltertyp(null);

        expect(result).toBe(VERANSTALTERTYP.none);
    });
    it('should return none when berechtigungen empty', () => {
        const result = resolveVeranstaltertyp({ berechtigungen: [] });

        expect(result).toBe(VERANSTALTERTYP.none);
    });
    it('should return none when standard', () => {
        const result = resolveVeranstaltertyp({ berechtigungen: ['STANDARD', 'AUTOR'] });

        expect(result).toBe(VERANSTALTERTYP.none);
    });
    it('should return privat when Privatveranstalter', () => {
        const result = resolveVeranstaltertyp({ berechtigungen: ['STANDARD', 'PRIVAT'] });

        expect(result).toBe(VERANSTALTERTYP.privat);
    });
    it('should return lehrer when Lehrer', () => {
        const result = resolveVeranstaltertyp({ berechtigungen: ['STANDARD', 'LEHRER'] });

        expect(result).toBe(VERANSTALTERTYP.lehrer);
    });
});
