import { AUSWERUNGSART, Person, Teilnahme } from '../../../model/teilnahme.model';
import { SchulteilnahmeActions } from './schulteilnahme.actions';

describe('SchulteilnahmeActions', () => {
    it('should create the ensureSchulteilnahmeLoaded action', () => {
        const action = SchulteilnahmeActions.ensureSchulteilnahmeLoaded({ schulkuerzel: 'S1234567' });

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] ensureSchulteilnahmeLoaded',
            schulkuerzel: 'S1234567',
        });
    });

    it('should create the schulteilnahmeLaden action', () => {
        const action = SchulteilnahmeActions.schulteilnahmeLaden({ schulkuerzel: 'S1234567' });

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] schulteilnahmeLaden',
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
            kuerzel: 'S1234567',
        };

        const action = SchulteilnahmeActions.teilnahmeGeladen({ teilnahme });

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] teilnahmeGeladen',
            teilnahme,
        });
    });

    it('should create the teilnahmeLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = SchulteilnahmeActions.teilnahmeLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] teilnahmeLadenFailed',
            error,
        });
    });

    it('should create the schulteilnahmeAnmelden action', () => {
        const action = SchulteilnahmeActions.schulteilnahmeAnmelden({
            schulkuerzel: 'S1234567',
            auswertungsart: AUSWERUNGSART.online,
        });

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] schulteilnahmeAnmelden',
            schulkuerzel: 'S1234567',
            auswertungsart: AUSWERUNGSART.online,
        });
    });

    it('should create the teilnahmeAngemeldet action', () => {
        const teilnahme: Teilnahme = {
            angemeldetAm: '02.04.2026',
            anzahlKinder: 3,
            anzahlKlassen: 0,
            anzahlLoesungszettel: 2,
            auswertungsart: 'ONLINE',
            durchfuehrungsart: 'SCHULE',
            jahr: 2026,
            kuerzel: 'S1234567',
        };

        const action = SchulteilnahmeActions.teilnahmeAngemeldet({ teilnahme });

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] teilnahmeAngemeldet',
            teilnahme,
        });
    });

    it('should create the teilnahmeAnmeldenFailed action', () => {
        const error = new Error('uiuiui');
        const action = SchulteilnahmeActions.teilnahmeAnmeldenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] teilnahmeAnmeldenFailed',
            error,
        });
    });

    it('should create the auswertungsartWaehlen action', () => {
        const action = SchulteilnahmeActions.auswertungsartWaehlen();

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] auswertungsartWaehlen',
        });
    });

    it('should create the auswertungsartGewaehlt action', () => {
        const action = SchulteilnahmeActions.auswertungsartGewaehlt({ auswertungsart: AUSWERUNGSART.offline });

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] auswertungsartGewaehlt',
            auswertungsart: AUSWERUNGSART.offline,
        });
    });

    it('should create the auswertungsartAendern action', () => {
        const action = SchulteilnahmeActions.auswertungsartAendern({ neueAuswertungsart: AUSWERUNGSART.offline });

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] auswertungsartAendern',
            neueAuswertungsart: AUSWERUNGSART.offline,
        });
    });

    it('should create the anmeldendePersonLaden action', () => {
        const action = SchulteilnahmeActions.anmeldendePersonLaden({ schulkuerzel: 'S1234567' });

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] anmeldendePersonLaden',
            schulkuerzel: 'S1234567',
        });
    });

    it('should create the anmeldendePersonLadenFailed action', () => {
        const error = new Error('uiuiui');
        const action = SchulteilnahmeActions.anmeldendePersonLadenFailed({ error });

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] anmeldendePersonLadenFailed',
            error,
        });
    });

    it('should create the anmeldendePersonGeladen action', () => {
        const person: Person = {
            schulkuerzel: 'S1234567',
            fullName: 'Rita Reihe',
        };
        const action = SchulteilnahmeActions.anmeldendePersonGeladen({ person });

        expect(action).toEqual({
            type: '[MKA Schulteilnahme] anmeldendePersonGeladen',
            person,
        });
    });
});
