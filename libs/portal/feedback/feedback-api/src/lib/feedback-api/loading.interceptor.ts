import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from './loading.service';
import { SILENT_LOAD_CONTEXT } from './silent-load.context';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    if (req.context.get(SILENT_LOAD_CONTEXT)) {
        return next(req);
    }

    loadingService.start();
    return next(req).pipe(finalize(() => loadingService.stop()));
};
