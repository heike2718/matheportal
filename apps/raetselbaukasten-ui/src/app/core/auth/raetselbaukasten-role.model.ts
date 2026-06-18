export type RaetselbaukastenUserRole = 'NONE' | 'STANDARD' | 'AUTOR' | 'ADMIN';

export const RAETSELBAUKASTEN_ROLE = {
    NONE: 'NONE',
    STANDARD: 'STANDARD',
    AUTOR: 'AUTOR',
    ADMIN: 'ADMIN',
} as const;
