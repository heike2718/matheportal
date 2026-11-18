import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';
import { Auswertungsart, AUSWERUNGSART, Teilnahme } from '../../model/teilnahme.model';
import { DURCHFUEHRUNGSART } from '../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { SchulteilnahmeHttpService } from './schulteilnahme-http.service';

describe('SchulteilnahmeHttpService', () => {
    const teilnahme: Teilnahme = {
        angemeldetAm: '27.02.2027',
        anzahlKinder: 56,
        anzahlKlassen: 0,
        anzahlLoesungszettel: 14,
        auswertungsart: 'ONLINE',
        durchfuehrungsart: DURCHFUEHRUNGSART.privat,
        jahr: 2027,
        kuerzel: 'S1234567',
    };

    it('schuleAnmelden ruft den vereinbarten Pfad mit POST und Auswertungsart auf', () => {
        const schulkuerzel = 'S1234567';
        const auswertungsart: Auswertungsart = AUSWERUNGSART.online;
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/schulen/S1234567/aktuelle-teilnahme';

        const httpClientMock = {
            post: vi.fn().mockReturnValue(of(teilnahme)),
        };

        TestBed.configureTestingModule({
            providers: [
                SchulteilnahmeHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(SchulteilnahmeHttpService);

        const subscription = service.schuleAnmelden(schulkuerzel, auswertungsart).subscribe();

        try {
            expect(httpClientMock.post).toHaveBeenCalledExactlyOnceWith(
                apiUrl + expectedPath,
                null,
                expect.objectContaining({
                    params: expect.any(HttpParams),
                    context: expect.any(HttpContext),
                    withCredentials: true,
                })
            );

            const options = httpClientMock.post.mock.calls[0][2];

            expect(options.params.get('auswertungsart')).toBe(auswertungsart);
            expect(options.context.get(ERROR_MESSAGE_HANDLED_LOCALLY)).toBe(true);
        } finally {
            subscription.unsubscribe();
        }
    });

    it('loadAktuelleSchulteilnahme ruft den vereinbarten Pfad mit GET auf', () => {
        const schulkuerzel = 'S1234567';
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/schulen/S1234567/aktuelle-teilnahme';

        const httpClientMock = {
            get: vi.fn().mockReturnValue(of(teilnahme)),
        };

        TestBed.configureTestingModule({
            providers: [
                SchulteilnahmeHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(SchulteilnahmeHttpService);

        const subscription = service.loadAktuelleSchulteilnahme(schulkuerzel).subscribe();

        try {
            expect(httpClientMock.get).toHaveBeenCalledExactlyOnceWith(
                apiUrl + expectedPath,
                expect.objectContaining({
                    context: expect.any(HttpContext),
                    withCredentials: true,
                })
            );

            const options = httpClientMock.get.mock.calls[0][1];

            expect(options.context.get(ERROR_MESSAGE_HANDLED_LOCALLY)).toBe(true);
        } finally {
            subscription.unsubscribe();
        }
    });

    it('loadAnmeldendePerson ruft den vereinbarten Pfad mit GET auf', () => {
        const schulkuerzel = 'S1234567';
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/schulen/S1234567/aktuelle-teilnahme/anmeldende-person';

        const httpClientMock = {
            get: vi.fn().mockReturnValue(of(teilnahme)),
        };

        TestBed.configureTestingModule({
            providers: [
                SchulteilnahmeHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(SchulteilnahmeHttpService);

        const subscription = service.loadAnmeldendePerson(schulkuerzel).subscribe();

        try {
            expect(httpClientMock.get).toHaveBeenCalledExactlyOnceWith(
                apiUrl + expectedPath,
                expect.objectContaining({
                    context: expect.any(HttpContext),
                    withCredentials: true,
                })
            );

            const options = httpClientMock.get.mock.calls[0][1];

            expect(options.context.get(ERROR_MESSAGE_HANDLED_LOCALLY)).toBe(true);
        } finally {
            subscription.unsubscribe();
        }
    });
});
