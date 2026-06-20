import { UserWithBerechtigungen } from '@matheportal/auth-model';
import { RAETSELBAUKASTEN_BERECHTIGUNG, RaetselbaukastenUserBerechtigung } from './raetselbaukasten-berechtigung.model';

export function resolveRaetselbaukastenBerechtigung(
    user: UserWithBerechtigungen | null
): RaetselbaukastenUserBerechtigung {
    if (user === null || user.berechtigungen.length === 0) {
        return RAETSELBAUKASTEN_BERECHTIGUNG.none;
    }

    const berechtigungAdmin: string[] = user.berechtigungen.filter(r => r === 'ADMIN');
    if (berechtigungAdmin.length > 0) {
        return RAETSELBAUKASTEN_BERECHTIGUNG.admin;
    }

    const berechtigungAutor: string[] = user.berechtigungen.filter(r => r === 'AUTOR');

    if (berechtigungAutor.length > 0) {
        return RAETSELBAUKASTEN_BERECHTIGUNG.autor;
    }

    return RAETSELBAUKASTEN_BERECHTIGUNG.standard;
}

export function isAdminOrAutor(user: UserWithBerechtigungen): boolean {
    const raetselbaukastenBerechtigung = resolveRaetselbaukastenBerechtigung(user);

    if (
        raetselbaukastenBerechtigung === RAETSELBAUKASTEN_BERECHTIGUNG.admin ||
        raetselbaukastenBerechtigung === RAETSELBAUKASTEN_BERECHTIGUNG.autor
    ) {
        return true;
    }

    return false;
}
