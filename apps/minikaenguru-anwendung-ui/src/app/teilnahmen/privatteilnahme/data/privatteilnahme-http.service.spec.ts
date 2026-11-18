import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';
import { Teilnahme } from '../../model/teilnahme.model';
import { DURCHFUEHRUNGSART } from '../../../core/wettbewerbsdurchfuehrende/model/wettbewerbsdurchfuehrende.model';
import { PrivatteilnahmeHttpService } from './privatteilnahme-http.service';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';

describe('PrivatteilnahmeHttpService', () => {
    const teilnahme: Teilnahme = {
        angemeldetAm: '27.02.2027',
        anzahlKinder: 56,
        anzahlKlassen: 0,
        anzahlLoesungszettel: 14,
        auswertungsart: 'ONLINE',
        durchfuehrungsart: DURCHFUEHRUNGSART.privat,
        jahr: 2027,
        kuerzel: 'P123456789',
    };

    it('privatAnmelden ruft den vereinbarten Pfad mit POST auf', () => {
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/privatperson/me/aktuelle-teilnahme';

        const httpClientMock = {
            post: vi.fn().mockReturnValue(of(teilnahme)),
        };

        TestBed.configureTestingModule({
            providers: [
                PrivatteilnahmeHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(PrivatteilnahmeHttpService);

        const subscription = service.privatAnmelden().subscribe();

        try {
            expect(httpClientMock.post).toHaveBeenCalledExactlyOnceWith(
                apiUrl + expectedPath,
                null,
                expect.objectContaining({
                    context: expect.any(HttpContext),
                    withCredentials: true,
                })
            );

            const options = httpClientMock.post.mock.calls[0][2];

            expect(options.context.get(ERROR_MESSAGE_HANDLED_LOCALLY)).toBe(true);
        } finally {
            subscription.unsubscribe();
        }
    });

    it('loadAktuellePrivatteilnahme ruft den vereinbarten Pfad mit GET auf', () => {
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/privatperson/me/aktuelle-teilnahme';

        const httpClientMock = {
            get: vi.fn().mockReturnValue(of(teilnahme)),
        };

        TestBed.configureTestingModule({
            providers: [
                PrivatteilnahmeHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(PrivatteilnahmeHttpService);

        const subscription = service.loadAktuellePrivatteilnahme().subscribe();

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
