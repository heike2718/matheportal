import { ErrorResponse, errorResponseToString } from './error-handling.model';

describe('error-handling.model tests', () => {
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
