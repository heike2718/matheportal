export function isAdmin(berechtigungen: string[]): boolean {
    return berechtigungen.filter(b => 'ADMIN' === b).length > 0;
}
