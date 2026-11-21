import { HttpErrorResponse } from '@angular/common/http';
import { Person, Teilnahme } from '../../../model/teilnahme.model';
import { Klasse } from '../../model/klasse.model';

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

    const neueKlasse: Klasse = {
        name: 'Luchsklasse',
        schulkuerzel: 'S1234567',
        uuid: 'eeeeee',
    };

    const neueKlasseAndereSchule: Klasse = {
        name: 'Lindenklasse',
        schulkuerzel: '7654321S',
        uuid: 'ffffff',
    };

    const fehler = {
        http400: new HttpErrorResponse({
            status: 400,
            statusText: 'Bad Request',
            error: 'boom',
            url: '/schulen/',
        }),
        http401: new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
            error: 'boom',
            url: '/schulen/',
        }),
        http403: new HttpErrorResponse({
            status: 403,
            statusText: 'Forbidden',
            error: 'boom',
            url: '/schulen/',
        }),
        http404: new HttpErrorResponse({
            status: 404,
            statusText: 'Not Found',
            error: 'boom',
            url: '/schulen/',
        }),
        http409: new HttpErrorResponse({
            status: 409,
            statusText: 'Conflict',
            error: 'boom',
            url: '/schulen/',
        }),
        http500: new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
            error: 'boom',
            url: '/schulen/',
        }),
        unexpected: new Error('uiuiui'),
    };

    return {
        teilnahme,
        person,
        fremdePerson,
        klassen,
        klassenAndereSchule,
        neueKlasse,
        neueKlasseAndereSchule,
        fehler,
    };
}
