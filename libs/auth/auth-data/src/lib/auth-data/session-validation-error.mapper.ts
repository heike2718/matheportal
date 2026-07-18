import { HttpErrorResponse } from '@angular/common/http';
import { parseSessionValidationFailedDtoReason, SESSION_VALIDATION_FAILED_REASON } from './auth-data.utils';

export function mapHttpErrorToSessionValidationFailedReason(
    error: HttpErrorResponse
): SESSION_VALIDATION_FAILED_REASON {
    if (error.status === 401) {
        return parseSessionValidationFailedDtoReason(error.error);
    }

    return 'technical';
}
