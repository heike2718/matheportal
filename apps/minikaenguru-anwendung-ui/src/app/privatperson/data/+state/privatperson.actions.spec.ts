import { PrivatpersonActions } from './privatperson.actions';

describe('PrivatpersonActions', () => {
    const privatkuerzel = 'P-1';

    it('should create the wettbewerbsorganisationGestartet action', () => {
        const action = PrivatpersonActions.wettbewerbsorganisationGestartet({
            privatkuerzel,
        });

        expect(action).toEqual({
            type: '[MKA Privatperson] wettbewerbsorganisationGestartet',
            privatkuerzel: 'P-1',
        });
    });

    it('should create the ensureWettbewerbskontextGeladen action', () => {
        const action = PrivatpersonActions.ensureWettbewerbskontextGeladen({
            privatkuerzel,
        });

        expect(action).toEqual({
            type: '[MKA Privatperson] ensureWettbewerbskontextGeladen',
            privatkuerzel: 'P-1',
        });
    });
});
