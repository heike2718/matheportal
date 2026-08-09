import {
    DURCHFUEHRUNGSART,
    WettbewerbsdurchfuehrenderDto,
    WettbewerbsdurchfuehrenderRequest,
    ZUGANGSBERECHTIGUNG_UNTERLAGEN,
} from '../../model/wettbewerbsdurchfuehrende.model';
import { wettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';

describe('wettbewerbsdurchfuehrendeActions', () => {
    it('should create the durchfuehrungsartPrivatGewaehlt action', () => {
        const action = wettbewerbsdurchfuehrendeActions.durchfuehrungsartPrivatGewaehlt();

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuerende API] durchfuehrungsartPrivatGewaehlt',
        });
    });
    it('should create the durchfuehrungsartSchuleGewaehlt action', () => {
        const action = wettbewerbsdurchfuehrendeActions.durchfuehrungsartSchuleGewaehlt();

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuerende API] durchfuehrungsartSchuleGewaehlt',
        });
    });
    it('should create the durchfuehrendenAnlegen action', () => {
        const requestDto: WettbewerbsdurchfuehrenderRequest = {
            durchfuehrungsart: 'schule',
            schulkuerzel: 'A1234567',
        };

        const action = wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto });

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuerende API] durchfuehrendenAnlegen',
            requestDto,
        });
    });
    it('should create durchfuehrenderAngelegt action', () => {
        const responseDto: WettbewerbsdurchfuehrenderDto = {
            durchfuehrungsart: DURCHFUEHRUNGSART.schule,
            newsletter: false,
            teilnahmenummern: ['A1234567'],
            zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
        };

        const action = wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({ responseDto });

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuerende API] durchfuehrenderAngelegt',
            responseDto,
        });
    });

    it('should create the durchfuehrendenAnlegenFailed action', () => {
        const error = new Error('schlimm');

        const action = wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuerende API] durchfuehrendenAnlegenFailed',
            error,
        });
    });
});
