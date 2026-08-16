import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
    ConstraintViolation,
    ErrorResponse,
    RESOURCE_LOAD_STATE,
    TECHNISCHER_FEHLER_MESSAGE,
} from '@matheportal/shared-model';

export function mapErrorResourceLoadingState(error: Error): RESOURCE_LOAD_STATE {
    if (error.name === 'HttpErrorResponse') {
        const httpError = error as HttpErrorResponse;
        switch (httpError.status) {
            case 401:
            case 403:
                return 'unauthorized';
            case 404:
                return 'loaded';
            default:
                return 'technical-error';
        }
    }
    return 'technical-error';
}

export function assertDefined<T>(value: T | undefined, message: string): T {
    if (value === undefined) {
        throw new Error(message);
    }
    return value;
}

function constraintViolationToString(cv: ConstraintViolation): string {
    return cv.field + ': ' + cv.message;
}

export function errorResponseToString(errorResponse: ErrorResponse): string {
    let result = errorResponse.message;
    if (errorResponse.constraintViolations.length > 0) {
        result += ' (';
    }
    let count = 0;
    for (const cv of errorResponse.constraintViolations) {
        result = result + constraintViolationToString(cv);
        if (count <= errorResponse.constraintViolations.length - 2) {
            result = result + ', ';
            count++;
        }
    }
    if (errorResponse.constraintViolations.length > 0) {
        result += ')';
    }
    return result;
}

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
