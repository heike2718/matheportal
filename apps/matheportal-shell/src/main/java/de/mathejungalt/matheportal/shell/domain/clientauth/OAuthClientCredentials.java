package de.mathejungalt.matheportal.shell.domain.clientauth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * OAuthClientCredentials.
 */
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthClientCredentials {

    @NotBlank
    @Pattern(regexp = "[a-zA-Z0-9+=]*")
    @Size(max = 50)
    private String clientId;

    @NotBlank
    @Pattern(regexp = "[a-zA-Z0-9+=]*")
    @Size(max = 50)
    private String clientSecret;

    @Pattern(regexp = "^[a-zA-Z0-9\\-]*$")
    @Size(max = 36)
    private String nonce;

}
