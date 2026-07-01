export const GEWAEHLTE_DURCHFUEHRUNGSART = {
    schule: 'schule',
    privat: 'privat',
} as const;

export type GewaehlteDurchfuehrungsart = (typeof GEWAEHLTE_DURCHFUEHRUNGSART)[keyof typeof GEWAEHLTE_DURCHFUEHRUNGSART];
