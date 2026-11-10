import { of } from 'rxjs';
import { SchulkatalogantragHttpService } from './schulkatalogantrag-http.service';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext } from '@angular/common/http';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { Schulkatalogantrag } from '../model/schulkatalogantrag.model';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';

describe('SchulkatalogantragHttpService', () => {
    it('submitSchulkatalogantrag ruft den vereinbarten Pfad mit POST auf', () => {
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/schulkatalogantrag';

        const httpClientMock = {
            post: vi.fn().mockReturnValue(of()),
        };

        TestBed.configureTestingModule({
            providers: [
                SchulkatalogantragHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(SchulkatalogantragHttpService);

        const requestDto: Schulkatalogantrag = {
            emailAuftraggeber: 'me@provider.de',
            nameLand: 'Brandenburg',
            nameOrt: 'Potsdam',
            nameSchule: 'Baumschule',
            plz: '14534',
            strasseUndHausnummer: 'Berliner Allee 34',
        };

        const subscription = service.submitSchulkatalogantrag(requestDto).subscribe();

        try {
            expect(httpClientMock.post).toHaveBeenCalledExactlyOnceWith(
                apiUrl + expectedPath,
                requestDto,
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
});
