import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthFlowFacade } from './auth-flow.facade';
import { catchError, throwError } from 'rxjs';

export const authExpiredInterceptor: HttpInterceptorFn = (req, next) => {
    const authFlowFacade = inject(AuthFlowFacade);

    return next(req).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                authFlowFacade.handleSessionExpired();
            }

            return throwError(() => error);
        })
    );
};
