package de.mathejungalt.minikaenguru.anwendung.domain.exception;

/**
 * VeranstalterNotFoundException.
 */
public class VeranstalterNotFoundException extends RuntimeException {

    /**
     * VeranstalterNotFoundException.
     */
    public VeranstalterNotFoundException() {
        super();
    }

    /**
     * VeranstalterNotFoundException.
     *
     * @param message String
     */
    public VeranstalterNotFoundException(final String message) {
        super(message);
    }

}
