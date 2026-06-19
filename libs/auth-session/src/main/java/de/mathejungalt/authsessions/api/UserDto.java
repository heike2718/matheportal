package de.mathejungalt.authsessions.api;

import java.util.Set;

/**
 * UserDto.
 *
 * @param fullName String
 * @param roles    Set
 */
public record UserDto(String fullName, Set<String> roles) {
}
