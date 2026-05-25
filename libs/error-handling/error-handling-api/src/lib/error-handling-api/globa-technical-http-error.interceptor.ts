import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '@matheportal/feedback-api';

export const globalTechnicalHttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const message = 'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.';

    // TODO: später eventuell einen eigenen errorState verwenden, nicht nur MessageService
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 0 || error.status >= 500) {
                    // TODO Dinge zum Reporting einbauen
                    // messageService.publishOnce(message), damit nicht mehrere gleiche Fehlermeldungen entstehen.
                    messageService.publishError(message);
                }
            }

            // Fehler anderen Typs werden vom GlobalErrorHandler übernommen.
            return throwError(() => error);
        })
    );
};
