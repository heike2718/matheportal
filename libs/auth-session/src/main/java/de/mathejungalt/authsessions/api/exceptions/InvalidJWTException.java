package de.mathejungalt.authsessions.api.exceptions;

/**
 * InvalidJWTException.
 */
public class InvalidJWTException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public InvalidJWTException(final String message, final Throwable cause) {
        super(message, cause);
    }

}
