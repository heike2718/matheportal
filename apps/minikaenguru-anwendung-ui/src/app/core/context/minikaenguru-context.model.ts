export const VERANSTALTERTYP = {
    lehrer: 'LEHRER',
    privat: 'PRIVAT',
    none: 'NONE',
} as const;

export type Veranstaltertyp = (typeof VERANSTALTERTYP)[keyof typeof VERANSTALTERTYP];
