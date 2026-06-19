import { isAdminOrAutor, resolveRaetselbaukastenUserRole } from './raetselbaukasten-role.utils';
import { RAETSELBAUKASTEN_ROLE } from './raetselbaukasten-role.model';

describe('resolveRaetselbaukastenUserRole', () => {
    it('should return NONE when null', () => {
        const result = resolveRaetselbaukastenUserRole(null);

        expect(result).toBe(RAETSELBAUKASTEN_ROLE.NONE);
    });

    it('should return NONE when no role', () => {
        const result = resolveRaetselbaukastenUserRole({ berechtigungen: [] });

        expect(result).toBe(RAETSELBAUKASTEN_ROLE.NONE);
    });

    it('should return ADMIN when AUTOR and ADMIN', () => {
        const result = resolveRaetselbaukastenUserRole({ berechtigungen: ['KL_ADMIN', 'AUTOR', 'ADMIN'] });

        expect(result).toBe(RAETSELBAUKASTEN_ROLE.ADMIN);
    });

    it('should return AUTOR when AUTOR', () => {
        const result = resolveRaetselbaukastenUserRole({ berechtigungen: ['AUTOR', 'STANDARD'] });

        expect(result).toBe(RAETSELBAUKASTEN_ROLE.AUTOR);
    });

    it('should return STANDARD when STANDARD', () => {
        const result = resolveRaetselbaukastenUserRole({ berechtigungen: ['LEHRER', 'STANDARD'] });

        expect(result).toBe(RAETSELBAUKASTEN_ROLE.STANDARD);
    });

    it('should return STANDARD when any role but AUTOR or ADMIN', () => {
        const result = resolveRaetselbaukastenUserRole({ berechtigungen: ['HALLO', 'KL_ADMIN'] });

        expect(result).toBe(RAETSELBAUKASTEN_ROLE.STANDARD);
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
