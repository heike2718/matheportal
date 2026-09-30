import { Ort, Schule } from '../../../core/model/schulkatalog.model';
import { LehrpersonActions } from './lehrperson.actions';

describe('LehrpersonActions', () => {
    it('should create the wettbewerbsorganisationGestartet action', () => {
        const ort: Ort = {
            name: 'Ort 1',
            kuerzel: 'O-1',
            land: {
                kuerzel: 'DE-HE',
                name: 'Hessen',
                anzahlOrte: 8,
            },
            anzahlSchulen: 2,
        };

        const schule: Schule = {
            kuerzel: 'S-1',
            name: 'Erste Schule',
            ort,
        };

        const action = LehrpersonActions.wettbewerbsorganisationGestartet({ schule });
        expect(action).toEqual({
            type: '[MKA Lehrperson] wettbewerbsorganisationGestartet',
            schule,
        });
    });
});
