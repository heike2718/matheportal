import { ANMELDESTATUS } from '../../../core/model/wettbewerbskontext.model';
import { PrivatpersonWettbewerbskontext } from '../../model/privatperson.model';
import { PrivatpersonActions } from './privatperson.actions';

describe('PrivatpersonActions', () => {
    it('should create the ensureWettbewerbskontextGeladen action', () => {
        const action = PrivatpersonActions.ensureWettbewerbskontextGeladen();

        expect(action).toEqual({
            type: '[MKA Privatperson] ensureWettbewerbskontextGeladen',
        });
    });

    it('should create the wettbewerbskontextLaden action', () => {
        const action = PrivatpersonActions.wettbewerbskontextLaden();

        expect(action).toEqual({
            type: '[MKA Privatperson] wettbewerbskontextLaden',
        });
    });

    it('should create the wettbewerbskontextGeladen action', () => {
        const wettbewerbskontext: PrivatpersonWettbewerbskontext = {
            anmeldestatus: ANMELDESTATUS.moeglich,
            teilnahmerefs: [],
        };

        const action = PrivatpersonActions.wettbewerbskontextGeladen({ wettbewerbskontext });

        expect(action).toEqual({
            type: '[MKA Privatperson] wettbewerbskontextGeladen',
            wettbewerbskontext,
        });
    });

    it('should create the wettbewerbskontextLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = PrivatpersonActions.wettbewerbskontextLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Privatperson] wettbewerbskontextLadenFailed',
            error,
        });
    });

    it('should create the wettbewerbOrganisieren action', () => {
        const action = PrivatpersonActions.wettbewerbOrganisieren();

        expect(action).toEqual({
            type: '[MKA Privatperson] wettbewerbOrganisieren',
        });
    });
});
