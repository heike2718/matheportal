package de.mathejungalt.minikaenguru.anwendung.domain.exception;

/**
 * ResourceNotFoundException.
 */
public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * ResourceNotFoundException.
     *
     * @param message
     */
    public ResourceNotFoundException(final String message) {
        super(message);
    }

}
