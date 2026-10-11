import { PrivatpersonWettbewerbskontext } from '../../model/privatperson.model';
import { PrivatpersonActions } from './privatperson.actions';

describe('PrivatpersonActions', () => {
    it('should create the wettbewerbsorganisationGestartet action', () => {
        const action = PrivatpersonActions.wettbewerbsorganisationGestartet();

        expect(action).toEqual({
            type: '[MKA Privatperson] wettbewerbsorganisationGestartet',
        });
    });

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
            anmeldungMoeglich: true,
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
});
