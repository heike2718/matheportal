import { Wettbewerb, WETTBEWERBSSTATUS } from '../../model/wettbewerb.model';
import { WettbewerbActions } from './wettbewerb.actions';

describe('WettbewerbActions', () => {
    it('should create the wettbewerbLaden action', () => {
        const action = WettbewerbActions.wettbewerbLaden();

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

        const action = WettbewerbActions.wettbewerbGeladen({ wettbewerb });

        expect(action).toEqual({
            type: '[MKA Wettbewerb] wettbewerbGeladen',
            wettbewerb,
        });
    });

    it('should create the wettbewerbLadenFailed action', () => {
        const error = new Error('schlimm');

        const action = WettbewerbActions.wettbewerbLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Wettbewerb] wettbewerbLadenFailed',
            error,
        });
    });
});
