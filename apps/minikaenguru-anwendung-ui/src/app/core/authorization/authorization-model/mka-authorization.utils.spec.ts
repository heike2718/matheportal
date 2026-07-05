import { MINIKAENGURU_BERECHTIGUNGSTYP } from './mka-authorization.model';
import { resolveBerechtigungstyp } from './mka-authorization.utils';

describe('resolveVeranstaltertyp', () => {
    it('should return none when null', () => {
        const result = resolveBerechtigungstyp(null);

        expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.none);
    });
    it('should return none when berechtigungen empty', () => {
        const result = resolveBerechtigungstyp({ berechtigungen: [] });

        expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.none);
    });
    it('should return none when standard', () => {
        const result = resolveBerechtigungstyp({ berechtigungen: ['STANDARD', 'AUTOR'] });

        expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.none);
    });
    it('should return privat when Privatveranstalter', () => {
        const result = resolveBerechtigungstyp({ berechtigungen: ['STANDARD', 'PRIVAT'] });

        expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.privat);
    });
    it('should return schule when Schule', () => {
        const result = resolveBerechtigungstyp({ berechtigungen: ['STANDARD', 'SCHULE'] });

        expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.schule);
    });
});
