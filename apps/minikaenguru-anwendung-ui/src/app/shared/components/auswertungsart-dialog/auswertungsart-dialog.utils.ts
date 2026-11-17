import { AuswertungsartDialogData, AUSWERUNGSART } from '../../../teilnahme/model/teilnahme.model';

export function getAktuelleAuswertungsart(data: AuswertungsartDialogData): string {
    if (data.auswertungsart === undefined) {
        return '';
    }
    switch (data.auswertungsart) {
        case AUSWERUNGSART.offline:
            return 'Offline';
        case AUSWERUNGSART.online:
            return 'Online';
    }
}

export function getShowOnlineSection(data: AuswertungsartDialogData): boolean {
    if (data.auswertungsart === undefined) {
        return true;
    }

    if (data.auswertungsart === AUSWERUNGSART.offline && !data.loesungszettelVorhanden) {
        return true;
    }

    return false;
}

export function getShowOfflineSection(data: AuswertungsartDialogData): boolean {
    if (data.auswertungsart === undefined) {
        return true;
    }

    return data.auswertungsart === AUSWERUNGSART.online;
}
