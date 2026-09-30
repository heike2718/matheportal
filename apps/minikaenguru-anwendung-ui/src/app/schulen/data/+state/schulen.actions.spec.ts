import { SchuleWettbewerbskontext, Schulkollegium } from '../../../core/model/schule-wettbewerbskontext.model';
import { Schule } from '../../../core/model/schulkatalog.model';
import { schulenActions } from './schulen.actions';

describe('schulenActions', () => {
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

    it('should create the schulenLaden action', () => {
        const action = schulenActions.schulenLaden();

        expect(action).toEqual({
            type: '[MKA Schulen] schulenLaden',
        });
    });

    it('should create the schulenGeladen action', () => {
        const schulen: Schule[] = [schule];
        const action = schulenActions.schulenGeladen({ schulen });

        expect(action).toEqual({
            type: '[MKA Schulen] schulenGeladen',
            schulen,
        });
    });

    it('should create the schulenLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = schulenActions.schulenLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Schulen] schulenLadenFailed',
            error,
        });
    });

    it('should create the wettbewerbskontextLaden action', () => {
        const action = schulenActions.wettbewerbskontextLaden({ schule });

        expect(action).toEqual({
            type: '[MKA Schulen] wettbewerbskontextLaden',
            schule,
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

        const action = schulenActions.wettbewerbskontextGeladen({ wettbewerbskontext });

        expect(action).toEqual({
            type: '[MKA Schulen] wettbewerbskontextGeladen',
            wettbewerbskontext,
        });
    });

    it('should create the wettbewerbskontextLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = schulenActions.wettbewerbskontextLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Schulen] wettbewerbskontextLadenFailed',
            error,
        });
    });

    it('should create the schulkollegiumLaden action', () => {
        const action = schulenActions.schulkollegiumLaden({ schule });

        expect(action).toEqual({
            type: '[MKA Schulen] schulkollegiumLaden',
            schule,
        });
    });

    it('should create the schulkollegiumGeladen action', () => {
        const schulkollegium: Schulkollegium = {
            kuerzel: schule.kuerzel,
            kollegium: ['Anna Johanna', 'Hermann Mann'],
        };

        const action = schulenActions.schulkollegiumGeladen({ schulkollegium });

        expect(action).toEqual({
            type: '[MKA Schulen] schulkollegiumGeladen',
            schulkollegium,
        });
    });

    it('should create the schulkollegiumLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = schulenActions.schulkollegiumLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Schulen] schulkollegiumLadenFailed',
            error,
        });
    });
});
