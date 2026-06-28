import { UserWithBerechtigungen } from '@matheportal/auth-model';
import { Veranstaltertyp, VERANSTALTERTYP } from './mka-authorization.model';

export function resolveVeranstaltertyp(user: UserWithBerechtigungen | null): Veranstaltertyp {
    if (user === null || user.berechtigungen.length === 0) {
        return VERANSTALTERTYP.none;
    }

    const berechtigungPrivat: string[] = user.berechtigungen.filter(b => b === 'PRIVAT');
    if (berechtigungPrivat.length > 0) {
        return VERANSTALTERTYP.privat;
    }

    const berechtigungLehrer: string[] = user.berechtigungen.filter(b => b === 'SCHULE');
    if (berechtigungLehrer.length > 0) {
        return VERANSTALTERTYP.schule;
    }

    return VERANSTALTERTYP.none;
}
