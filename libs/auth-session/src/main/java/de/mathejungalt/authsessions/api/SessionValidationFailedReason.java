package de.mathejungalt.authsessions.api;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * SessionValidationFailedReason
 */
public enum SessionValidationFailedReason {

    /** Session abgelaufen */
    @JsonProperty("expired")
    EXPIRED,

    /** keine Session vorhanden */
    @JsonProperty("missing")
    MISSING;

}
