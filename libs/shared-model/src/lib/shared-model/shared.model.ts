export const TECHNISCHER_FEHLER_MESSAGE =
    'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
    'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

export const SESSION_EXPIRED_MESSAGE = 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.';

export type RESOURCE_LOAD_STATE = 'not-loaded' | 'loaded' | 'unauthorized' | 'technical-error';

export interface ConstraintViolation {
    readonly field: string;
    readonly message: string;
}

export interface ErrorResponse {
    readonly message: string;
    readonly constraintViolations: ConstraintViolation[];
}
