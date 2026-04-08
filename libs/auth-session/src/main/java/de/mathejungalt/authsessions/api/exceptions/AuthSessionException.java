package de.mathejungalt.authsessions.api.exceptions;

/**
 * AuthSessionException.
 */
public class AuthSessionException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public AuthSessionException(final String message, final Throwable cause) {
        super(message, cause);
    }

}
