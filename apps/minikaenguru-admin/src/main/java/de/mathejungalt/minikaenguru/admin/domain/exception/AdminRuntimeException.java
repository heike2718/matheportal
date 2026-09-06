package de.mathejungalt.minikaenguru.admin.domain.exception;

/**
 * AdminRuntimeException.
 */
public class AdminRuntimeException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * AdminRuntimeException.
     *
     * @param message String
     */
    public AdminRuntimeException(final String message) {
        super(message);
    }

    /**
     * AdminRuntimeException.
     *
     * @param message String
     * @param cause   Throwable
     */
    public AdminRuntimeException(final String message, final Throwable cause) {
        super(message, cause);
    }

}
