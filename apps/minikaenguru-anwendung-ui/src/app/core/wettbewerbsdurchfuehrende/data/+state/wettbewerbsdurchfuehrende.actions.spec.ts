import {
    DURCHFUEHRUNGSART,
    Wettbewerbsdurchfuehrender,
    WettbewerbsdurchfuehrenderRequest,
    ZUGANGSBERECHTIGUNG_UNTERLAGEN,
} from '../../model/wettbewerbsdurchfuehrende.model';
import { wettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';

describe('wettbewerbsdurchfuehrendeActions', () => {
    it('should create the durchfuehrungsartPrivatGewaehlt action', () => {
        const action = wettbewerbsdurchfuehrendeActions.durchfuehrungsartPrivatGewaehlt();

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrungsartPrivatGewaehlt',
        });
    });
    it('should create the durchfuehrungsartSchuleGewaehlt action', () => {
        const action = wettbewerbsdurchfuehrendeActions.durchfuehrungsartSchuleGewaehlt();

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrungsartSchuleGewaehlt',
        });
    });
    it('should create the durchfuehrendenAnlegen action', () => {
        const requestDto: WettbewerbsdurchfuehrenderRequest = {
            durchfuehrungsart: DURCHFUEHRUNGSART.schule,
            schulkuerzel: 'A1234567',
        };

        const action = wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto });

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrendenAnlegen',
            requestDto,
        });
    });
    it('should create durchfuehrenderAngelegt action', () => {
        const wettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender = {
            durchfuehrungsart: DURCHFUEHRUNGSART.schule,
            newsletter: false,
            zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
        };

        const action = wettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({
            wettbewerbsdurchfuehrender: wettbewerbsdurchfuehrender,
        });

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrenderAngelegt',
            wettbewerbsdurchfuehrender,
        });
    });

    it('should create the durchfuehrendenAnlegenFailed action', () => {
        const error = new Error('schlimm');

        const action = wettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrendenAnlegenFailed',
            error,
        });
    });

    it('should create the durchfuehrendenLaden action', () => {
        const action = wettbewerbsdurchfuehrendeActions.durchfuehrendenLaden();

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrendenLaden',
        });
    });
    it('should create durchfuehrenderGeladen action', () => {
        const wettbewerbsdurchfuehrender: Wettbewerbsdurchfuehrender = {
            durchfuehrungsart: DURCHFUEHRUNGSART.schule,
            newsletter: false,
            zugangsberechtigungUnterlagen: ZUGANGSBERECHTIGUNG_UNTERLAGEN.standard,
        };

        const action = wettbewerbsdurchfuehrendeActions.durchfuehrenderGeladen({
            wettbewerbsdurchfuehrender: wettbewerbsdurchfuehrender,
        });

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrenderGeladen',
            wettbewerbsdurchfuehrender,
        });
    });

    it('should create the durchfuehrendenLadenFailed action', () => {
        const error = new Error('schlimm');

        const action = wettbewerbsdurchfuehrendeActions.durchfuehrendenLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrendenLadenFailed',
            error,
        });
    });
});
