import { ErrorResponse, RESOURCE_LOAD_STATE } from '@matheportal/shared-model';
import {
    assertDefined,
    errorResponseToString,
    extractErrorResponse,
    mapErrorResourceLoadingState,
    mapErrorToMessage,
} from './shared.utils';
import { HttpErrorResponse } from '@angular/common/http';

describe('shared utils tests', () => {
    const expectedTechnischeFehlermeldung =
        'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

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

    describe('mapErrorResourceLoadingState', () => {
        it('should return unauthorized when 401', () => {
            const result: RESOURCE_LOAD_STATE = mapErrorResourceLoadingState(
                new HttpErrorResponse({
                    status: 401,
                    statusText: 'unauthorized',
                    error: 'boom',
                    url: '/irgendeine/resource/',
                })
            );

            expect(result).toBe('unauthorized');
        });
        it('should return unauthorized when 403', () => {
            const result: RESOURCE_LOAD_STATE = mapErrorResourceLoadingState(
                new HttpErrorResponse({
                    status: 403,
                    statusText: 'forbidden',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                })
            );

            expect(result).toBe('unauthorized');
        });
        it('should return loaded when 404', () => {
            const result: RESOURCE_LOAD_STATE = mapErrorResourceLoadingState(
                new HttpErrorResponse({
                    status: 404,
                    statusText: 'not-found',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                })
            );

            expect(result).toBe('loaded');
        });
        it('should return technical when 400', () => {
            const result: RESOURCE_LOAD_STATE = mapErrorResourceLoadingState(
                new HttpErrorResponse({
                    status: 400,
                    statusText: 'bad request',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                })
            );

            expect(result).toBe('technical-error');
        });
        it('should return technical when minimum 500', () => {
            const httpStatusCode = Math.floor(Math.random() * 100) + 500;
            const result: RESOURCE_LOAD_STATE = mapErrorResourceLoadingState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                })
            );

            expect(result).toBe('technical-error');
        });
        it('should return technical when not 401, 403, 404', () => {
            const httpStatusCode = Math.floor(Math.random() * 100) + 404;
            const result: RESOURCE_LOAD_STATE = mapErrorResourceLoadingState(
                new HttpErrorResponse({
                    status: httpStatusCode,
                    statusText: 'random error',
                    error: 'boom',
                    url: '/ORT-1/schulen/',
                })
            );
            expect(result).toBe('technical-error');
        });
        it('should return technical when other Error', () => {
            const error = new Error('uiuiui');
            const result: RESOURCE_LOAD_STATE = mapErrorResourceLoadingState(error);

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

    describe('mapErrorToMessage test', () => {
        const conflictErrorResponse: ErrorResponse = {
            message: 'Die Aktion kann leider nicht durchgeführt werden (Konflikt)',
            constraintViolations: [],
        };

        const unauthorized = new HttpErrorResponse({ status: 401, statusText: 'unauthorized' });
        const forbidden = new HttpErrorResponse({ status: 403, statusText: 'unauthorized' });

        const conflict = new HttpErrorResponse({
            status: 409,
            statusText: 'conflict',
            error: conflictErrorResponse,
        });

        it('maps unauthorized', () => {
            expect(mapErrorToMessage(unauthorized)).toBe('Sie haben leider keine Berechtigung für diese Aktion');
        });

        it('maps forbidden', () => {
            expect(mapErrorToMessage(forbidden)).toBe('Sie haben leider keine Berechtigung für diese Aktion');
        });

        it('maps bad request when it contains an ErrorResponse', () => {
            const result = mapErrorToMessage(badRequest);
            expect(result).toBe(
                'Die Eingaben enthalten ungültige Werte. (vorname: enthält ungültige Zeichen, klassenstufe: muss 1 oder 2 sein)'
            );
        });
        it('maps bad request when it does not contain an ErrorResponse', () => {
            expect(mapErrorToMessage(new HttpErrorResponse({ status: 400 }))).toBe(expectedTechnischeFehlermeldung);
        });
        it('maps conflict when it contains an ErrorResponse', () => {
            expect(mapErrorToMessage(conflict)).toBe('Die Aktion kann leider nicht durchgeführt werden (Konflikt)');
        });
        it('maps conflict request when it does not contain an ErrorResponse', () => {
            expect(mapErrorToMessage(new HttpErrorResponse({ status: 409 }))).toBe(expectedTechnischeFehlermeldung);
        });
    });

    describe('extractErrorResponse tests', () => {
        it('extracts the error response', () => {
            const result = extractErrorResponse(badRequest);
            expect(result).toEqual(badRequestErrorResponse);
        });
        it('returns a fallback object when no error exists', () => {
            const result = extractErrorResponse(new HttpErrorResponse({ status: 400 }));
            expect(result.message).toBe(expectedTechnischeFehlermeldung);
            expect(result.constraintViolations).toEqual([]);
        });
        it('returns the message of the Error when error not an ErrorResponse', () => {
            const result = extractErrorResponse(new HttpErrorResponse({ status: 400, error: new Error('buuuu') }));
            expect(result.message).toBe(expectedTechnischeFehlermeldung);
            expect(result.constraintViolations).toEqual([]);
        });
    });
});
