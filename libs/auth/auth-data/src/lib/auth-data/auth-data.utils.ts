export type SESSION_VALIDATION_FAILED_REASON = 'technical' | 'expired' | 'missing';

export function parseSessionValidationFailedDtoReason(value: unknown): 'expired' | 'missing' {
    if (typeof value !== 'object' || value === null) {
        return 'missing';
    }

    const reason = (value as { reason?: unknown }).reason;

    return reason === 'expired' || reason === 'missing' ? reason : 'missing';
}
