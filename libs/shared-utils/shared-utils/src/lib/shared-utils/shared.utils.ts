export const TECHNISCHER_FEHLER_MESSAGE =
    'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
    'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

export const SESSION_EXPIRED_MESSAGE = 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.';

export function assertDefined<T>(value: T | undefined, message: string): T {
    if (value === undefined) {
        throw new Error(message);
    }
    return value;
}
