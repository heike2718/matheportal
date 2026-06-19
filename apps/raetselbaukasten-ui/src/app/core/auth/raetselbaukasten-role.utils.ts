import { RAETSELBAUKASTEN_ROLE, RaetselbaukastenUserRole } from './raetselbaukasten-role.model';

type UserWithBerechtigungen = {
    readonly berechtigungen: readonly string[];
};

export function resolveRaetselbaukastenUserRole(user: UserWithBerechtigungen | null): RaetselbaukastenUserRole {
    if (user === null || user.berechtigungen.length === 0) {
        return RAETSELBAUKASTEN_ROLE.NONE;
    }

    const roleAdmin: string[] = user.berechtigungen.filter(r => r === 'ADMIN');
    if (roleAdmin.length > 0) {
        return RAETSELBAUKASTEN_ROLE.ADMIN;
    }

    const roleAutor: string[] = user.berechtigungen.filter(r => r === 'AUTOR');

    if (roleAutor.length > 0) {
        return RAETSELBAUKASTEN_ROLE.AUTOR;
    }

    return RAETSELBAUKASTEN_ROLE.STANDARD;
}

export function isAdminOrAutor(user: UserWithBerechtigungen): boolean {
    const raetselbaukastenRole = resolveRaetselbaukastenUserRole(user);

    if (raetselbaukastenRole === RAETSELBAUKASTEN_ROLE.ADMIN || raetselbaukastenRole === RAETSELBAUKASTEN_ROLE.AUTOR) {
        return true;
    }

    return false;
}
