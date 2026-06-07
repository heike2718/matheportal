package de.mathejungalt.minikaenguru.anwendung.domain.security;

import java.util.HashMap;
import java.util.Map;

import io.quarkus.security.identity.request.AuthenticationRequest;

/**
 * SessionIdAuthenticationRequest.
 */
public final class SessionIdAuthenticationRequest implements AuthenticationRequest {

    private final String sessionId;

    private final Map<String, Object> attributes = new HashMap<>();

    public SessionIdAuthenticationRequest(final String sessionId) {
        this.sessionId = sessionId;
    }

    @Override
    @SuppressWarnings("unchecked")
    public <T> T getAttribute(final String name) {
        return (T) attributes.get(name);
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public void setAttribute(final String name, final Object value) {
        attributes.put(name, value);
    }

    public String getSessionId() {
        return sessionId;
    }
}
