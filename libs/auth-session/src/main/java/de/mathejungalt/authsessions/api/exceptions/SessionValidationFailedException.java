package de.mathejungalt.authsessions.api.exceptions;

import de.mathejungalt.authsessions.api.SessionValidationFailedReason;

/**
 * SessionValidationFailedException.
 */
public class SessionValidationFailedException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final SessionValidationFailedReason reason;

    /**
     * @param message String
     * @param reason  SessionValidationFailedReason
     */
    public SessionValidationFailedException(final SessionValidationFailedReason reason) {
        super(reason.name());
        this.reason = reason;
    }

    public SessionValidationFailedReason getReason() {
        return this.reason;
    }

}
