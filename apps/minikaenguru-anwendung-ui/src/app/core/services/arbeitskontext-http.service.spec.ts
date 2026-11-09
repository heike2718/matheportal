import { HttpClient, HttpContext } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../config/minikaenguru-anwendung.configuration';
import type { paths } from '../../generated/api-types';
import { ArbeitskontextHttpService } from './arbeitskontext-http.service';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';

describe('ArbeitskontextHttpService', () => {
    it('loadLehrpersonSchulen ruft den vereinbarten Pfad mit GET auf', () => {
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/lehrperson/me/schulen' satisfies keyof paths;
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
});
