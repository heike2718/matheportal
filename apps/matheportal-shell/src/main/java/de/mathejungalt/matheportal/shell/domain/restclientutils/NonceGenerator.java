package de.mathejungalt.matheportal.shell.domain.restclientutils;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

/**
 * NonceGenerator.
 */
@ApplicationScoped
public class NonceGenerator {

    /**
     * Generiert ein nonce.
     *
     * @return String
     */
    public String generateNonce() {
        return UUID.randomUUID().toString();
    }

}
