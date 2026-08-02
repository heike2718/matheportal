import { UserWithBerechtigungen } from '@matheportal/auth-model';
import { MinikaenguruBerechtigungstyp, MINIKAENGURU_BERECHTIGUNGSTYP } from '../authorization-model';
import {
    DURCHFUEHRUNGSART,
    WettbewerbsdurchfuehrenderDto,
} from '../../wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';

export function resolveBerechtigungstyp(user: UserWithBerechtigungen | null): MinikaenguruBerechtigungstyp {
    if (user === null || user.berechtigungen.length === 0) {
        return MINIKAENGURU_BERECHTIGUNGSTYP.none;
    }

    const berechtigungPrivat: string[] = user.berechtigungen.filter(b => b === 'PRIVAT');
    if (berechtigungPrivat.length > 0) {
        return MINIKAENGURU_BERECHTIGUNGSTYP.privat;
    }

    const berechtigungLehrer: string[] = user.berechtigungen.filter(b => b === 'SCHULE');
    if (berechtigungLehrer.length > 0) {
        return MINIKAENGURU_BERECHTIGUNGSTYP.schule;
    }

    return MINIKAENGURU_BERECHTIGUNGSTYP.none;
}

export function mapToBerechtigungstyp(dto: WettbewerbsdurchfuehrenderDto): MinikaenguruBerechtigungstyp {
    if (dto.durchfuehrungsart === DURCHFUEHRUNGSART.privat) {
        return MINIKAENGURU_BERECHTIGUNGSTYP.privat;
    }
    if (dto.durchfuehrungsart === DURCHFUEHRUNGSART.schule) {
        return MINIKAENGURU_BERECHTIGUNGSTYP.schule;
    }
    return MINIKAENGURU_BERECHTIGUNGSTYP.none;
}
