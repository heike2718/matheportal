package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ZugangsberechtigungUnterlagen;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class WettbewerbsdurchfuehrendeMappingDelegateMappingTests {

    // Wanduhr zeigt die Stunde des Instant an mit ZoneId Z, also UTC (Greenwitch)
    // damit man mental nicht rechnen muss, gehen wir auf UTC
    // In PROD sagt die Systemzeit UTC, die env-Variable für die Zeitzone verschiebt
    // es für LocalDateTime.now(clock) auf die Wanduhrzeit von Berlin.
    private final Clock fixedClock = Clock.fixed(Instant.parse("2026-04-08T10:15:30Z"), ZoneOffset.UTC);

    private final WettbewerbsdurchfuehrendeMappingDelegate mappingDelegate = new WettbewerbsdurchfuehrendeMappingDelegate();

    @Test
    void should_createEntity_privat_work() {

        // arrange
        final String userUuid = "uuid-1";
        final String kuerzel = "A1234567";
        final Wettbewerbsdurchfuehrungsart durchfuehrungsart = Wettbewerbsdurchfuehrungsart.PRIVAT;
        final LocalDateTime now = LocalDateTime.now(fixedClock);

        // act
        final WettbewerbsdurchfuehrenderEntity result = mappingDelegate
                .createWettbewerbsdurchfuehrendeEntity(userUuid, kuerzel, durchfuehrungsart, now);

        // assert
        assertAll(() -> assertEquals("A1234567", result.getPrivatkuerzel()),
                () -> assertEquals(Wettbewerbsdurchfuehrungsart.PRIVAT, result.getArt()),
                () -> assertEquals("uuid-1", result.getUserUuid()), () -> assertFalse(result.isNewsletterEmpfaenger()),
                () -> assertEquals(ZugangsberechtigungUnterlagen.STANDARD, result.getZugangsberechtigungUnterlagen()),
                () -> assertNull(result.getSchulkuerzel()),
                () -> assertEquals(LocalDateTime.of(2026, 4, 8, 10, 15, 30), result.getCreatedAt()),
                () -> assertEquals(LocalDateTime.of(2026, 4, 8, 10, 15, 30), result.getUpdatedAt()));

    }

    @Test
    void should_createEntity_schule_work() {

        // arrange
        final String userUuid = "uuid-1";
        final String kuerzel = "A1234567";
        final Wettbewerbsdurchfuehrungsart durchfuehrungsart = Wettbewerbsdurchfuehrungsart.SCHULE;
        final LocalDateTime now = LocalDateTime.now(fixedClock);

        // act
        final WettbewerbsdurchfuehrenderEntity result = mappingDelegate
                .createWettbewerbsdurchfuehrendeEntity(userUuid, kuerzel, durchfuehrungsart, now);

        // assert
        assertAll(() -> assertEquals("A1234567", result.getSchulkuerzel()),
                () -> assertEquals(Wettbewerbsdurchfuehrungsart.SCHULE, result.getArt()),
                () -> assertEquals("uuid-1", result.getUserUuid()), () -> assertFalse(result.isNewsletterEmpfaenger()),
                () -> assertEquals(ZugangsberechtigungUnterlagen.STANDARD, result.getZugangsberechtigungUnterlagen()),
                () -> assertNull(result.getPrivatkuerzel()),
                () -> assertEquals(LocalDateTime.of(2026, 4, 8, 10, 15, 30), result.getCreatedAt()),
                () -> assertEquals(LocalDateTime.of(2026, 4, 8, 10, 15, 30), result.getUpdatedAt()));

    }

    @Test
    void should_mapToWettbewerbsdurchfuehrender_privat_work() {

        // arrange
        final WettbewerbsdurchfuehrenderEntity entity = WettbewerbsdurchfuehrenderEntity
                .builder()
                .newsletterEmpfaenger(true)
                .privatkuerzel("A123456789")
                .art(Wettbewerbsdurchfuehrungsart.PRIVAT)
                .zugangsberechtigungUnterlagen(ZugangsberechtigungUnterlagen.ERTEILT)
                .build();

        // act
        final Wettbewerbsdurchfuehrender result = mappingDelegate.mapToWettbewerbsdurchfuehrender(entity, "uuid-1");

        // assert

        assertAll(() -> assertEquals(Wettbewerbsdurchfuehrungsart.PRIVAT, result.getDurchfuehrungsart()),
                () -> assertEquals(ZugangsberechtigungUnterlagen.ERTEILT, result.getZugangsberechtigungUnterlagen()),
                () -> assertEquals(1, result.getTeilnahmenummern().size()),
                () -> assertEquals("A123456789", result.getTeilnahmenummern().iterator().next()),
                () -> assertTrue(result.getNewsletter()));
    }

    @Test
    void should_mapToWettbewerbsdurchfuehrender_schule_work() {

        // arrange
        final WettbewerbsdurchfuehrenderEntity entity = WettbewerbsdurchfuehrenderEntity
                .builder()
                .newsletterEmpfaenger(false)
                .schulkuerzel("A1234567,Z7654321")
                .art(Wettbewerbsdurchfuehrungsart.SCHULE)
                .zugangsberechtigungUnterlagen(ZugangsberechtigungUnterlagen.ENTZOGEN)
                .build();

        // act
        final Wettbewerbsdurchfuehrender result = mappingDelegate.mapToWettbewerbsdurchfuehrender(entity, "uuid-1");

        // assert

        assertAll(() -> assertEquals(Wettbewerbsdurchfuehrungsart.SCHULE, result.getDurchfuehrungsart()),
                () -> assertEquals(ZugangsberechtigungUnterlagen.ENTZOGEN, result.getZugangsberechtigungUnterlagen()),
                () -> assertEquals(2, result.getTeilnahmenummern().size()),
                () -> assertTrue(result.getTeilnahmenummern().contains("A1234567")),
                () -> assertTrue(result.getTeilnahmenummern().contains("Z7654321")),
                () -> assertFalse(result.getNewsletter()));
    }
}
