package de.mathejungalt.authsessions.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * SessionDto.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionDto {

    private String sessionId;

    private AuthenticatedUser authenticatedUser;

    private SecurityIdentityAugmentationState augmentationState;

}
