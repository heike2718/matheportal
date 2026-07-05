import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '@matheportal/error-handling-api';
import { extractErrorResponse, mapErrorToMessage } from './minikaenguru-error-mapper';

describe('minikaenguru-error-mapper tests', () => {
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
