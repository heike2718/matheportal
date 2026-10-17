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

    it('should create the ensureSchulenGeladen action', () => {
        const action = LehrpersonActions.ensureSchulenGeladen();

        expect(action).toEqual({
            type: '[MKA Lehrperson] ensureSchulenGeladen',
        });
    });

    it('should create the schulenLaden action', () => {
        const action = LehrpersonActions.schulenLaden();

        expect(action).toEqual({
            type: '[MKA Lehrperson] schulenLaden',
        });
    });

    it('should create the schulenGeladen action', () => {
        const schulen: Schule[] = [schule];
        const action = LehrpersonActions.schulenGeladen({ schulen });

        expect(action).toEqual({
            type: '[MKA Lehrperson] schulenGeladen',
            schulen,
        });
    });

    it('should create the schulenLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = LehrpersonActions.schulenLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Lehrperson] schulenLadenFailed',
            error,
        });
    });

    it('should create the berechtigungVerweigert action', () => {
        const action = LehrpersonActions.berechtigungVerweigert();

        expect(action).toEqual({
            type: '[MKA Lehrperson] berechtigungVerweigert',
        });
    });
});
