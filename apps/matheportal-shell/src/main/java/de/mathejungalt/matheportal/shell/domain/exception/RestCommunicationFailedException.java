package de.mathejungalt.matheportal.shell.domain.exception;

/**
 * RestCommunicationFailedException.
 */
public class RestCommunicationFailedException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * @param message String
     * @param cause   Throwable
     */
    public RestCommunicationFailedException(final String message, final Throwable cause) {
        super(message, cause);
    }

}
