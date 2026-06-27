import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom, throwError } from 'rxjs';
import { globalTechnicalHttpErrorInterceptor } from './globa-technical-http-error.interceptor';
import { MESSAGE_PUBLISHER } from './error.publisher';

describe('globalTechnicalHttpErrorInterceptor', () => {
    const messagePublisherMock = {
        publishError: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: MESSAGE_PUBLISHER,
                    useValue: messagePublisherMock,
                },
            ],
        });
    });

    it.each([0, 500, 502, 503])(
        'shows an error message wenn status %i and rethrows the error',
        async (status: number) => {
            const error = new HttpErrorResponse({ status: status });
            const request = new HttpRequest('GET', '/api/test');
            const next: HttpHandlerFn = () => throwError(() => error);

            await expect(
                lastValueFrom(TestBed.runInInjectionContext(() => globalTechnicalHttpErrorInterceptor(request, next)))
            ).rejects.toBe(error);

            expect(messagePublisherMock.publishError).toHaveBeenCalled();
        }
    );

    it('does not handle non-http errors', async () => {
        const error = new Error('Unexpected client error');
        const request = new HttpRequest('GET', '/api/test');

        const next: HttpHandlerFn = () => throwError(() => error);

        await expect(
            lastValueFrom(TestBed.runInInjectionContext(() => globalTechnicalHttpErrorInterceptor(request, next)))
        ).rejects.toBe(error);

        expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
    });
});
