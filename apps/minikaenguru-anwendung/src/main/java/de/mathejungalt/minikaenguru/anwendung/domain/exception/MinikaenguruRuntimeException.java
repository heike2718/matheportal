package de.mathejungalt.minikaenguru.anwendung.domain.exception;

/**
 * MinikaenguruRuntimeException.
 */
public class MinikaenguruRuntimeException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * MinikaenguruRuntimeException
     *
     * @param message String
     */
    public MinikaenguruRuntimeException(final String message) {
        super(message);
    }

    /**
     * MinikaenguruRuntimeException.
     *
     * @param message String
     * @param cause   Throwable
     */
    public MinikaenguruRuntimeException(final String message, final Throwable cause) {
        super(message, cause);
    }

}
