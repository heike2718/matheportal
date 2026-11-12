import { ANMELDESTATUS } from '../../../core/model/wettbewerbskontext.model';
import { Schule } from '../../../core/model/schulkatalog.model';
import { SchuleWettbewerbskontext, Schulkollegium } from '../../model/schule.model';
import { SchuleActions } from './schule.actions';

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

    it('should create the ensureWettbewerbskontextGeladen action', () => {
        const action = SchuleActions.ensureWettbewerbskontextGeladen({ schulkuerzel: schule.kuerzel });
        expect(action).toEqual({
            type: '[MKA Schule] ensureWettbewerbskontextGeladen',
            schulkuerzel: 'S1234567',
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
            anmeldestatus: ANMELDESTATUS.moeglich,
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
            schulkuerzel: 'S1234567',
            kollegium: [
                { schulkuerzel: 'S1234567', fullName: 'Anna Johanna' },
                { schulkuerzel: 'S1234567', fullName: 'Hermann Mann' },
            ],
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

    it('should create the schuldashboardVerlassen action', () => {
        const action = SchuleActions.schuldashboardVerlassen();
        expect(action).toEqual({
            type: '[MKA Schule] schuldashboardVerlassen',
        });
    });

    it('should create the wettbewerbOrganisieren action', () => {
        const action = SchuleActions.wettbewerbOrganisieren({ schulkuerzel: schule.kuerzel });

        expect(action).toEqual({
            type: '[MKA Schule] wettbewerbOrganisieren',
            schulkuerzel: 'S1234567',
        });
    });
});
