package de.mathejungalt.minikaenguru.anwendung.domain.authorization;

/**
 * MinikaenguruAuthorizationException
 */
public class MinikaenguruAuthorizationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * MinikaenguruAuthorizationException.
     *
     * @param message String
     */
    public MinikaenguruAuthorizationException(final String message) {
        super(message);
    }

}
