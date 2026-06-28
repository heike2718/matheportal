export const GEWAEHLTE_TEILNAHMEART = {
    schule: 'schule',
    privat: 'privat',
    none: 'nicht_teilnehmen',
} as const;

export type GewaehlteTeilnahmeart = (typeof GEWAEHLTE_TEILNAHMEART)[keyof typeof GEWAEHLTE_TEILNAHMEART];
