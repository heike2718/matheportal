import { AuswertungsartDialogData, AUSWERUNGSART } from '../../../teilnahme/model/teilnahme.model';
import { getAktuelleAuswertungsart, getShowOfflineSection, getShowOnlineSection } from './auswertungsart-dialog.utils';

describe('auswertungsart-dialog utils', () => {
    const data: AuswertungsartDialogData = {
        auswertungsart: undefined,
        loesungszettelVorhanden: false,
        schulkuerzel: 'S1234567',
    };

    describe('getAktuelleAuswertungsart', () => {
        it('should return empty string when undefined', () => {
            const result = getAktuelleAuswertungsart(data);

            expect(result).toBe('');
        });

        it('should return Online string when online', () => {
            const result = getAktuelleAuswertungsart({ ...data, auswertungsart: AUSWERUNGSART.online });

            expect(result).toBe('Online');
        });

        it('should return Offline string when offline', () => {
            const result = getAktuelleAuswertungsart({ ...data, auswertungsart: AUSWERUNGSART.offline });

            expect(result).toBe('Offline');
        });
    });

    describe('getShowOnlineSection', () => {
        it('should return true when auswertungsart is undedined', () => {
            const result = getShowOnlineSection(data);
            expect(result).toBe(true);
        });

        it('should return true when auswertungsart is offline and loesungszettelVorhanden false', () => {
            const result = getShowOnlineSection({ ...data, auswertungsart: AUSWERUNGSART.offline });
            expect(result).toBe(true);
        });

        it('should return false when auswertungsart is offline and loesungszettelVorhanden true', () => {
            const result = getShowOnlineSection({
                ...data,
                auswertungsart: AUSWERUNGSART.offline,
                loesungszettelVorhanden: true,
            });
            expect(result).toBe(false);
        });

        it('should return false when auswertungsart is online and loesungszettelVorhanden false', () => {
            const result = getShowOnlineSection({
                ...data,
                auswertungsart: AUSWERUNGSART.online,
                loesungszettelVorhanden: false,
            });
            expect(result).toBe(false);
        });

        it('should return false when auswertungsart is online and loesungszettelVorhanden true', () => {
            const result = getShowOnlineSection({
                ...data,
                auswertungsart: AUSWERUNGSART.online,
                loesungszettelVorhanden: true,
            });
            expect(result).toBe(false);
        });
    });

    describe('getShowOfflineSection', () => {
        it('should return true when auswertungsart is undefined', () => {
            const result = getShowOfflineSection(data);
            expect(result).toBe(true);
        });

        it('should return true when auswertungsart is online and loesungszettelVorhanden false', () => {
            const result = getShowOfflineSection({ ...data, auswertungsart: AUSWERUNGSART.online });
            expect(result).toBe(true);
        });

        it('should return true when auswertungsart is online and loesungszettelVorhanden true', () => {
            const result = getShowOfflineSection({
                ...data,
                auswertungsart: AUSWERUNGSART.online,
                loesungszettelVorhanden: true,
            });
            expect(result).toBe(true);
        });

        it('should return false when auswertungsart is offline', () => {
            const result = getShowOfflineSection({ ...data, auswertungsart: AUSWERUNGSART.offline });
            expect(result).toBe(false);
        });
    });
});
