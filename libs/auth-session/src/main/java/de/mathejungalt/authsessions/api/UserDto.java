package de.mathejungalt.authsessions.api;

import java.util.Set;

/**
 * UserDto.
 *
 * @param fullName       String
 * @param berechtigungen Set
 */
public record UserDto(String fullName, Set<String> berechtigungen) {
}
