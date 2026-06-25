export const TECHNISCHER_FEHLER_MESSAGE =
    'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.';

export interface AuthFlowObserver {
    getId(): string;
    userLoggedOut(): void;
}
