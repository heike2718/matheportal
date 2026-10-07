import { HttpContext, HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom, of, throwError } from 'rxjs';
import { globalTechnicalHttpErrorInterceptor } from './globa-technical-http-error.interceptor';
import { MESSAGE_PUBLISHER } from './error.publisher';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';

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
        'shows an error message wenn status %i and rethrows the error exactly once',
        async (status: number) => {
            const error = new HttpErrorResponse({ status: status });
            const request = new HttpRequest('GET', '/api/test');
            const next = vi.fn<HttpHandlerFn>(() => throwError(() => error));

            await expect(
                lastValueFrom(TestBed.runInInjectionContext(() => globalTechnicalHttpErrorInterceptor(request, next)))
            ).rejects.toBe(error);

            expect(next).toHaveBeenCalledExactlyOnceWith(request);
            expect(messagePublisherMock.publishError).toHaveBeenCalled();
        }
    );

    it('should forward the error without publishing or retrying when handled locally', async () => {
        const error = new HttpErrorResponse({ status: 500 });
        const request = new HttpRequest('GET', '/api/test', {
            context: new HttpContext().set(ERROR_MESSAGE_HANDLED_LOCALLY, true),
        });
        const next = vi.fn<HttpHandlerFn>(() => throwError(() => error));

        await expect(
            lastValueFrom(TestBed.runInInjectionContext(() => globalTechnicalHttpErrorInterceptor(request, next)))
        ).rejects.toBe(error);

        expect(next).toHaveBeenCalledExactlyOnceWith(request);
        expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
    });

    it('does not handle non-http errors', async () => {
        const error = new Error('Unexpected client error');
        const request = new HttpRequest('GET', '/api/test');

        const next = vi.fn<HttpHandlerFn>(() => throwError(() => error));

        await expect(
            lastValueFrom(TestBed.runInInjectionContext(() => globalTechnicalHttpErrorInterceptor(request, next)))
        ).rejects.toBe(error);

        expect(next).toHaveBeenCalledExactlyOnceWith(request);
        expect(messagePublisherMock.publishError).not.toHaveBeenCalled();
    });
});
