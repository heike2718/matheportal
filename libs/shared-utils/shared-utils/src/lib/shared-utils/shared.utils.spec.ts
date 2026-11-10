import {
    AUTHORIZED_RESOURCE_LOAD_STATE,
    ErrorResponse,
    PUBLIC_RESOURCE_LOAD_STATE,
    RESTRICTED_RESOURCE_LOAD_STATE,
} from '@matheportal/shared-model';
import {
    assertDefined,
    errorResponseToString,
    extractErrorResponse,
    mapErrorToRestrictedResourceLoadState,
    mapToErrorContext,
    mapErrorToAuthorizedResourceLoadState,
    mapErrorToPublicResourceLoadState,
} from './shared.utils';
import { HttpErrorResponse } from '@angular/common/http';

describe('shared utils tests', () => {
    const expectedTechnicalErrorMessage =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
        'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

    const expectedConflictFallbackFehlermeldung =
        'Die Daten wurden zwischenzeitlich von einer anderen berechtigten Person geändert. ' +
        'Ihre Änderungen wurden nicht gespeichert. Bitte laden Sie die aktuellen Daten neu und versuchen Sie es anschließend erneut.';

    const expectedNotFoundFehlermeldung =
        'Die angeforderten Daten wurden nicht gefunden. ' +
        'Möglicherweise wurden sie inzwischen von einer anderen berechtigten Person gelöscht.';

    const expectedBadRequestFehlermeldung = 'Ihre Eingaben enthalten ungültige Zeichen. Bitte überprüfen Sie diese.';

    const badRequestErrorResponse: ErrorResponse = {
        message: 'Die Eingaben enthalten ungültige Werte.',
        constraintViolations: [
            {
                field: 'vorname',
                message: 'enthält ungültige Zeichen',
            },
            { field: 'klassenstufe', message: 'muss 1 oder 2 sein' },
        ],
    };

    const badRequest = new HttpErrorResponse({
        status: 400,
        statusText: 'bad request',
        error: badRequestErrorResponse,
    });

    describe('assertDefined', () => {
        it('should return the value if defined', () => {
            const result = assertDefined({ foo: 'hallo' }, 'ich hätte jetzt defined erwartet');
            expect(result).toEqual({ foo: 'hallo' });
        });
        it('throws an Error when undefined', () => {
            expect(() => assertDefined(undefined, 'ich hätte jetzt defined erwartet')).toThrow(
                'ich hätte jetzt defined erwartet'
            );
        });
    });

    describe('mapErrorToPublicResourceLoadState', () => {
        it('should return not-found when 404 and notFoundExcepted true', () => {
            const result: PUBLIC_RESOURCE_LOAD_STATE = mapErrorToPublicResourceLoadState(
                new HttpErrorResponse({
                    status: 404,
                    statusText: 'not-found',
                    error: 'boom',
                    url: '/public-resource/',
                }),
                true
            );

            expect(result).toBe('not-found');
        });
        it.each([
            400, 402, 404, 405, 406, 407, 408, 410, 411, 412, 413, 414, 415, 416, 417, 421, 422, 423, 424, 425, 426,
            428, 429, 431, 451,
        ])('should return technical when %i and notFound is invalid', httpStatusCode => {
            const result: PUBLIC_RESOURCE_LOAD_STATE = mapErrorToPublicResourceLoadState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'bad request',
                    error: 'boom',
                    url: '/public-resource/',
                }),
                false
            );

            expect(result).toBe('technical-error');
        });
        it('should return technical when minimum 500 and notFounfd is not expected', () => {
            const httpStatusCode = Math.floor(Math.random() * 100) + 500;
            const result: PUBLIC_RESOURCE_LOAD_STATE = mapErrorToPublicResourceLoadState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/public-resource/',
                }),
                false
            );

            expect(result).toBe('technical-error');
        });
        it('should return technical when minimum 500 and notFounfd is expected', () => {
            const httpStatusCode = Math.floor(Math.random() * 100) + 500;
            const result: PUBLIC_RESOURCE_LOAD_STATE = mapErrorToPublicResourceLoadState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/public-resource/',
                }),
                true
            );

            expect(result).toBe('technical-error');
        });
        it.each([401, 403])('should return technical when httpStatusCode %i', httpStatusCode => {
            const result: PUBLIC_RESOURCE_LOAD_STATE = mapErrorToPublicResourceLoadState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/public-resource/',
                }),
                false
            );
            expect(result).toBe('technical-error');
        });
        it('should return technical when other Error and notFound is invalid', () => {
            const error = new Error('uiuiui');
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToPublicResourceLoadState(error, false);

            expect(result).toBe('technical-error');
        });
        it('should return technical when other Error and notFound is valid', () => {
            const error = new Error('uiuiui');
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToPublicResourceLoadState(error, true);

            expect(result).toBe('technical-error');
        });
    });

    describe('mapErrorToRestrictedResourceLoadState', () => {
        it('should return unauthorized when 401 and notFound is invalid', () => {
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToRestrictedResourceLoadState(
                new HttpErrorResponse({
                    status: 401,
                    statusText: 'unauthorized',
                    error: 'boom',
                    url: '/irgendeine/resource/',
                }),
                false
            );

            expect(result).toBe('unauthorized');
        });
        it('should return unauthorized when 401 and notFound is valid', () => {
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToRestrictedResourceLoadState(
                new HttpErrorResponse({
                    status: 401,
                    statusText: 'unauthorized',
                    error: 'boom',
                    url: '/irgendeine/resource/',
                }),
                true
            );

            expect(result).toBe('unauthorized');
        });
        it('should return unauthorized when 403 and notFound is invalid', () => {
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToRestrictedResourceLoadState(
                new HttpErrorResponse({
                    status: 403,
                    statusText: 'forbidden',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                false
            );

            expect(result).toBe('unauthorized');
        });
        it('should return unauthorized when 403 and notFound is valid', () => {
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToRestrictedResourceLoadState(
                new HttpErrorResponse({
                    status: 403,
                    statusText: 'forbidden',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                true
            );

            expect(result).toBe('unauthorized');
        });
        it('should return not-found when 404 and notFound is valid', () => {
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToRestrictedResourceLoadState(
                new HttpErrorResponse({
                    status: 404,
                    statusText: 'not-found',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                true
            );

            expect(result).toBe('not-found');
        });
        it.each([
            400, 402, 404, 405, 406, 407, 408, 410, 411, 412, 413, 414, 415, 416, 417, 421, 422, 423, 424, 425, 426,
            428, 429, 431, 451,
        ])('should return technical when %i and notFound is invalid', httpStatusCode => {
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToRestrictedResourceLoadState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'bad request',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                false
            );

            expect(result).toBe('technical-error');
        });
        it('should return technical when minimum 500 and notFound is invalid', () => {
            const httpStatusCode = Math.floor(Math.random() * 100) + 500;
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToRestrictedResourceLoadState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                false
            );

            expect(result).toBe('technical-error');
        });
        it('should return technical when minimum 500 and notFound is valid', () => {
            const httpStatusCode = Math.floor(Math.random() * 100) + 500;
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToRestrictedResourceLoadState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                true
            );

            expect(result).toBe('technical-error');
        });
        it.each([
            400, 402, 404, 405, 406, 407, 408, 410, 411, 412, 413, 414, 415, 416, 417, 421, 422, 423, 424, 425, 426,
            428, 429, 431, 451,
        ])('should return technical when %i and notFound is invalid', httpStatusCode => {
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToRestrictedResourceLoadState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                false
            );
            expect(result).toBe('technical-error');
        });
        it('should return technical when other Error and notFound is invalid', () => {
            const error = new Error('uiuiui');
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToRestrictedResourceLoadState(error, false);

            expect(result).toBe('technical-error');
        });
        it('should return technical when other Error and notFound is valid', () => {
            const error = new Error('uiuiui');
            const result: RESTRICTED_RESOURCE_LOAD_STATE = mapErrorToRestrictedResourceLoadState(error, true);

            expect(result).toBe('technical-error');
        });
    });

    describe('mapErrorToAuthorizedResourceLoadState', () => {
        it('should return unauthorized when 401 and notFound is invalid', () => {
            const result: AUTHORIZED_RESOURCE_LOAD_STATE = mapErrorToAuthorizedResourceLoadState(
                new HttpErrorResponse({
                    status: 401,
                    statusText: 'unauthorized',
                    error: 'boom',
                    url: '/irgendeine/resource/',
                }),
                false
            );

            expect(result).toBe('unauthorized');
        });
        it('should return unauthorized when 401 and notFound is valid', () => {
            const result: AUTHORIZED_RESOURCE_LOAD_STATE = mapErrorToAuthorizedResourceLoadState(
                new HttpErrorResponse({
                    status: 401,
                    statusText: 'unauthorized',
                    error: 'boom',
                    url: '/irgendeine/resource/',
                }),
                true
            );

            expect(result).toBe('unauthorized');
        });
        it('should return forbidden when 403 and notFound is invalid', () => {
            const result: AUTHORIZED_RESOURCE_LOAD_STATE = mapErrorToAuthorizedResourceLoadState(
                new HttpErrorResponse({
                    status: 403,
                    statusText: 'forbidden',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                false
            );

            expect(result).toBe('forbidden');
        });

        it('should return forbidden when 403 and notFound is valid', () => {
            const result: AUTHORIZED_RESOURCE_LOAD_STATE = mapErrorToAuthorizedResourceLoadState(
                new HttpErrorResponse({
                    status: 403,
                    statusText: 'forbidden',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                true
            );

            expect(result).toBe('forbidden');
        });
        it('should return not-found when 404 and notFound is valid', () => {
            const result: AUTHORIZED_RESOURCE_LOAD_STATE = mapErrorToAuthorizedResourceLoadState(
                new HttpErrorResponse({
                    status: 404,
                    statusText: 'not-found',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                true
            );

            expect(result).toBe('not-found');
        });
        it('should return technical when minimum 500 and notFound is invalid', () => {
            const httpStatusCode = Math.floor(Math.random() * 100) + 500;
            const result: AUTHORIZED_RESOURCE_LOAD_STATE = mapErrorToAuthorizedResourceLoadState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                false
            );

            expect(result).toBe('technical-error');
        });
        it('should return technical when minimum 500 and notFound is valid', () => {
            const httpStatusCode = Math.floor(Math.random() * 100) + 500;
            const result: AUTHORIZED_RESOURCE_LOAD_STATE = mapErrorToAuthorizedResourceLoadState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                true
            );

            expect(result).toBe('technical-error');
        });
        it.each([
            400, 402, 404, 405, 406, 407, 408, 410, 411, 412, 413, 414, 415, 416, 417, 421, 422, 423, 424, 425, 426,
            428, 429, 431, 451,
        ])('should return technical when %i and notFound is invalid', httpStatusCode => {
            const result: AUTHORIZED_RESOURCE_LOAD_STATE = mapErrorToAuthorizedResourceLoadState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                }),
                false
            );
            expect(result).toBe('technical-error');
        });
        it('should return technical when other Error and notFound is invalid', () => {
            const error = new Error('uiuiui');
            const result: AUTHORIZED_RESOURCE_LOAD_STATE = mapErrorToAuthorizedResourceLoadState(error, false);

            expect(result).toBe('technical-error');
        });
        it('should return technical when other Error and notFound is valid', () => {
            const error = new Error('uiuiui');
            const result: AUTHORIZED_RESOURCE_LOAD_STATE = mapErrorToAuthorizedResourceLoadState(error, true);

            expect(result).toBe('technical-error');
        });
    });

    describe('errorResponseToString tests', () => {
        it('handles errorResponse without constraintViolations', () => {
            const errorResponse: ErrorResponse = {
                message: 'eine Fehlermeldung',
                constraintViolations: [],
            };

            expect(errorResponseToString(errorResponse)).toBe('eine Fehlermeldung');
        });

        it('handles errorResponse with one constraintViolation', () => {
            const errorResponse: ErrorResponse = {
                message: 'es gab Validierungsfehler',
                constraintViolations: [
                    {
                        field: 'field-1',
                        message: 'message-1',
                    },
                ],
            };

            expect(errorResponseToString(errorResponse)).toBe('es gab Validierungsfehler (field-1: message-1)');
        });
        it('handles errorResponse with zwo constraintViolations', () => {
            const errorResponse: ErrorResponse = {
                message: 'es gab Validierungsfehler',
                constraintViolations: [
                    {
                        field: 'field-1',
                        message: 'message-1',
                    },
                    {
                        field: 'field-2',
                        message: 'message-2',
                    },
                ],
            };

            expect(errorResponseToString(errorResponse)).toBe(
                'es gab Validierungsfehler (field-1: message-1, field-2: message-2)'
            );
        });
        it('handles the errorResponse from minikaenguru-error.mapper-tests', () => {
            const badRequestErrorResponse: ErrorResponse = {
                message: 'Die Eingaben enthalten ungültige Werte.',
                constraintViolations: [
                    {
                        field: 'vorname',
                        message: 'enthält ungültige Zeichen',
                    },
                    { field: 'klassenstufe', message: 'muss 1 oder 2 sein' },
                ],
            };
            expect(errorResponseToString(badRequestErrorResponse)).toBe(
                'Die Eingaben enthalten ungültige Werte. (vorname: enthält ungültige Zeichen, klassenstufe: muss 1 oder 2 sein)'
            );
        });
    });

    describe('mapToErrorContext test', () => {
        const errorResponse: ErrorResponse = {
            message: 'Diese Meldung kommt aus dem Backend.',
            constraintViolations: [],
        };

        const unauthorized = new HttpErrorResponse({ status: 401, statusText: 'unauthorized' });
        const forbidden = new HttpErrorResponse({ status: 403, statusText: 'unauthorized' });
        const notFound = new HttpErrorResponse({ status: 404, statusText: 'not found' });

        const conflict = new HttpErrorResponse({
            status: 409,
            statusText: 'conflict',
            error: errorResponse,
        });
        const internalServerError = new HttpErrorResponse({
            status: 500,
            statusText: 'internal server error',
            error: errorResponse,
        });

        it('maps bad request when it contains an ErrorResponse and notFound is invalid', () => {
            expect(mapToErrorContext(badRequest, false)).toEqual({
                httpStatus: 400,
                message:
                    'Die Eingaben enthalten ungültige Werte. (vorname: enthält ungültige Zeichen, klassenstufe: muss 1 oder 2 sein)',
            });
        });
        it('maps bad request when it contains an ErrorResponse and notFound is valid', () => {
            expect(mapToErrorContext(badRequest, true)).toEqual({
                httpStatus: 400,
                message:
                    'Die Eingaben enthalten ungültige Werte. (vorname: enthält ungültige Zeichen, klassenstufe: muss 1 oder 2 sein)',
            });
        });

        it('maps bad request when it does not contain an ErrorResponse and notFound is invalid', () => {
            expect(mapToErrorContext(new HttpErrorResponse({ status: 400 }), false)).toEqual({
                httpStatus: 400,
                message: expectedBadRequestFehlermeldung,
            });
        });
        it('maps bad request when it does not contain an ErrorResponse and notFound is valid', () => {
            expect(mapToErrorContext(new HttpErrorResponse({ status: 400 }), true)).toEqual({
                httpStatus: 400,
                message: expectedBadRequestFehlermeldung,
            });
        });

        it('maps unauthorized and notFound is invalid', () => {
            expect(mapToErrorContext(unauthorized, false)).toEqual({
                httpStatus: 401,
                message: 'Sie haben leider keine Berechtigung für diese Aktion',
            });
        });
        it('maps unauthorized and notFound is valid', () => {
            expect(mapToErrorContext(unauthorized, true)).toEqual({
                httpStatus: 401,
                message: 'Sie haben leider keine Berechtigung für diese Aktion',
            });
        });

        it('maps forbidden and notFound is invalid', () => {
            expect(mapToErrorContext(forbidden, false)).toEqual({
                httpStatus: 403,
                message: 'Sie haben leider keine Berechtigung für diese Aktion',
            });
        });

        it('maps forbidden and notFound is valid', () => {
            expect(mapToErrorContext(forbidden, true)).toEqual({
                httpStatus: 403,
                message: 'Sie haben leider keine Berechtigung für diese Aktion',
            });
        });

        it('maps not found when notFound is valid', () => {
            expect(mapToErrorContext(notFound, true)).toEqual({
                httpStatus: 404,
                message: expectedNotFoundFehlermeldung,
            });
        });

        it('maps not found when notFound is invalid', () => {
            expect(mapToErrorContext(notFound, false)).toEqual({
                httpStatus: 404,
                message: expectedTechnicalErrorMessage,
            });
        });

        it('maps conflict when it contains an ErrorResponse and notFound is invalid', () => {
            expect(mapToErrorContext(conflict, false)).toEqual({
                httpStatus: 409,
                message: 'Diese Meldung kommt aus dem Backend.',
            });
        });

        it('maps conflict when it contains an ErrorResponse and notFound is valid', () => {
            expect(mapToErrorContext(conflict, true)).toEqual({
                httpStatus: 409,
                message: 'Diese Meldung kommt aus dem Backend.',
            });
        });

        it('maps conflict request when it does not contain an ErrorResponse and notFound is invalid', () => {
            expect(mapToErrorContext(new HttpErrorResponse({ status: 409 }), false)).toEqual({
                httpStatus: 409,
                message: expectedConflictFallbackFehlermeldung,
            });
        });

        it('maps conflict request when it does not contain an ErrorResponse and notFound is valid', () => {
            expect(mapToErrorContext(new HttpErrorResponse({ status: 409 }), true)).toEqual({
                httpStatus: 409,
                message: expectedConflictFallbackFehlermeldung,
            });
        });

        it('maps internalServerError when it contains an ErrorResponse and notFound is invalid', () => {
            expect(mapToErrorContext(internalServerError, false)).toEqual({
                httpStatus: 500,
                message: expectedTechnicalErrorMessage,
            });
        });

        it('maps internalServerError when it contains an ErrorResponse and notFound is valid', () => {
            expect(mapToErrorContext(internalServerError, true)).toEqual({
                httpStatus: 500,
                message: expectedTechnicalErrorMessage,
            });
        });

        it('maps internalServerError when it does not contain an ErrorResponse and notFound is invalid', () => {
            expect(mapToErrorContext(new HttpErrorResponse({ status: 500 }), false)).toEqual({
                httpStatus: 500,
                message: expectedTechnicalErrorMessage,
            });
        });
        it('maps internalServerError when it does not contain an ErrorResponse and notFound is valid', () => {
            expect(mapToErrorContext(new HttpErrorResponse({ status: 500 }), true)).toEqual({
                httpStatus: 500,
                message: expectedTechnicalErrorMessage,
            });
        });

        it('maps other error than HttpErrorResponse when notFound is invalid', () => {
            expect(mapToErrorContext(new Error('damit hat nun keiner gerechnet'), false)).toEqual({
                httpStatus: undefined,
                message: expectedTechnicalErrorMessage,
            });
        });

        it('maps other error than HttpErrorResponse when notFound is valid', () => {
            expect(mapToErrorContext(new Error('damit hat nun keiner gerechnet'), true)).toEqual({
                httpStatus: undefined,
                message: expectedTechnicalErrorMessage,
            });
        });
    });

    describe('extractErrorResponse tests', () => {
        it('extracts the error response when notFound is invalid', () => {
            const result = extractErrorResponse(badRequest, false);
            expect(result).toEqual(badRequestErrorResponse);
        });
        it('extracts the error response when notFound is valid', () => {
            const result = extractErrorResponse(badRequest, true);
            expect(result).toEqual(badRequestErrorResponse);
        });

        it('returns a fallback object when no error exists and notFound is invalid', () => {
            const result = extractErrorResponse(new HttpErrorResponse({ status: 400 }), false);
            expect(result.message).toBe(expectedBadRequestFehlermeldung);
            expect(result.constraintViolations).toEqual([]);
        });
        it('returns a fallback object when no error exists and notFound is valid', () => {
            const result = extractErrorResponse(new HttpErrorResponse({ status: 400 }), true);
            expect(result.message).toBe(expectedBadRequestFehlermeldung);
            expect(result.constraintViolations).toEqual([]);
        });

        it('returns a general Error when error not an ErrorResponse and notFound is invalid', () => {
            const result = extractErrorResponse(
                new HttpErrorResponse({ status: 500, error: new Error('buuuu') }),
                false
            );
            expect(result.message).toBe(expectedTechnicalErrorMessage);
            expect(result.constraintViolations).toEqual([]);
        });
        it('returns a general Error when error not an ErrorResponse and notFound is valid', () => {
            const result = extractErrorResponse(
                new HttpErrorResponse({ status: 500, error: new Error('buuuu') }),
                true
            );
            expect(result.message).toBe(expectedTechnicalErrorMessage);
            expect(result.constraintViolations).toEqual([]);
        });
    });
});
