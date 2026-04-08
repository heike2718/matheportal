package de.mathejungalt.authsessions.api.exceptions;

/**
 * InvalidTokenException.
 */
public class InvalidTokenException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public InvalidTokenException(final String message, final Throwable cause) {
        super(message, cause);
    }

}
