import { HttpErrorResponse } from '@angular/common/http';
import { Teilnahme } from '../../../model/teilnahme.model';
import { DURCHFUEHRUNGSART } from '../../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { Klasse } from '../../model/klasse.model';

export function createSchulteilnahmeEffectsTestdaten() {
    const teilnahme: Teilnahme = {
        angemeldetAm: '27.02.2027',
        anzahlKinder: 56,
        anzahlKlassen: 2,
        anzahlLoesungszettel: 14,
        auswertungsart: 'ONLINE',
        durchfuehrungsart: DURCHFUEHRUNGSART.schule,
        jahr: 2027,
        kuerzel: 'S1234567',
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

    return {
        teilnahme,
        klassen,
        klassenAndereSchule,
        fehler,
    };
}
