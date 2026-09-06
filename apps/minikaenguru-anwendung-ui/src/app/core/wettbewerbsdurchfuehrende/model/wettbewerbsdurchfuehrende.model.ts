import { components } from '../../../generated/api-types';

export type Durchfuehrungsart = components['schemas']['Wettbewerbsdurchfuehrungsart'];

export const DURCHFUEHRUNGSART = {
    schule: 'SCHULE',
    privat: 'PRIVAT',
} as const satisfies Record<string, Durchfuehrungsart>;

export type ZugangsberechtigungUnterlagen = components['schemas']['ZugangsberechtigungUnterlagen'];

export const ZUGANGSBERECHTIGUNG_UNTERLAGEN = {
    standard: 'STANDARD',
    erteilt: 'ERTEILT',
    entzogen: 'ENTZOGEN',
} as const satisfies Record<string, ZugangsberechtigungUnterlagen>;

export type WettbewerbsdurchfuehrenderDto = components['schemas']['Wettbewerbsdurchfuehrender'];

export type WettbewerbsdurchfuehrenderDraft = Omit<WettbewerbsdurchfuehrenderDto, 'durchfuehrungsart'> & {
    readonly durchfuehrungsart: Durchfuehrungsart | undefined;
};

export const initialWettbewerbsdurchfuehrender: WettbewerbsdurchfuehrenderDraft = {
    durchfuehrungsart: undefined,
    teilnahmenummern: [],
    newsletter: false,
    zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
};

export type WettbewerbsdurchfuehrenderRequest = components['schemas']['WettbewerbsdurchfuehrenderRequest'];
