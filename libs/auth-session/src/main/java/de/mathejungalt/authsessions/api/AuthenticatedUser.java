package de.mathejungalt.authsessions.api;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AuthenticatedUser.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticatedUser {

    private String uuid;

    private String fullName;

    private Set<String> roles;
}
