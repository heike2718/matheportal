export type ErrorType = 'VALIDATION' | 'CONCURRENT_UPDATE' | 'NOT_FOUND' | 'DUPLICATE' | 'SERVER' | 'SESSION_EXPIRED';

export interface MatheportalError {
    readonly type: ErrorType;
    readonly message: string;
}

export type MessageType = 'info' | 'warn' | 'error';

export interface AppMessage {
    readonly type: MessageType;
    readonly text: string;
    readonly dismissAfterMs?: number; // nur für info - soll nach einer gewissen Zeit verschwinden können
}

export function resolveMessageDismissAfterMs(message: string): number {
    const minimalDuration = 3000;
    const maximalDuration = 7000;
    const durationPerLetter = 45;

    const normalizedLength = message.trim().replace(/\s+/g, ' ').length;

    const durationForMessage = normalizedLength * durationPerLetter;

    if (durationForMessage < minimalDuration) {
        return minimalDuration;
    }

    if (durationForMessage > maximalDuration) {
        return maximalDuration;
    }

    return durationForMessage;
}
