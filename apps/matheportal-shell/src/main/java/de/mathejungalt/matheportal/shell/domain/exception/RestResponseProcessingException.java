package de.mathejungalt.matheportal.shell.domain.exception;

public class RestResponseProcessingException extends RuntimeException {

    public RestResponseProcessingException(final String message) {
        super(message);
    }

    public RestResponseProcessingException(final String message, final Throwable cause) {
        super(message, cause);
    }

}
