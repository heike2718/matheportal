package de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AuthorizationTestService {

    @KuerzelZugriff("Testzugriff auf Teilnahme")
    String loadTeilnahme(@AuthorizationKey final String kuerzel) {

        return "Teilnahme geladen";
    }

    @KuerzelZugriff("Fehlender AuthorizationKey")
    void withoutAuthorizationKey(final String kuerzel) {
    }

    @KuerzelZugriff("Mehrere AuthorizationKeys")
    void withMultipleAuthorizationKeys(@AuthorizationKey final String schulkuerzel,
            @AuthorizationKey final String privatkuerzel) {
    }

    @KuerzelZugriff("Ungültiger Parametertyp")
    void withInvalidAuthorizationKey(@AuthorizationKey final Long id) {
    }

    @KuerzelZugriff
    void withoutAuditContext(@AuthorizationKey final String kuerzel) {
    }
}
