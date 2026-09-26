import { User } from '@matheportal/auth-model';

export function hasBerechtigungFuerMinikaenguru(user: User): boolean {
    const requiredRoles = user.berechtigungen.filter(b => b === 'SCHULE' || b === 'PRIVAT');

    return requiredRoles.length > 0;
}
