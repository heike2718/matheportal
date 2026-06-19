import { RAETSELBAUKASTEN_ROLE, RaetselbaukastenUserRole } from './raetselbaukasten-role.model';

type UserWithRoles = {
    readonly roles: readonly string[];
};

export function resolveRaetselbaukastenUserRole(user: UserWithRoles | null): RaetselbaukastenUserRole {
    if (user === null || user.roles.length === 0) {
        return RAETSELBAUKASTEN_ROLE.NONE;
    }

    const roleAdmin: string[] = user.roles.filter(r => r === 'ADMIN');
    if (roleAdmin.length > 0) {
        return RAETSELBAUKASTEN_ROLE.ADMIN;
    }

    const roleAutor: string[] = user.roles.filter(r => r === 'AUTOR');

    if (roleAutor.length > 0) {
        return RAETSELBAUKASTEN_ROLE.AUTOR;
    }

    return RAETSELBAUKASTEN_ROLE.STANDARD;
}

export function isAdminOrAutor(user: UserWithRoles): boolean {
    const raetselbaukastenRole = resolveRaetselbaukastenUserRole(user);

    if (raetselbaukastenRole === RAETSELBAUKASTEN_ROLE.ADMIN || raetselbaukastenRole === RAETSELBAUKASTEN_ROLE.AUTOR) {
        return true;
    }

    return false;
}
