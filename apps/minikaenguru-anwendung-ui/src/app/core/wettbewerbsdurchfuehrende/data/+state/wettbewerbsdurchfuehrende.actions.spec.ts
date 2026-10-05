import {
    DURCHFUEHRUNGSART,
    Wettbewerbsdurchfuehrender,
    WettbewerbsdurchfuehrenderRequest,
    ZUGANGSBERECHTIGUNG_UNTERLAGEN,
} from '../../model/wettbewerbsdurchfuehrende.model';
import { WettbewerbsdurchfuehrendeActions } from './wettbewerbsdurchfuehrende.actions';

describe('WettbewerbsdurchfuehrendeActions', () => {
    it('should create the durchfuehrungsartPrivatGewaehlt action', () => {
        const action = WettbewerbsdurchfuehrendeActions.durchfuehrungsartPrivatGewaehlt();

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrungsartPrivatGewaehlt',
        });
    });
    it('should create the durchfuehrungsartSchuleGewaehlt action', () => {
        const action = WettbewerbsdurchfuehrendeActions.durchfuehrungsartSchuleGewaehlt();

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrungsartSchuleGewaehlt',
        });
    });
    it('should create the durchfuehrendenAnlegen action', () => {
        const requestDto: WettbewerbsdurchfuehrenderRequest = {
            durchfuehrungsart: DURCHFUEHRUNGSART.schule,
            schulkuerzel: 'A1234567',
        };

        const action = WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegen({ requestDto });

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

        const action = WettbewerbsdurchfuehrendeActions.durchfuehrenderAngelegt({
            wettbewerbsdurchfuehrender: wettbewerbsdurchfuehrender,
        });

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrenderAngelegt',
            wettbewerbsdurchfuehrender,
        });
    });

    it('should create the durchfuehrendenAnlegenFailed action', () => {
        const error = new Error('schlimm');

        const action = WettbewerbsdurchfuehrendeActions.durchfuehrendenAnlegenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrendenAnlegenFailed',
            error,
        });
    });

    it('should create the durchfuehrendenLaden action', () => {
        const action = WettbewerbsdurchfuehrendeActions.durchfuehrendenLaden();

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

        const action = WettbewerbsdurchfuehrendeActions.durchfuehrenderGeladen({
            wettbewerbsdurchfuehrender: wettbewerbsdurchfuehrender,
        });

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrenderGeladen',
            wettbewerbsdurchfuehrender,
        });
    });

    it('should create the durchfuehrendenLadenFailed action', () => {
        const error = new Error('schlimm');

        const action = WettbewerbsdurchfuehrendeActions.durchfuehrendenLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Wettbewerbsdurchfuehrende] durchfuehrendenLadenFailed',
            error,
        });
    });
});
