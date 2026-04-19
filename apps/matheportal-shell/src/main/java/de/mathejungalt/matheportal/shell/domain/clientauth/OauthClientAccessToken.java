package de.mathejungalt.matheportal.shell.domain.clientauth;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * OauthClientAccessToken. Wrapped das generische ResponsePayload, um den Code
 * im ClientAccessTokenService klarer zu machen.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OauthClientAccessToken {

    private String nonce;
    private String accessToken;

    public static OauthClientAccessToken from(final ResponsePayload payload) {
        @SuppressWarnings("unchecked")
        final Map<String, String> dataMap = (Map<String, String>) payload.getData();
        return new OauthClientAccessToken(dataMap.get("nonce"), dataMap.get("accessToken"));
    }

}
