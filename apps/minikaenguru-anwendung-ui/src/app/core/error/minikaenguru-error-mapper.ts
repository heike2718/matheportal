import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ErrorResponse, errorResponseToString } from '@matheportal/error-handling-api';
import { TECHNISCHER_FEHLER_MESSAGE } from '@matheportal/shared-utils';

export function mapErrorToMessage(error: Error): string {
    let errorResponse: ErrorResponse = {
        message: TECHNISCHER_FEHLER_MESSAGE,
        constraintViolations: [],
    };

    if (error.name === 'HttpErrorResponse') {
        const httpError = error as HttpErrorResponse;

        switch (httpError.status) {
            case HttpStatusCode.BadRequest:
            case HttpStatusCode.Conflict:
                errorResponse = extractErrorResponse(httpError);
                break;
            case HttpStatusCode.Unauthorized:
            case HttpStatusCode.Forbidden:
                errorResponse = {
                    message: 'Sie haben leider keine Berechtigung für diese Aktion',
                    constraintViolations: [],
                };
                break;
            default:
                errorResponse = {
                    message: TECHNISCHER_FEHLER_MESSAGE,
                    constraintViolations: [],
                };
        }
    }
    return errorResponseToString(errorResponse);
}

export function extractErrorResponse(error: HttpErrorResponse): ErrorResponse {
    const theError = error.error;
    if (!theError || !theError['constraintViolations'] || !theError['message']) {
        // das ist ein technischer Fehler, weil bei diesen Statuscodes die API ein ErrorResponse verspricht.
        return { message: TECHNISCHER_FEHLER_MESSAGE, constraintViolations: [] };
    }

    return { message: theError['message'], constraintViolations: theError['constraintViolations'] };
}
