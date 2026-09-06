package de.mathejungalt.minikaenguru.admin.domain.exception;

/**
 * AdminNotFoundException.
 */
public class AdminNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * AdminNotFoundException.
     *
     * @param message String
     */
    public AdminNotFoundException(final String message) {
        super(message);
    }

}
