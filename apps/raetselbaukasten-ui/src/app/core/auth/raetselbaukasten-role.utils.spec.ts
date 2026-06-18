import { anonymousUser, User } from '@matheportal/auth-model';
import { resolveRaetselbaukastenUserRole } from './raetselbaukasten-role.utils';
import { RAETSELBAUKASTEN_ROLE } from './raetselbaukasten-role.model';

describe('resolveRaetselbaukastenUserRole', () => {
    it('should return NONE when null', () => {
        const result = resolveRaetselbaukastenUserRole(null);

        expect(result).toBe(RAETSELBAUKASTEN_ROLE.NONE);
    });

    it('should return NONE when no role', () => {
        const result = resolveRaetselbaukastenUserRole({ roles: [] });

        expect(result).toBe(RAETSELBAUKASTEN_ROLE.NONE);
    });

    it('should return ADMIN when AUTOR and ADMIN', () => {
        const result = resolveRaetselbaukastenUserRole({ roles: ['KL_ADMIN', 'AUTOR', 'ADMIN'] });

        expect(result).toBe(RAETSELBAUKASTEN_ROLE.ADMIN);
    });

    it('should return AUTOR when AUTOR', () => {
        const result = resolveRaetselbaukastenUserRole({ roles: ['AUTOR', 'STANDARD'] });

        expect(result).toBe(RAETSELBAUKASTEN_ROLE.AUTOR);
    });

    it('should return STANDARD when STANDARD', () => {
        const result = resolveRaetselbaukastenUserRole({ roles: ['LEHRER', 'STANDARD'] });

        expect(result).toBe(RAETSELBAUKASTEN_ROLE.STANDARD);
    });

    it('should return STANDARD when any role but AUTOR or ADMIN', () => {
        const result = resolveRaetselbaukastenUserRole({ roles: ['HALLO', 'KL_ADMIN'] });

        expect(result).toBe(RAETSELBAUKASTEN_ROLE.STANDARD);
    });
});
