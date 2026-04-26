package de.mathejungalt.matheportal.shell.domain.exception;

import de.mathejungalt.matheportal.shell.domain.clientauth.IamClientErrorType;

/**
 * IamClientException.
 */
public class IamClientException extends RuntimeException {

    private static final long serialVersionUID = 1L;

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
     * @param exception Throwable
     * @param errorType IamClientErrorType
     */
    public IamClientException(final String message, final Throwable exception, final IamClientErrorType errorType) {
        super(message, exception);
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
