import { Teilnahme } from '../../model/teilnahme.model';
import { TeilnahmeActions } from './teilnahme.actions';

describe('TeilnahmeActions', () => {
    it('should create the ensurePrivatteilnahmeLoaded action', () => {
        const action = TeilnahmeActions.ensurePrivatteilnahmeLoaded();

        expect(action).toEqual({
            type: '[MKA Teilnahme] ensurePrivatteilnahmeLoaded',
        });
    });

    it('should create the ensureSchulteilnahmeLoaded action', () => {
        const action = TeilnahmeActions.ensureSchulteilnahmeLoaded({ schulkuerzel: 'S1234567' });

        expect(action).toEqual({
            type: '[MKA Teilnahme] ensureSchulteilnahmeLoaded',
            schulkuerzel: 'S1234567',
        });
    });

    it('should create the privatteilnahmeLaden action', () => {
        const action = TeilnahmeActions.privatteilnahmeLaden();

        expect(action).toEqual({
            type: '[MKA Teilnahme] privatteilnahmeLaden',
        });
    });

    it('should create the schulteilnahmeLaden action', () => {
        const action = TeilnahmeActions.schulteilnahmeLaden({ schulkuerzel: 'S1234567' });

        expect(action).toEqual({
            type: '[MKA Teilnahme] schulteilnahmeLaden',
            schulkuerzel: 'S1234567',
        });
    });

    it('should create the teilnahmeGeladen action', () => {
        const teilnahme: Teilnahme = {
            angemeldetAm: '02.04.2026',
            anzahlKinder: 3,
            anzahlKlassen: 0,
            anzahlLoesungszettel: 2,
            auswertungsart: 'ONLINE',
            durchfuehrungsart: 'PRIVAT',
            jahr: 2026,
            kuerzel: 'P123456789',
        };

        const action = TeilnahmeActions.teilnahmeGeladen({ teilnahme });

        expect(action).toEqual({
            type: '[MKA Teilnahme] teilnahmeGeladen',
            teilnahme,
        });
    });

    it('should create the teilnahmeLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = TeilnahmeActions.teilnahmeLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Teilnahme] teilnahmeLadenFailed',
            error,
        });
    });

    it('should create the privatteilnahmeAnmelden action', () => {
        const action = TeilnahmeActions.privatteilnahmeAnmelden();

        expect(action).toEqual({
            type: '[MKA Teilnahme] privatteilnahmeAnmelden',
        });
    });

    it('should create the schulteilnahmeAnmelden action', () => {
        const action = TeilnahmeActions.schulteilnahmeAnmelden({ schulkuerzel: 'S1234567' });

        expect(action).toEqual({
            type: '[MKA Teilnahme] schulteilnahmeAnmelden',
            schulkuerzel: 'S1234567',
        });
    });

    it('should create the teilnahmeAngemeldet action', () => {
        const teilnahme: Teilnahme = {
            angemeldetAm: '02.04.2026',
            anzahlKinder: 3,
            anzahlKlassen: 0,
            anzahlLoesungszettel: 2,
            auswertungsart: 'ONLINE',
            durchfuehrungsart: 'PRIVAT',
            jahr: 2026,
            kuerzel: 'P123456789',
        };

        const action = TeilnahmeActions.teilnahmeAngemeldet({ teilnahme });

        expect(action).toEqual({
            type: '[MKA Teilnahme] teilnahmeAngemeldet',
            teilnahme,
        });
    });

    it('should create the teilnahmeAnmeldenFailed action', () => {
        const error = new Error('uiuiui');
        const action = TeilnahmeActions.teilnahmeAnmeldenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Teilnahme] teilnahmeAnmeldenFailed',
            error,
        });
    });
});
