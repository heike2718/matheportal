export const TECHNISCHER_FEHLER_MESSAGE =
    'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut. ' +
    'Wenn Sie eine Mail senden, fügen Sie bitte wenn möglich einen Screenshot hinzu.';

export interface AuthFlowObserver {
    getId(): string;
    userLoggedOut(): void;
}
