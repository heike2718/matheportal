import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MESSAGE_PUBLISHER } from './error.publisher';
import { TECHNISCHER_FEHLER_MESSAGE } from '@matheportal/shared-model';
import { ERROR_MESSAGE_HANDLED_LOCALLY } from '@matheportal/feedback-contracts';

export const globalTechnicalHttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    // TODO: später eventuell einen eigenen errorState verwenden, nicht nur MessageService
    const messagePublisher = inject(MESSAGE_PUBLISHER);

    return next(req).pipe(
        catchError((error: unknown) => {
            // TODO Dinge zum Reporting einbauen
            if (
                error instanceof HttpErrorResponse &&
                (error.status === 0 || error.status >= 500) &&
                !req.context.get(ERROR_MESSAGE_HANDLED_LOCALLY)
            ) {
                messagePublisher.publishError(TECHNISCHER_FEHLER_MESSAGE);
            }

            // Fehler anderen Typs werden vom GlobalErrorHandler übernommen.
            return throwError(() => error);
        })
    );
};
