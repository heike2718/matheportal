package de.mathejungalt.matheportal.shell.infrastructure.restclient;

/**
 * AuthproviderHttpException.
 */
public final class AuthproviderHttpException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final int status;

    /**
     * AuthproviderHttpException.
     *
     * @param status  int
     * @param message String
     */
    public AuthproviderHttpException(final int status, final String message) {
        super(message);
        this.status = status;
    }

    /**
     * AuthproviderHttpException.
     *
     * @param status  int
     * @param message String
     * @param cause   Throwable
     */
    public AuthproviderHttpException(final int status, final String message, final Throwable cause) {
        super(message, cause);
        this.status = status;
    }

    public int getStatus() {
        return this.status;
    }

}
