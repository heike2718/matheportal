import { HttpClient, HttpContext } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../config/minikaenguru-anwendung.configuration';
import { ArbeitskontextHttpService } from './arbeitskontext-http.service';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';
import { PrivatpersonWettbewerbskontext } from '../../privatperson/model/privatperson.model';
import { SchuleWettbewerbskontext, Schulkollegium } from '../../schule/model/schule.model';
import { ANMELDESTATUS } from '../model/wettbewerbskontext.model';

describe('ArbeitskontextHttpService', () => {
    it('loadLehrpersonSchulen ruft den vereinbarten Pfad mit GET auf', () => {
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/lehrperson/me/schulen';
        const httpClientMock = {
            get: vi.fn().mockReturnValue(of([])),
        };

        TestBed.configureTestingModule({
            providers: [
                ArbeitskontextHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(ArbeitskontextHttpService);

        const subscription = service.loadLehrpersonSchulen().subscribe();

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

    it('loadSchuleWettbewerbskontext ruft den vereinbarten Pfad mit GET auf', () => {
        const apiUrl = 'https://example.test';
        const schuleId = 'S1234567';
        const expectedPath = '/api/schulen/S1234567/wettbewerbskontext';

        const wettbewerbskontext: SchuleWettbewerbskontext = {
            anmeldestatus: ANMELDESTATUS.nochNichtMoeglich,
            kollegen: [],
            schule: {
                kuerzel: 'S1234567',
                name: 'Baumschule',
                ort: {
                    land: {
                        kuerzel: 'DE-BB',
                        name: 'Brandenburg',
                        anzahlOrte: 456,
                    },
                    kuerzel: 'O1234567',
                    name: 'Waldeck',
                    anzahlSchulen: 13,
                },
            },
            teilnahmerefs: [],
            vertragDSGVOVorhanden: false,
        };

        const httpClientMock = {
            get: vi.fn().mockReturnValue(of(wettbewerbskontext)),
        };

        TestBed.configureTestingModule({
            providers: [
                ArbeitskontextHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(ArbeitskontextHttpService);

        const subscription = service.loadSchuleWettbewerbskontext(schuleId).subscribe();

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

    it('loadPrivatpersonWettbewerbskontext ruft den vereinbarten Pfad mit GET auf', () => {
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/privatperson/me/wettbewerbskontext';

        const wettbewerbskontext: PrivatpersonWettbewerbskontext = {
            anmeldestatus: ANMELDESTATUS.nichtMehrMoeglich,
            teilnahmerefs: [],
        };

        const httpClientMock = {
            get: vi.fn().mockReturnValue(of(wettbewerbskontext)),
        };

        TestBed.configureTestingModule({
            providers: [
                ArbeitskontextHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(ArbeitskontextHttpService);

        const subscription = service.loadPrivatpersonWettbewerbskontext().subscribe();

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

    it('loadSchulkollegium ruft den vereinbarten Pfad mit GET auf', () => {
        const apiUrl = 'https://example.test';
        const schuleId = 'S1234567';
        const expectedPath = '/api/schulen/S1234567/kollegium';

        const schulkollegium: Schulkollegium = {
            schulkuerzel: 'S1234567',
            kollegium: [],
        };

        const httpClientMock = {
            get: vi.fn().mockReturnValue(of(schulkollegium)),
        };

        TestBed.configureTestingModule({
            providers: [
                ArbeitskontextHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(ArbeitskontextHttpService);

        const subscription = service.loadSchulkollegium(schuleId).subscribe();

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
