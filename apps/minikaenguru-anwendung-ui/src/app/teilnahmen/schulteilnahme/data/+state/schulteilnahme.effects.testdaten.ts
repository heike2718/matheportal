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

    const notFoundResponse = new HttpErrorResponse({
        status: 404,
        statusText: 'NotFound',
        error: 'boom',
        url: '/teilnahme',
    });

    const forbiddenResponse = new HttpErrorResponse({
        status: 403,
        statusText: 'forbidden',
        error: 'boom',
        url: '/teilnahme',
    });

    const httpServerErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'boom',
        url: '/teilnahme',
    });

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

    return { teilnahme, klassen, klassenAndereSchule, notFoundResponse, forbiddenResponse, httpServerErrorResponse };
}
