export const RAETSELBAUKASTEN_BERECHTIGUNG = {
    none: 'NONE',
    standard: 'STANDARD',
    autor: 'AUTOR',
    admin: 'ADMIN',
} as const;

export type RaetselbaukastenUserBerechtigung =
    (typeof RAETSELBAUKASTEN_BERECHTIGUNG)[keyof typeof RAETSELBAUKASTEN_BERECHTIGUNG];
