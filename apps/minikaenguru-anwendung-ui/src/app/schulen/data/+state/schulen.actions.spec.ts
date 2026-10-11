import { SchuleWettbewerbskontext, Schulkollegium } from '../../../core/model/schule-wettbewerbskontext.model';
import { Schule } from '../../../core/model/schulkatalog.model';
import { SchuleActions } from './schulen.actions';

describe('SchuleActions', () => {
    const schule: Schule = {
        kuerzel: 'S1234567',
        name: 'Baumschule',
        ort: {
            kuerzel: 'O1234567',
            name: 'Waldeck',
            anzahlSchulen: 3,
            land: {
                kuerzel: 'DE-TH',
                name: 'Thüringen',
                anzahlOrte: 354,
            },
        },
    };

    it('should create the ensureSchulenGeladen action', () => {
        const action = SchuleActions.ensureSchulenGeladen();

        expect(action).toEqual({
            type: '[MKA Schule] ensureSchulenGeladen',
        });
    });

    it('should create the schulenLaden action', () => {
        const action = SchuleActions.schulenLaden();

        expect(action).toEqual({
            type: '[MKA Schule] schulenLaden',
        });
    });

    it('should create the schulenGeladen action', () => {
        const schulen: Schule[] = [schule];
        const action = SchuleActions.schulenGeladen({ schulen });

        expect(action).toEqual({
            type: '[MKA Schule] schulenGeladen',
            schulen,
        });
    });

    it('should create the schulenLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = SchuleActions.schulenLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Schule] schulenLadenFailed',
            error,
        });
    });

    it('should create the wettbewerbskontextLaden action', () => {
        const action = SchuleActions.wettbewerbskontextLaden({ schulkuerzel: schule.kuerzel });

        expect(action).toEqual({
            type: '[MKA Schule] wettbewerbskontextLaden',
            schulkuerzel: 'S1234567',
        });
    });

    it('should create the wettbewerbskontextGeladen action', () => {
        const wettbewerbskontext: SchuleWettbewerbskontext = {
            schule,
            anmeldungMoeglich: true,
            kollegen: [],
            teilnahmerefs: [],
            vertragDSGVOVorhanden: false,
        };

        const action = SchuleActions.wettbewerbskontextGeladen({ wettbewerbskontext });

        expect(action).toEqual({
            type: '[MKA Schule] wettbewerbskontextGeladen',
            wettbewerbskontext,
        });
    });

    it('should create the wettbewerbskontextLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = SchuleActions.wettbewerbskontextLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Schule] wettbewerbskontextLadenFailed',
            error,
        });
    });

    it('should create the schulkollegiumLaden action', () => {
        const action = SchuleActions.schulkollegiumLaden({ schule });

        expect(action).toEqual({
            type: '[MKA Schule] schulkollegiumLaden',
            schule,
        });
    });

    it('should create the schulkollegiumGeladen action', () => {
        const schulkollegium: Schulkollegium = {
            kuerzel: schule.kuerzel,
            kollegium: ['Anna Johanna', 'Hermann Mann'],
        };

        const action = SchuleActions.schulkollegiumGeladen({ schulkollegium });

        expect(action).toEqual({
            type: '[MKA Schule] schulkollegiumGeladen',
            schulkollegium,
        });
    });

    it('should create the schulkollegiumLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = SchuleActions.schulkollegiumLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Schule] schulkollegiumLadenFailed',
            error,
        });
    });
});
