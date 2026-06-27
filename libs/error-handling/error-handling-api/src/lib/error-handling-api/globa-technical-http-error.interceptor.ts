import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MESSAGE_PUBLISHER } from './error.publisher';
import { TECHNISCHER_FEHLER_MESSAGE } from '@matheportal/shared-model';

export const globalTechnicalHttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    // TODO: später eventuell einen eigenen errorState verwenden, nicht nur MessageService
    const messagePublisher = inject(MESSAGE_PUBLISHER);

    return next(req).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 0 || error.status >= 500) {
                    // TODO Dinge zum Reporting einbauen
                    // messageService.publishOnce(message), damit nicht mehrere gleiche Fehlermeldungen entstehen.
                    messagePublisher.publishError(TECHNISCHER_FEHLER_MESSAGE);
                }
            }

            // Fehler anderen Typs werden vom GlobalErrorHandler übernommen.
            return throwError(() => error);
        })
    );
};
