import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
    AUTHORIZED_RESOURCE_LOAD_STATE,
    BAD_REQUEST_FALLBACK_FEHLERMELDUNG,
    CONFLICT_FALLBACK_FEHLERMELDUNG,
    ConstraintViolation,
    ErrorContext,
    ErrorResponse,
    NOT_FOUND_FEHLERMELDUNG,
    PRECONDITION_FAILED_FALLBACK_FEHLERMELDUNG,
    PUBLIC_RESOURCE_LOAD_STATE,
    RESTRICTED_RESOURCE_LOAD_STATE,
    TECHNISCHER_FEHLER_FEHLERMELDUNG,
} from '@matheportal/shared-model';

export function mapErrorToPublicResourceLoadState(error: Error): PUBLIC_RESOURCE_LOAD_STATE {
    if (error.name === 'HttpErrorResponse') {
        const httpError = error as HttpErrorResponse;
        if (httpError.status === 404) {
            return 'loaded';
        }
    }
    return 'technical-error';
}

export function mapErrorToRestrictedResourceLoadState(error: Error): RESTRICTED_RESOURCE_LOAD_STATE {
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

export function mapErrorToAuthorizedResourceLoadState(error: Error): AUTHORIZED_RESOURCE_LOAD_STATE {
    if (error.name === 'HttpErrorResponse') {
        const httpError = error as HttpErrorResponse;
        switch (httpError.status) {
            case 401:
                return 'unauthorized';
            case 403:
                return 'forbidden';
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

export function mapToErrorContext(error: Error): ErrorContext {
    let errorResponse: ErrorResponse = {
        message: TECHNISCHER_FEHLER_FEHLERMELDUNG,
        constraintViolations: [],
    };

    let httpStatus: number | undefined = undefined;

    if (error.name === 'HttpErrorResponse') {
        const httpError = error as HttpErrorResponse;
        httpStatus = httpError.status;

        switch (httpError.status) {
            case HttpStatusCode.BadRequest:
            case HttpStatusCode.Conflict:
            case HttpStatusCode.PreconditionFailed:
                errorResponse = extractErrorResponse(httpError);
                break;
            case HttpStatusCode.NotFound:
                errorResponse = { message: NOT_FOUND_FEHLERMELDUNG, constraintViolations: [] };
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
                    message: TECHNISCHER_FEHLER_FEHLERMELDUNG,
                    constraintViolations: [],
                };
        }
    }
    const message = errorResponseToString(errorResponse);
    return { httpStatus, message };
}

export function extractErrorResponse(error: HttpErrorResponse): ErrorResponse {
    const httpStatus = error.status;
    const theError = error.error;
    if (!theError || !theError['constraintViolations'] || !theError['message']) {
        switch (httpStatus) {
            case 400:
                return { message: BAD_REQUEST_FALLBACK_FEHLERMELDUNG, constraintViolations: [] };
            case 409:
                return { message: CONFLICT_FALLBACK_FEHLERMELDUNG, constraintViolations: [] };
            case 412:
                return { message: PRECONDITION_FAILED_FALLBACK_FEHLERMELDUNG, constraintViolations: [] };
        }
        return { message: TECHNISCHER_FEHLER_FEHLERMELDUNG, constraintViolations: [] };
    }

    return { message: theError['message'], constraintViolations: theError['constraintViolations'] };
}
