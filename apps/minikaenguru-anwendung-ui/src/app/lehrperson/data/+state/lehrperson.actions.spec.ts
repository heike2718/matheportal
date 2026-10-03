import { Schule } from '../../../core/model/schulkatalog.model';
import { LehrpersonActions } from './lehrperson.actions';

describe('LehrpersonActions', () => {
    const schule: Schule = {
        kuerzel: 'S-1',
        name: 'Erste Schule',
        ort: {
            name: 'Ort 1',
            kuerzel: 'O-1',
            land: {
                kuerzel: 'DE-HE',
                name: 'Hessen',
                anzahlOrte: 8,
            },
            anzahlSchulen: 2,
        },
    };
    it('should create the wettbewerbsorganisationGestartet action', () => {
        const action = LehrpersonActions.wettbewerbsorganisationGestartet({ schulkuerzel: schule.kuerzel });
        expect(action).toEqual({
            type: '[MKA Lehrperson] wettbewerbsorganisationGestartet',
            schulkuerzel: 'S-1',
        });
    });
    it('should create the prepareWettbewerbsorganisation action', () => {
        const action = LehrpersonActions.prepareWettbewerbsorganisation({ schulkuerzel: schule.kuerzel });
        expect(action).toEqual({
            type: '[MKA Lehrperson] prepareWettbewerbsorganisation',
            schulkuerzel: 'S-1',
        });
    });
    it('should create the wettbewerbsorganisationVerlassen action', () => {
        const action = LehrpersonActions.wettbewerbsorganisationVerlassen();
        expect(action).toEqual({
            type: '[MKA Lehrperson] wettbewerbsorganisationVerlassen',
        });
    });
});
