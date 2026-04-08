package de.mathejungalt.authsessions.api;

import java.util.Set;

/**
 * UserDto.
 */
public record UserDto(String fullName, Set<String> roles, boolean anonym) {
}
