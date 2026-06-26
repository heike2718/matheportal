import { isAdminOrAutor, resolveRaetselbaukastenBerechtigung } from './raetselbaukasten-berechtigung.utils';
import { RAETSELBAUKASTEN_BERECHTIGUNG } from './raetselbaukasten-berechtigung.model';

describe('resolveRaetselbaukastenBerechtigung', () => {
    it('should return NONE when null', () => {
        const result = resolveRaetselbaukastenBerechtigung(null);

        expect(result).toBe(RAETSELBAUKASTEN_BERECHTIGUNG.none);
    });

    it('should return NONE when no role', () => {
        const result = resolveRaetselbaukastenBerechtigung({ berechtigungen: [] });

        expect(result).toBe(RAETSELBAUKASTEN_BERECHTIGUNG.none);
    });

    it('should return ADMIN when AUTOR and ADMIN', () => {
        const result = resolveRaetselbaukastenBerechtigung({ berechtigungen: ['KL_ADMIN', 'AUTOR', 'ADMIN'] });

        expect(result).toBe(RAETSELBAUKASTEN_BERECHTIGUNG.admin);
    });

    it('should return AUTOR when AUTOR', () => {
        const result = resolveRaetselbaukastenBerechtigung({ berechtigungen: ['AUTOR', 'STANDARD'] });

        expect(result).toBe(RAETSELBAUKASTEN_BERECHTIGUNG.autor);
    });

    it('should return STANDARD when STANDARD', () => {
        const result = resolveRaetselbaukastenBerechtigung({ berechtigungen: ['LEHRER', 'STANDARD'] });

        expect(result).toBe(RAETSELBAUKASTEN_BERECHTIGUNG.standard);
    });

    it('should return STANDARD when any role but AUTOR or ADMIN', () => {
        const result = resolveRaetselbaukastenBerechtigung({ berechtigungen: ['HALLO', 'KL_ADMIN'] });

        expect(result).toBe(RAETSELBAUKASTEN_BERECHTIGUNG.standard);
    });
});

describe('isAdminOrAutor', () => {
    it('returns false when berechtigungen empty', () => {
        const result = isAdminOrAutor({ berechtigungen: [] });
        expect(result).toBeFalsy();
    });

    it('returns false when berechtigungen not contains AUTOR and ADMIN', () => {
        const result = isAdminOrAutor({ berechtigungen: ['KL_ADMIN', 'STANDARD'] });
        expect(result).toBeFalsy();
    });

    it('returns true when berechtigungen contains AUTOR', () => {
        const result = isAdminOrAutor({ berechtigungen: ['HALLO', 'KL_ADMIN', 'STANDARD', 'AUTOR'] });
        expect(result).toBeTruthy();
    });

    it('returns true when berechtigungen contains ADMIN', () => {
        const result = isAdminOrAutor({ berechtigungen: ['HALLO', 'KL_ADMIN', 'STANDARD', 'ADMIN'] });
        expect(result).toBeTruthy();
    });
});
