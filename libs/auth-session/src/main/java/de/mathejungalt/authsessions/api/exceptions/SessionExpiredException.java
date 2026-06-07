package de.mathejungalt.authsessions.api.exceptions;

/**
 * SessionExpiredException
 */
public class SessionExpiredException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * @param message String
     */
    public SessionExpiredException(final String message) {
        super(message);
    }

}
