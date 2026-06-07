package de.mathejungalt.matheportal.shell.domain.exception;

/**
 * LoginSecurityException.
 */
public class LoginSecurityException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * LoginSecurityException.
     *
     * @param message String
     */
    public LoginSecurityException(final String message) {
        super(message);
    }

    /**
     * LoginSecurityException.
     *
     * @param message String
     * @param cause   Throwable
     */
    public LoginSecurityException(final String message, final Throwable cause) {
        super(message, cause);
    }

}
