import { HttpErrorResponse } from '@angular/common/http';
import { AUTHORIZED_RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import { Person, Teilnahme } from '../../../model/teilnahme.model';
import { Klasse } from '../../model/klasse.model';

interface Fehlerfall {
    readonly name: string;
    readonly error: Error;
    readonly loadState: AUTHORIZED_RESOURCE_LOAD_STATE;
}

export function createSchulteilnahmeTestdaten() {
    const teilnahme: Teilnahme = {
        angemeldetAm: '02.04.2026',
        anzahlKinder: 3,
        anzahlKlassen: 1,
        anzahlLoesungszettel: 2,
        auswertungsart: 'ONLINE',
        durchfuehrungsart: 'SCHULE',
        jahr: 2026,
        kuerzel: 'S1234567',
    };

    const person: Person = {
        schulkuerzel: 'S1234567',
        fullName: 'Rita Reihe',
    };

    const fremdePerson: Person = {
        schulkuerzel: '7654321S',
        fullName: 'Leo Lemma',
    };

    const klassen: Klasse[] = [
        {
            name: 'Fuchsklasse',
            schulkuerzel: 'S1234567',
            uuid: 'abcdef',
        },
        {
            name: 'Tuxklasse',
            schulkuerzel: 'S1234567',
            uuid: '123456',
        },
    ];

    const klassenAndereSchule: Klasse[] = [
        {
            name: 'Kastanienklasse',
            schulkuerzel: '7654321S',
            uuid: '987654',
        },
    ];

    const fehlerfaelle: Fehlerfall[] = [
        {
            name: 'unauthorized',
            error: new HttpErrorResponse({
                status: 401,
                statusText: 'unauthorized',
                error: 'boom',
                url: '/schulen/',
            }),
            loadState: 'unauthorized',
        },
        {
            name: 'forbidden',
            error: new HttpErrorResponse({
                status: 403,
                statusText: 'forbidden',
                error: 'boom',
                url: '/schulen/',
            }),
            loadState: 'forbidden',
        },
        {
            name: 'not-found',
            error: new HttpErrorResponse({
                status: 404,
                statusText: 'Not Found',
                error: 'boom',
                url: '/schulen/',
            }),
            loadState: 'not-found',
        },
        {
            name: 'technical-error',
            error: new HttpErrorResponse({
                status: 500,
                statusText: 'Internal Server Error',
                error: 'boom',
                url: '/schulen/',
            }),
            loadState: 'technical-error',
        },
        {
            name: 'unexpected error',
            error: new Error('uiuiui'),
            loadState: 'technical-error',
        },
    ];

    return { teilnahme, person, fremdePerson, klassen, klassenAndereSchule, fehlerfaelle };
}
