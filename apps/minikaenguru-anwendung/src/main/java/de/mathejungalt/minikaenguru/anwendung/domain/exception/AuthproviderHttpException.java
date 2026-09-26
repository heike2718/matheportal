package de.mathejungalt.minikaenguru.anwendung.domain.exception;

/**
 * AuthproviderHttpException.
 */
public class AuthproviderHttpException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final int status;

    public AuthproviderHttpException(final int status, final String message) {
        super(message);
        this.status = status;
    }

    public AuthproviderHttpException(final int status, final String message, final Throwable cause) {
        super(message, cause);
        this.status = status;
    }

    public int getStatus() {
        return this.status;
    }

}
