package de.mathejungalt.authsessions.api.exceptions;

/**
 * InvalidJWTException.
 */
public class InvalidJWTException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * InvalidJWTException.
     *
     * @param message String
     * @param cause   Throwable
     */
    public InvalidJWTException(final String message, final Throwable cause) {
        super(message, cause);
    }

}
