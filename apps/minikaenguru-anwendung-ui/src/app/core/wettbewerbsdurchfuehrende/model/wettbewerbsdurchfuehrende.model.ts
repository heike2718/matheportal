export enum DURCHFUEHRUNGSART {
    schule = 'SCHULE',
    privat = 'PRIVAT',
}

export type Durchfuehrungsart = (typeof DURCHFUEHRUNGSART)[keyof typeof DURCHFUEHRUNGSART];

export enum ZUGANGSBERECHTIGUNG_UNTERLAGEN {
    standard = 'STANDARD',
    erteilt = 'ERTEILT',
    entzogen = 'ENTZOGEN',
}

export type ZugangsberechtigungUnterlagen =
    (typeof ZUGANGSBERECHTIGUNG_UNTERLAGEN)[keyof typeof ZUGANGSBERECHTIGUNG_UNTERLAGEN];

export interface WettbewerbsdurchfuehrenderDto {
    readonly durchfuehrungsart: string;
    readonly teilnahmenummern: string[];
    readonly newsletter: boolean;
    readonly zugangsberechtigungUnterlagen: string;
}

export interface Wettbewerbsdurchfuehrender {
    readonly durchfuehrungsart?: Durchfuehrungsart;
    readonly teilnahmenummern: string[];
    readonly newsletter: boolean;
    readonly zugangsberechtigungUnterlagen: ZugangsberechtigungUnterlagen;
}

export const initialWettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender = {
    durchfuehrungsart: undefined,
    teilnahmenummern: [],
    newsletter: false,
    zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
};

export interface WettbewerbsdurchfuehrenderRequest {
    readonly durchfuehrungsart: string;
    readonly schulkuerzel: string | null;
}
