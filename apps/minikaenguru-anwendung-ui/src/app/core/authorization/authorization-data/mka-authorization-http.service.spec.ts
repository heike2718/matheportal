import { TestBed } from '@angular/core/testing';
import { User } from '@matheportal/auth-model';
import { of } from 'rxjs';
import { MkaAuthorizationHttpService } from './mka-authorization-http.service';
import { HttpClient, HttpContext } from '@angular/common/http';
import { MINIKAENGURU_ANWENDUNG_CONFIGURATION } from '../../../config/minikaenguru-anwendung.configuration';
import { paths } from '../../../generated/api-types';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';

describe('MkaAuthorizationHttpService', () => {
    it('loadMkaAuthorization ruft den vereinbarten Pfad mit GET auf', () => {
        const apiUrl = 'https://example.test';
        const expectedPath = '/api/berechtigungen' satisfies keyof paths;

        const user: User = {
            anonym: false,
            berechtigungen: ['SCHULE'],
            fullName: 'Frodo',
        };

        const httpClientMock = {
            get: vi.fn().mockReturnValue(of(user)),
        };

        TestBed.configureTestingModule({
            providers: [
                MkaAuthorizationHttpService,
                { provide: HttpClient, useValue: httpClientMock },
                {
                    provide: MINIKAENGURU_ANWENDUNG_CONFIGURATION,
                    useValue: { apiUrl },
                },
            ],
        });

        const service = TestBed.inject(MkaAuthorizationHttpService);

        const subscription = service.loadMkaAuthorization().subscribe();

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
