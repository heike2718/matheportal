package de.mathejungalt.authsessions.internal.session;

import de.mathejungalt.authsessions.api.UserDto;
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

    private UserDto user;

}
