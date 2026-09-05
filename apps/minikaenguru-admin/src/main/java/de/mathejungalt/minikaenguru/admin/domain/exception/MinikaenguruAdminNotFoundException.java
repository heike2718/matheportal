package de.mathejungalt.minikaenguru.admin.domain.exception;

/**
 * MinikaenguruAdminNotFoundException.
 */
public class MinikaenguruAdminNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * MinikaenguruAdminNotFoundException.
     *
     * @param message String
     */
    public MinikaenguruAdminNotFoundException(final String message) {
        super(message);
    }

}
