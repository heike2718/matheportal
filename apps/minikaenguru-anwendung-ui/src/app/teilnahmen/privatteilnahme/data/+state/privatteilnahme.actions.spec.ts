import { Teilnahme } from '../../../model/teilnahme.model';
import { PrivatteilnahmeActions } from './privatteilnahme.actions';

describe('PrivatteilnahmeActions', () => {
    it('should create the ensurePrivatteilnahmeGeladen action', () => {
        const action = PrivatteilnahmeActions.ensurePrivatteilnahmeGeladen();

        expect(action).toEqual({
            type: '[MKA Privatteilnahme] ensurePrivatteilnahmeGeladen',
        });
    });

    it('should create the privatteilnahmeLaden action', () => {
        const action = PrivatteilnahmeActions.privatteilnahmeLaden();

        expect(action).toEqual({
            type: '[MKA Privatteilnahme] privatteilnahmeLaden',
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

        const action = PrivatteilnahmeActions.teilnahmeGeladen({ teilnahme });

        expect(action).toEqual({
            type: '[MKA Privatteilnahme] teilnahmeGeladen',
            teilnahme,
        });
    });

    it('should create the teilnahmeLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = PrivatteilnahmeActions.teilnahmeLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Privatteilnahme] teilnahmeLadenFailed',
            error,
        });
    });

    it('should create the privatteilnahmeAnmelden action', () => {
        const action = PrivatteilnahmeActions.privatteilnahmeAnmelden();

        expect(action).toEqual({
            type: '[MKA Privatteilnahme] privatteilnahmeAnmelden',
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

        const action = PrivatteilnahmeActions.teilnahmeAngemeldet({ teilnahme });

        expect(action).toEqual({
            type: '[MKA Privatteilnahme] teilnahmeAngemeldet',
            teilnahme,
        });
    });

    it('should create the teilnahmeAnmeldenFailed action', () => {
        const error = new Error('uiuiui');
        const action = PrivatteilnahmeActions.teilnahmeAnmeldenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Privatteilnahme] teilnahmeAnmeldenFailed',
            error,
        });
    });
});
