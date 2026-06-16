package de.mathejungalt.authsessions.api;

/**
 * SessionValidationFailedDto.
 *
 * @param reason SessionValidationFailedReason
 */
public record SessionValidationFailedDto(SessionValidationFailedReason reason) {
}
