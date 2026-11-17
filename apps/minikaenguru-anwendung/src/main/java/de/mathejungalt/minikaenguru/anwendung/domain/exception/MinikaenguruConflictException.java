package de.mathejungalt.minikaenguru.anwendung.domain.exception;

/**
 * MinikaenguruConflictException.
 */
public class MinikaenguruConflictException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * MinikaenguruConflictException.
     *
     * @param message String
     */
    public MinikaenguruConflictException(final String message) {
        super(message);
    }

    /**
     * MinikaenguruConflictException.
     *
     * @param message String
     * @param cause   Throwable
     */
    public MinikaenguruConflictException(String message, Throwable cause) {
        super(message, cause);
    }

}
