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

export const WETTBEWERBSDURCHFUEHRENDE_FEATURE_KEY = 'wettbewerbsdurchfuehrende';

export interface WettbewerbsdurchfuerenderRequest {
    readonly durchfuehrungsart: string;
    readonly schule: string | null;
}

// -----------------------------  mapping -------------------------------------------//

function mapToDurchfuehrungsart(value: string): Durchfuehrungsart {
    if (Object.values(DURCHFUEHRUNGSART).includes(value as Durchfuehrungsart)) {
        return value as Durchfuehrungsart;
    }

    throw new Error(`unerwarteter Wert ${value} - kann nicht auf Durchfuehrungsart gemapped werden`);
}

function mapToZugangsberechtigungUnterlagen(value: string): ZugangsberechtigungUnterlagen {
    if (Object.values(ZUGANGSBERECHTIGUNG_UNTERLAGEN).includes(value as ZugangsberechtigungUnterlagen)) {
        return value as ZugangsberechtigungUnterlagen;
    }

    throw new Error(`unerwarteter Wert ${value} - kann nicht auf ZugangsberechtigungUnterlagen gemapped werden`);
}

export function mapDto(dto: WettbewerbsdurchfuehrenderDto): Wettbewerbsdurchfuehrender {
    return {
        newsletter: dto.newsletter,
        teilnahmenummern: dto.teilnahmenummern,
        durchfuehrungsart: mapToDurchfuehrungsart(dto.durchfuehrungsart),
        zugangsberechtigungUnterlagen: mapToZugangsberechtigungUnterlagen(dto.zugangsberechtigungUnterlagen),
    };
}
