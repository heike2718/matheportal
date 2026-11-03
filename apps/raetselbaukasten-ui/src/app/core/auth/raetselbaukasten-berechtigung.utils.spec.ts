import { isAdminOrAutor, resolveRaetselbaukastenBerechtigung } from './raetselbaukasten-berechtigung.utils';
import { RAETSELBAUKASTEN_BERECHTIGUNG } from './raetselbaukasten-berechtigung.model';
import { User } from '@matheportal/auth-model';

describe('resolveRaetselbaukastenBerechtigung', () => {
    it('should return NONE when null', () => {
        const result = resolveRaetselbaukastenBerechtigung(null);

        expect(result).toBe(RAETSELBAUKASTEN_BERECHTIGUNG.none);
    });

    it('should return NONE when no role', () => {
        const user: User = {
            anonym: true,
            berechtigungen: [],
            fullName: 'Gast',
        };
        const result = resolveRaetselbaukastenBerechtigung(user);

        expect(result).toBe(RAETSELBAUKASTEN_BERECHTIGUNG.none);
    });

    it('should return ADMIN when AUTOR and ADMIN', () => {
        const user: User = {
            anonym: false,
            berechtigungen: ['KL_ADMIN', 'AUTOR', 'ADMIN'],
            fullName: 'Ruth',
        };
        const result = resolveRaetselbaukastenBerechtigung(user);

        expect(result).toBe(RAETSELBAUKASTEN_BERECHTIGUNG.admin);
    });

    it('should return AUTOR when AUTOR', () => {
        const user: User = {
            anonym: false,
            berechtigungen: ['AUTOR', 'STANDARD'],
            fullName: 'Frodo',
        };
        const result = resolveRaetselbaukastenBerechtigung(user);

        expect(result).toBe(RAETSELBAUKASTEN_BERECHTIGUNG.autor);
    });

    it('should return STANDARD when STANDARD', () => {
        const user: User = {
            anonym: false,
            berechtigungen: ['STANDARD'],
            fullName: 'Bilbo',
        };
        const result = resolveRaetselbaukastenBerechtigung(user);

        expect(result).toBe(RAETSELBAUKASTEN_BERECHTIGUNG.standard);
    });

    it('should return STANDARD when any role but AUTOR or ADMIN', () => {
        const user: User = {
            anonym: false,
            berechtigungen: ['HALLO', 'KL_ADMIN'],
            fullName: 'Pippin',
        };
        const result = resolveRaetselbaukastenBerechtigung(user);

        expect(result).toBe(RAETSELBAUKASTEN_BERECHTIGUNG.standard);
    });
});

describe('isAdminOrAutor', () => {
    const user: User = {
        anonym: true,
        berechtigungen: [],
        fullName: 'Gast',
    };
    it('returns false when berechtigungen empty', () => {
        const result = isAdminOrAutor(user);
        expect(result).toBeFalsy();
    });

    it('returns false when berechtigungen not contains AUTOR and ADMIN', () => {
        const user: User = {
            anonym: false,
            berechtigungen: ['KL_ADMIN', 'STANDARD'],
            fullName: 'Bilbo',
        };
        const result = isAdminOrAutor(user);
        expect(result).toBeFalsy();
    });

    it('returns true when berechtigungen contains AUTOR', () => {
        const user: User = {
            anonym: false,
            berechtigungen: ['AUTOR', 'STANDARD'],
            fullName: 'Frodo',
        };
        const result = isAdminOrAutor(user);
        expect(result).toBeTruthy();
    });

    it('returns true when berechtigungen contains ADMIN', () => {
        const user: User = {
            anonym: false,
            berechtigungen: ['HALLO', 'KL_ADMIN', 'STANDARD', 'ADMIN'],
            fullName: 'Ruth',
        };
        const result = isAdminOrAutor(user);
        expect(result).toBeTruthy();
    });
});
