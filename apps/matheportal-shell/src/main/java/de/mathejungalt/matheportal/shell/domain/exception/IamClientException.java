package de.mathejungalt.matheportal.shell.domain.exception;

import de.mathejungalt.matheportal.shell.domain.clientauth.IamClientErrorType;

/**
 * IamClientException.
 */
public class IamClientException extends RuntimeException {

    private final IamClientErrorType errorType;

    /**
     * @param message   String
     * @param errorType IamClientErrorType
     */
    public IamClientException(final String message, final IamClientErrorType errorType) {
        super(message);
        this.errorType = errorType;
    }

    /**
     * @param message   String
     * @param cause     Throwable
     * @param errorType IamClientErrorType
     */
    public IamClientException(final String message, final Throwable cause, final IamClientErrorType errorType) {
        super(message, cause);
        this.errorType = errorType;
    }

    /**
     * Getter.
     *
     * @return IamClientErrorType
     */
    public IamClientErrorType getErrorType() {
        return errorType;
    }
}
