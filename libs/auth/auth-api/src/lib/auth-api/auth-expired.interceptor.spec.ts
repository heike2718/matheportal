import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom, throwError } from 'rxjs';
import { AuthFlowFacade } from './auth-flow.facade';
import { authExpiredInterceptor } from './auth-expired.interceptor';

describe('authExpiredInterceptor', () => {
    const authFlowFacade = {
        handleSessionExpired: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();

        TestBed.configureTestingModule({
            providers: [{ provide: AuthFlowFacade, useValue: authFlowFacade }],
        });
    });

    it('delegates 401 errors to AuthFlowFacade and rethrows the error', async () => {
        const error = new HttpErrorResponse({ status: 401 });
        const request = new HttpRequest('GET', '/api/test');
        const next: HttpHandlerFn = () => throwError(() => error);

        await expect(
            lastValueFrom(TestBed.runInInjectionContext(() => authExpiredInterceptor(request, next)))
        ).rejects.toBe(error);

        expect(authFlowFacade.handleSessionExpired).toHaveBeenCalledOnce();
    });

    it.each([400, 403, 404, 409, 412, 500])('does not delegate status %i to AuthFlowFacade', async (status: number) => {
        const error = new HttpErrorResponse({ status });

        const request = new HttpRequest('GET', '/api/test');

        const next: HttpHandlerFn = () => throwError(() => error);

        await expect(
            lastValueFrom(TestBed.runInInjectionContext(() => authExpiredInterceptor(request, next)))
        ).rejects.toBe(error);

        expect(authFlowFacade.handleSessionExpired).not.toHaveBeenCalled();
    });

    it('does not delegate network errors (status 0)', async () => {
        const error = new HttpErrorResponse({
            status: 0,
            statusText: 'Unknown Error',
        });

        const request = new HttpRequest('GET', '/api/test');

        const next: HttpHandlerFn = () => throwError(() => error);

        await expect(
            lastValueFrom(TestBed.runInInjectionContext(() => authExpiredInterceptor(request, next)))
        ).rejects.toBe(error);

        expect(authFlowFacade.handleSessionExpired).not.toHaveBeenCalled();
    });

    it('does not delegate non-http errors', async () => {
        const error = new Error('Unexpected client error');
        const request = new HttpRequest('GET', '/api/test');

        const next: HttpHandlerFn = () => throwError(() => error);

        await expect(
            lastValueFrom(TestBed.runInInjectionContext(() => authExpiredInterceptor(request, next)))
        ).rejects.toBe(error);

        expect(authFlowFacade.handleSessionExpired).not.toHaveBeenCalled();
    });
});
