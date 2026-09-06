import {
    DURCHFUEHRUNGSART,
    WettbewerbsdurchfuehrenderDraft,
    ZUGANGSBERECHTIGUNG_UNTERLAGEN,
} from '../../wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { MINIKAENGURU_BERECHTIGUNGSTYP } from '../authorization-model/mka-authorization.model';
import { mapDtoToBerechtigungstyp, resolveBerechtigungstyp } from './mka-authorization.utils';

describe('mka-authorization utils tests', () => {
    describe('resolveVeranstaltertyp', () => {
        it('should return none when null', () => {
            const result = resolveBerechtigungstyp(null);

            expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.none);
        });
        it('should return none when berechtigungen empty', () => {
            const result = resolveBerechtigungstyp({ berechtigungen: [] });

            expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.none);
        });
        it('should return none when standard', () => {
            const result = resolveBerechtigungstyp({ berechtigungen: ['STANDARD', 'AUTOR'] });

            expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.none);
        });
        it('should return privat when Privatveranstalter', () => {
            const result = resolveBerechtigungstyp({ berechtigungen: ['STANDARD', 'PRIVAT'] });

            expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.privat);
        });
        it('should return schule when Schule', () => {
            const result = resolveBerechtigungstyp({ berechtigungen: ['STANDARD', 'SCHULE'] });

            expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.schule);
        });
    });
    describe('mapToBerechtigungstyp tests', () => {
        it('should return privat when privat', () => {
            const dto: WettbewerbsdurchfuehrenderDraft = {
                durchfuehrungsart: DURCHFUEHRUNGSART.privat,
                newsletter: false,
                teilnahmenummern: [],
                zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.entzogen,
            };

            const result = mapDtoToBerechtigungstyp(dto);

            expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.privat);
        });

        it('should return schule when schule', () => {
            const draft: WettbewerbsdurchfuehrenderDraft = {
                durchfuehrungsart: DURCHFUEHRUNGSART.schule,
                newsletter: false,
                teilnahmenummern: [],
                zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.erteilt,
            };

            const result = mapDtoToBerechtigungstyp(draft);

            expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.schule);
        });

        it('should return none when not privat and not schule', () => {
            const dto: WettbewerbsdurchfuehrenderDraft = {
                durchfuehrungsart: undefined,
                newsletter: false,
                teilnahmenummern: [],
                zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.entzogen,
            };

            const result = mapDtoToBerechtigungstyp(dto);

            expect(result).toBe(MINIKAENGURU_BERECHTIGUNGSTYP.none);
        });
    });
});
