import { Wettbewerb, WETTBEWERBSSTATUS } from '../../model/wettbewerb.model';
import { wettbewerbActions } from './wettbewerb.actions';

describe('wettbewerbActions', () => {
    it('should create the wettbewerbLaden action', () => {
        const action = wettbewerbActions.wettbewerbLaden();

        expect(action).toEqual({
            type: '[MKA Wettbewerb] wettbewerbLaden',
        });
    });

    it('should create the wettbewerbGeladen action', () => {
        const wettbewerb: Wettbewerb = {
            beginn: '01.01.2029',
            ende: '31.07.2029',
            freischaltungPrivat: '15.06.2029',
            freischaltungSchulen: '14.03.2029',
            jahr: 2029,
            status: WETTBEWERBSSTATUS.anmeldung,
        };

        const action = wettbewerbActions.wettbewerbGeladen({ wettbewerb });

        expect(action).toEqual({
            type: '[MKA Wettbewerb] wettbewerbGeladen',
            wettbewerb,
        });
    });

    it('should create the wettbewerbLadenFailed action', () => {
        const error = new Error('schlimm');

        const action = wettbewerbActions.wettbewerbLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Wettbewerb] wettbewerbLadenFailed',
            error,
        });
    });
});
