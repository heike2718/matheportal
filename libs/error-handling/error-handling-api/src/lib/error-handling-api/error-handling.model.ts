export interface ConstraintViolation {
    readonly field: string;
    readonly message: string;
}

function constraintViolationToString(cv: ConstraintViolation): string {
    return cv.field + ': ' + cv.message;
}

export interface ErrorResponse {
    readonly message: string;
    readonly constraintViolations: ConstraintViolation[];
}

export function errorResponseToString(errorResponse: ErrorResponse): string {
    let result = errorResponse.message;
    if (errorResponse.constraintViolations.length > 0) {
        result += ' (';
    }
    let count = 0;
    for (const cv of errorResponse.constraintViolations) {
        result = result + constraintViolationToString(cv);
        if (count <= errorResponse.constraintViolations.length - 2) {
            result = result + ', ';
            count++;
        }
    }
    if (errorResponse.constraintViolations.length > 0) {
        result += ')';
    }
    return result;
}
