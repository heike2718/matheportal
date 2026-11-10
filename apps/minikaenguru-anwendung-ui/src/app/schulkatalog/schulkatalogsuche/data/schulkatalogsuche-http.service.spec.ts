import { TestBed } from '@angular/core/testing';
import { SchulkatalogsucheHttpService } from './schulkatalogsuche-http.service';
import { HttpClient, HttpContext } from '@angular/common/http';
import { of } from 'rxjs';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';

describe('SchulkatalogsucheHttpService', () => {
    const apiUrl = 'https://example.test';
    const httpClientMock = {
        get: vi.fn().mockReturnValue(of([])),
    };

    let service: SchulkatalogsucheHttpService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SchulkatalogsucheHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        service = TestBed.inject(SchulkatalogsucheHttpService);
        vi.clearAllMocks();
    });

    it('findOrte ruft den vereinbarten Pfad mit GET auf', () => {
        const expectedPath = '/api/schulkatalog/orte';

        const subscription = service.findOrte('Wei').subscribe();

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

    it('loadSchulen ruft den vereinbarten Pfad mit GET auf', () => {
        const ortId = 'O1234567';
        const expectedPath = '/api/schulkatalog/orte/O1234567/schulen';

        const subscription = service.loadSchulen(ortId).subscribe();

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
