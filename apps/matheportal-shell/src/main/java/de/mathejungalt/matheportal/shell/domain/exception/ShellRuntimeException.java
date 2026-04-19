package de.mathejungalt.matheportal.shell.domain.exception;

/**
 * ShellRuntimeException
 */
public class ShellRuntimeException extends RuntimeException {

    public ShellRuntimeException(final String message) {
        super(message);
    }

    public ShellRuntimeException(final String message, final Throwable cause) {
        super(message, cause);
    }

}
