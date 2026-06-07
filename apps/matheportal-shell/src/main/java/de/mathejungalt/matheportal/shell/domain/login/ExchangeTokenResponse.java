package de.mathejungalt.matheportal.shell.domain.login;

import java.util.Map;

import de.mathejungalt.matheportal.shell.domain.clientauth.ResponsePayload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * ExchangeTokenResponse. Die Antwort des Tauschs des accessTokens gegen das JWT.
 */
@Data
@Builder
@AllArgsConstructor
public class ExchangeTokenResponse {

    private String nonce;

    private String jwt;

    /**
     * Mapped data aus dem responsePayload.
     *
     * @param responsePayload ResponsePayload
     * @return ExchangeTokenResponse
     */
    public static ExchangeTokenResponse from(final ResponsePayload responsePayload) {
        @SuppressWarnings("unchecked")
        final Map<String, String> dataMap = (Map<String, String>) responsePayload.getData();
        return ExchangeTokenResponse.builder().nonce(dataMap.get("nonce")).jwt(dataMap.get("jwt")).build();
    }

    /**
     * ExchangeTokenResponse.
     */
    ExchangeTokenResponse() {
        super();
        // wegen JavaDoc strict
    }

}
