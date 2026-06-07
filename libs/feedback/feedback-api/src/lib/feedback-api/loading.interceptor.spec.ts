import { HttpContext, HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { SILENT_LOAD_CONTEXT } from './silent-load.context';
import { lastValueFrom, of, throwError } from 'rxjs';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
    const loadingService = {
        start: vi.fn(),
        stop: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();

        TestBed.configureTestingModule({
            providers: [{ provide: LoadingService, useValue: loadingService }],
        });
    });

    it('should do nothing, when SILENT_LOAD_CONTEXT', async () => {
        const request = new HttpRequest('GET', '/api/test', {
            context: new HttpContext().set(SILENT_LOAD_CONTEXT, true),
        });

        const next: HttpHandlerFn = () => of(new HttpResponse({ status: 200 }));

        await lastValueFrom(TestBed.runInInjectionContext(() => loadingInterceptor(request, next)));

        expect(loadingService.start).not.toHaveBeenCalled();
        expect(loadingService.stop).not.toHaveBeenCalled();
    });

    it('should start and stop loading when not silent and success ', async () => {
        const request = new HttpRequest('GET', '/api/test');
        const next: HttpHandlerFn = () => of(new HttpResponse({ status: 200 }));

        await lastValueFrom(TestBed.runInInjectionContext(() => loadingInterceptor(request, next)));

        expect(loadingService.start).toHaveBeenCalledOnce();
        expect(loadingService.stop).toHaveBeenCalledOnce();
    });

    it('should start and stop loading when not silent and error', async () => {
        const error = new HttpErrorResponse({ status: 500 });
        const request = new HttpRequest('GET', '/api/test');
        const next: HttpHandlerFn = () => throwError(() => error);

        await expect(
            lastValueFrom(TestBed.runInInjectionContext(() => loadingInterceptor(request, next)))
        ).rejects.toBe(error);

        expect(loadingService.start).toHaveBeenCalledOnce();
        expect(loadingService.stop).toHaveBeenCalledOnce();
    });
});
