import {
    DURCHFUEHRUNGSART,
    Durchfuehrungsart,
    Wettbewerbsdurchfuehrender,
    WettbewerbsdurchfuehrenderDto,
    ZUGANGSBERECHTIGUNG_UNTERLAGEN,
    ZugangsberechtigungUnterlagen,
} from '../model/wettbewerbsdurchfuehrende.model';

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
