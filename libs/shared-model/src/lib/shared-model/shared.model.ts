export const TECHNISCHER_FEHLER_FEHLERMELDUNG =
    'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
    'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

export const CONFLICT_FALLBACK_FEHLERMELDUNG =
    'Die Daten wurden zwischenzeitlich von einer anderen berechtigten Person geändert. ' +
    'Ihre Änderungen wurden nicht gespeichert. Bitte laden Sie die aktuellen Daten neu und versuchen Sie es anschließend erneut.';

export const NOT_FOUND_FEHLERMELDUNG =
    'Die angeforderten Daten wurden nicht gefunden. ' +
    'Möglicherweise wurden sie inzwischen von einer anderen berechtigten Person gelöscht.';

export const PRECONDITION_FAILED_FALLBACK_FEHLERMELDUNG =
    'Die Voraussetzungen für diese Änderung sind nicht mehr erfüllt. Ihre Änderungen wurden nicht gespeichert. Bitte laden Sie die aktuellen Daten neu und prüfen Sie, ob die gewünschte Änderung noch möglich ist.';

export const BAD_REQUEST_FALLBACK_FEHLERMELDUNG =
    'Ihre Eingaben enthalten ungültige Zeichen. Bitte überprüfen Sie diese.';

export const SESSION_EXPIRED_MESSAGE = 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.';

export type PUBLIC_RESOURCE_LOAD_STATE = 'not-loaded' | 'loaded' | 'technical-error';

export type RESTRICTED_RESOURCE_LOAD_STATE = PUBLIC_RESOURCE_LOAD_STATE | 'unauthorized';

export type AUTHORIZED_RESOURCE_LOAD_STATE = RESTRICTED_RESOURCE_LOAD_STATE | 'forbidden';

export interface ErrorContext {
    httpStatus: number | undefined;
    message: string;
}

export interface ConstraintViolation {
    readonly field: string;
    readonly message: string;
}

export interface ErrorResponse {
    readonly message: string;
    readonly constraintViolations: ConstraintViolation[];
}
