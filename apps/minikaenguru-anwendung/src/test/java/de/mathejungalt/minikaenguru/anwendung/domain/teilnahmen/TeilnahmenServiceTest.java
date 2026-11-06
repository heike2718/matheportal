package de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen;

import java.security.Principal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventService;
import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventType;
import de.mathejungalt.minikaenguru.anwendung.domain.authorization.MinikaenguruAuthorizationException;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruConflictException;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.ResourceNotFoundException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Auswertungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Teilnahme;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsstatus;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerb.WettbewerbService;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende.WettbewerbsdurchfuehrendeService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.CountDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.TeilnahmeDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.TeilnahmeEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * TeilnahmenServiceTest.
 */
@ExtendWith(MockitoExtension.class)
public class TeilnahmenServiceTest {

    private static final String USER_UUID = "abcdef-123456";

    // Wanduhr zeigt die Stunde des Instant an mit ZoneId Z, also UTC (Greenwitch)
    // damit man mental nicht rechnen muss, gehen wir auf UTC
    // In PROD sagt die Systemzeit UTC, die env-Variable für die Zeitzone verschiebt
    // es für LocalDateTime.now(clock) auf die Wanduhrzeit von Berlin.
    private final Clock fixedClock = Clock.fixed(Instant.parse("2026-04-08T10:15:30Z"), ZoneOffset.UTC);

    private Principal principal;

    @Mock
    SecurityIdentity securityIdentity;

    @Mock
    WettbewerbService wettbewerbService;

    @Mock
    WettbewerbsdurchfuehrendeService wettbewerbsdurchfuehrendeService;

    @Mock
    TeilnahmeDao teilnahmeDao;

    @Mock
    CountDao countDao;

    @Mock
    Clock clock;

    @Mock
    AuditEventService auditEventService;

    @InjectMocks
    TeilnahmenService teilnahmenService;

    @BeforeEach
    void setUp() {

        principal = new Principal() {

            @Override
            public String getName() {
                return USER_UUID;
            }

        };
    }

    @Nested
    class PrivatteilnahmeTests {

        private static final String KUERZEL = "P123456789";

        @ParameterizedTest
        @EnumSource(value = Wettbewerbsstatus.class, names = { "ANMELDUNG", "DOWNLOAD_LEHRER", "DOWNLOAD_PRIVAT" })
        void should_createPrivatteilnahme_work(final Wettbewerbsstatus wettbewerbsstatus) {

            // arrange
            doReturn(fixedClock.instant()).when(clock).instant();
            doReturn(fixedClock.getZone()).when(clock).getZone();

            when(securityIdentity.getPrincipal()).thenReturn(principal);

            final WettbewerbsdurchfuehrenderEntity privatperson = WettbewerbsdurchfuehrenderEntity
                    .builder()
                    .art(Wettbewerbsdurchfuehrungsart.PRIVAT)
                    .privatkuerzel(KUERZEL)
                    .build();

            when(wettbewerbsdurchfuehrendeService.loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()))
                    .thenReturn(privatperson);

            final Wettbewerb aktuellerWettbewerb = new Wettbewerb().status(wettbewerbsstatus).jahr(2026);
            when(wettbewerbService.loadAktuellenWettbewerb()).thenReturn(aktuellerWettbewerb);

            when(teilnahmeDao.loadTeilnahmereferenzen(KUERZEL)).thenReturn(new ArrayList<>());
            doNothing().when(teilnahmeDao).insertTeilnahme(any(TeilnahmeEntity.class));

            // act
            final Teilnahme teilnahme = teilnahmenService.privatteilnahmeAnlegen();

            // assert
            assertAll(() -> assertNotNull(teilnahme), () -> assertEquals(KUERZEL, teilnahme.getKuerzel()),
                    () -> assertEquals(2026, teilnahme.getJahr()),
                    () -> assertEquals(Auswertungsart.ONLINE, teilnahme.getAuswertungsart()),
                    () -> assertEquals(Wettbewerbsdurchfuehrungsart.PRIVAT, teilnahme.getDurchfuehrungsart()),
                    () -> assertNull(teilnahme.getAngemeldetDurch()),
                    () -> assertEquals(0, teilnahme.getAnzahlKinder()),
                    () -> assertEquals(0, teilnahme.getAnzahlKlassen()),
                    () -> assertEquals(0, teilnahme.getAnzahlLoesungszettel()),
                    () -> assertEquals("08.04.2026 10:15:30", teilnahme.getAngemeldetAm()),
                    () -> verify(securityIdentity).getPrincipal(),
                    () -> verify(wettbewerbService).loadAktuellenWettbewerb(),
                    () -> verify(wettbewerbsdurchfuehrendeService)
                            .loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()),
                    () -> verify(teilnahmeDao).loadTeilnahmereferenzen(KUERZEL),
                    () -> verify(teilnahmeDao).insertTeilnahme(any(TeilnahmeEntity.class)));

        }

        @ParameterizedTest
        @EnumSource(value = Wettbewerbsstatus.class, names = { "ERFASST", "BEENDET" })
        void should_createPrivatteilnahme_throwConflictException_because_of_wettbewerbsstatus(
                final Wettbewerbsstatus wettbewerbsstatus) {

            // arrange
            when(securityIdentity.getPrincipal()).thenReturn(principal);

            final WettbewerbsdurchfuehrenderEntity privatperson = WettbewerbsdurchfuehrenderEntity
                    .builder()
                    .art(Wettbewerbsdurchfuehrungsart.PRIVAT)
                    .privatkuerzel(KUERZEL)
                    .build();

            when(wettbewerbsdurchfuehrendeService.loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()))
                    .thenReturn(privatperson);

            final Wettbewerb aktuellerWettbewerb = new Wettbewerb().status(wettbewerbsstatus).jahr(2026);
            when(wettbewerbService.loadAktuellenWettbewerb()).thenReturn(aktuellerWettbewerb);

            // act
            final MinikaenguruConflictException exception = assertThrows(MinikaenguruConflictException.class,
                    () -> teilnahmenService.privatteilnahmeAnlegen());

            // assert
            assertAll(() -> assertEquals("Der aktuelle Wettbewerb lässt keine Anmeldung zu.", exception.getMessage()),
                    () -> verify(securityIdentity).getPrincipal(),
                    () -> verify(wettbewerbService).loadAktuellenWettbewerb(),
                    () -> verify(wettbewerbsdurchfuehrendeService)
                            .loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()),
                    () -> verify(teilnahmeDao, never()).loadTeilnahmereferenzen(KUERZEL),
                    () -> verify(teilnahmeDao, never()).insertTeilnahme(any(TeilnahmeEntity.class)));

        }

        @ParameterizedTest
        @EnumSource(value = Wettbewerbsstatus.class, names = { "ANMELDUNG", "DOWNLOAD_LEHRER", "DOWNLOAD_PRIVAT" })
        void should_createPrivatteilnahme_throwConflictException_when_teilnahmeExists(
                final Wettbewerbsstatus wettbewerbsstatus) {

            // arrange
            when(securityIdentity.getPrincipal()).thenReturn(principal);

            final WettbewerbsdurchfuehrenderEntity privatperson = WettbewerbsdurchfuehrenderEntity
                    .builder()
                    .art(Wettbewerbsdurchfuehrungsart.PRIVAT)
                    .privatkuerzel(KUERZEL)
                    .build();

            when(wettbewerbsdurchfuehrendeService.loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()))
                    .thenReturn(privatperson);

            final Wettbewerb aktuellerWettbewerb = new Wettbewerb().status(wettbewerbsstatus).jahr(2026);
            when(wettbewerbService.loadAktuellenWettbewerb()).thenReturn(aktuellerWettbewerb);

            final TeilnahmeReferenz aktuelleReferenz = new TeilnahmeReferenz().jahr(2026).teilnahmenummer(KUERZEL);

            when(teilnahmeDao.loadTeilnahmereferenzen(KUERZEL)).thenReturn(List.of(aktuelleReferenz));

            // act
            final MinikaenguruConflictException exception = assertThrows(MinikaenguruConflictException.class,
                    () -> teilnahmenService.privatteilnahmeAnlegen());

            // assert
            assertAll(
                    () -> assertEquals("Sie haben sich bereits zum aktuellen Wettbewerb angemeldet.",
                            exception.getMessage()),
                    () -> verify(securityIdentity).getPrincipal(),
                    () -> verify(wettbewerbService).loadAktuellenWettbewerb(),
                    () -> verify(wettbewerbsdurchfuehrendeService)
                            .loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()),
                    () -> verify(teilnahmeDao).loadTeilnahmereferenzen(KUERZEL),
                    () -> verify(teilnahmeDao, never()).insertTeilnahme(any(TeilnahmeEntity.class)));
        }

        @Test
        void should_createPrivatteilnahme_throwAuthorizationException_when_keine_Minikaenguruberechtigung() {

            // arrange
            when(securityIdentity.getPrincipal()).thenReturn(principal);

            when(wettbewerbsdurchfuehrendeService.loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()))
                    .thenThrow(new MinikaenguruAuthorizationException("uiuiui"));

            // act
            final MinikaenguruAuthorizationException exception = assertThrows(MinikaenguruAuthorizationException.class,
                    () -> teilnahmenService.privatteilnahmeAnlegen());

            // assert
            assertAll(() -> assertEquals("uiuiui", exception.getMessage()),
                    () -> verify(securityIdentity).getPrincipal(),
                    () -> verify(wettbewerbService, never()).loadAktuellenWettbewerb(),
                    () -> verify(wettbewerbsdurchfuehrendeService)
                            .loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()),
                    () -> verify(teilnahmeDao, never()).loadTeilnahmereferenzen(KUERZEL),
                    () -> verify(teilnahmeDao, never()).insertTeilnahme(any(TeilnahmeEntity.class)),
                    () -> verify(auditEventService, never()).recordAuditEvent(any(AuditEventType.class), anyString()));
        }

        @Test
        void should_createPrivatteilnahme_throwAuthorizationException_when_durchfuehrender_lehrperson() {

            // arrange
            doNothing().when(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());
            when(securityIdentity.getPrincipal()).thenReturn(principal);

            final WettbewerbsdurchfuehrenderEntity lehrperson = WettbewerbsdurchfuehrenderEntity
                    .builder()
                    .art(Wettbewerbsdurchfuehrungsart.SCHULE)
                    .schulkuerzel("S1234567")
                    .build();

            when(wettbewerbsdurchfuehrendeService.loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()))
                    .thenReturn(lehrperson);

            // act
            final MinikaenguruAuthorizationException exception = assertThrows(MinikaenguruAuthorizationException.class,
                    () -> teilnahmenService.privatteilnahmeAnlegen());

            // assert
            assertAll(
                    () -> assertEquals("Sie können sich nicht privat zum Minikänguru-Wettbewerb anmelden.",
                            exception.getMessage()),
                    () -> verify(securityIdentity).getPrincipal(),
                    () -> verify(wettbewerbService, never()).loadAktuellenWettbewerb(),
                    () -> verify(wettbewerbsdurchfuehrendeService)
                            .loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()),
                    () -> verify(teilnahmeDao, never()).loadTeilnahmereferenzen(KUERZEL),
                    () -> verify(teilnahmeDao, never()).insertTeilnahme(any(TeilnahmeEntity.class)),
                    () -> verify(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString()));
        }

        @Test
        void should_loadAktuellePrivatteilnahme_work() {

            final WettbewerbsdurchfuehrenderEntity privatperson = WettbewerbsdurchfuehrenderEntity
                    .builder()
                    .art(Wettbewerbsdurchfuehrungsart.PRIVAT)
                    .privatkuerzel(KUERZEL)
                    .build();

            when(wettbewerbsdurchfuehrendeService.loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()))
                    .thenReturn(privatperson);

            final Wettbewerb aktuellerWettbewerb = new Wettbewerb()
                    .status(Wettbewerbsstatus.DOWNLOAD_PRIVAT)
                    .jahr(2026);
            when(wettbewerbService.loadAktuellenWettbewerb()).thenReturn(aktuellerWettbewerb);

            when(countDao.getAnzahlLoesungszettelByTeilnahmekuerzelAndJahr(KUERZEL, 2026)).thenReturn(3);
            when(countDao.getAnzahlKinderByTeilnahmekuerzel(KUERZEL)).thenReturn(4);

            final TeilnahmeEntity teilnahmeEntity = TeilnahmeEntity
                    .builder()
                    .auswertungsart(Auswertungsart.ONLINE)
                    .createdAt(LocalDateTime.now(fixedClock))
                    .id(25L)
                    .jahr(2026)
                    .teilnahmeart(Wettbewerbsdurchfuehrungsart.PRIVAT)
                    .teilnahmekuerzel(KUERZEL)
                    .version(0)
                    .build();

            when(teilnahmeDao.findTeilnahmeByUniqueKey(KUERZEL, 2026)).thenReturn(teilnahmeEntity);

            // act
            final Teilnahme teilnahme = teilnahmenService.loadAktuellePrivatteilnahme();

            // assert
            assertAll(() -> assertEquals("08.04.2026 10:15:30", teilnahme.getAngemeldetAm()),
                    () -> assertNull(teilnahme.getAngemeldetDurch()),
                    () -> assertEquals(4, teilnahme.getAnzahlKinder()),
                    () -> assertEquals(0, teilnahme.getAnzahlKlassen()),
                    () -> assertEquals(3, teilnahme.getAnzahlLoesungszettel()),
                    () -> assertEquals(Auswertungsart.ONLINE, teilnahme.getAuswertungsart()),
                    () -> assertEquals(Wettbewerbsdurchfuehrungsart.PRIVAT, teilnahme.getDurchfuehrungsart()),
                    () -> assertEquals(2026, teilnahme.getJahr()), () -> assertEquals(KUERZEL, teilnahme.getKuerzel()),
                    () -> verify(wettbewerbsdurchfuehrendeService)
                            .loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()),
                    () -> verify(wettbewerbService).loadAktuellenWettbewerb(),
                    () -> verify(teilnahmeDao).findTeilnahmeByUniqueKey(KUERZEL, 2026),
                    () -> verify(countDao).getAnzahlLoesungszettelByTeilnahmekuerzelAndJahr(KUERZEL, 2026),
                    () -> verify(countDao).getAnzahlKinderByTeilnahmekuerzel(KUERZEL),
                    () -> verify(countDao, never()).getAnzahlKlassenByKuerzelSchule(KUERZEL));
        }

        @Test
        void should_loadAktuellePrivatteilnahme_throwAuthorizationException_when_keine_Minikaenguruberechtigung() {

            when(wettbewerbsdurchfuehrendeService.loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()))
                    .thenThrow(new MinikaenguruAuthorizationException("uiuiui"));

            // act
            final MinikaenguruAuthorizationException exception = assertThrows(MinikaenguruAuthorizationException.class,
                    () -> teilnahmenService.loadAktuellePrivatteilnahme());

            // assert
            assertAll(() -> assertEquals("uiuiui", exception.getMessage()),
                    () -> verify(wettbewerbService, never()).loadAktuellenWettbewerb(),
                    () -> verify(wettbewerbsdurchfuehrendeService)
                            .loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()),
                    () -> verify(teilnahmeDao, never()).findTeilnahmeByUniqueKey(KUERZEL, 2026),
                    () -> verify(auditEventService, never()).recordAuditEvent(any(AuditEventType.class), anyString()),
                    () -> verify(countDao, never()).getAnzahlLoesungszettelByTeilnahmekuerzelAndJahr(KUERZEL, 2026),
                    () -> verify(countDao, never()).getAnzahlKinderByTeilnahmekuerzel(KUERZEL),
                    () -> verify(countDao, never()).getAnzahlKlassenByKuerzelSchule(KUERZEL));

        }

        @Test
        void should_loadAktuellePrivatteilnahme_throwAuthorizationException_when_durchfuehrender_lehrperson() {

            // arrange
            doNothing().when(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());

            final WettbewerbsdurchfuehrenderEntity lehrperson = WettbewerbsdurchfuehrenderEntity
                    .builder()
                    .art(Wettbewerbsdurchfuehrungsart.SCHULE)
                    .schulkuerzel("S1234567")
                    .build();

            when(wettbewerbsdurchfuehrendeService.loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()))
                    .thenReturn(lehrperson);

            // act
            final MinikaenguruAuthorizationException exception = assertThrows(MinikaenguruAuthorizationException.class,
                    () -> teilnahmenService.loadAktuellePrivatteilnahme());

            // assert
            assertAll(() -> assertEquals("Sie können keine Privatteilnahmen laden.", exception.getMessage()),
                    () -> verify(wettbewerbService, never()).loadAktuellenWettbewerb(),
                    () -> verify(wettbewerbsdurchfuehrendeService)
                            .loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()),
                    () -> verify(teilnahmeDao, never()).findTeilnahmeByUniqueKey(KUERZEL, 2026),
                    () -> verify(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString()));

        }

        @Test
        void should_loadAktuellePrivatteilnahme_throw_() {
            final WettbewerbsdurchfuehrenderEntity privatperson = WettbewerbsdurchfuehrenderEntity
                    .builder()
                    .art(Wettbewerbsdurchfuehrungsart.PRIVAT)
                    .privatkuerzel(KUERZEL)
                    .build();

            when(wettbewerbsdurchfuehrendeService.loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()))
                    .thenReturn(privatperson);

            final Wettbewerb aktuellerWettbewerb = new Wettbewerb()
                    .status(Wettbewerbsstatus.DOWNLOAD_PRIVAT)
                    .jahr(2026);
            when(wettbewerbService.loadAktuellenWettbewerb()).thenReturn(aktuellerWettbewerb);

            when(teilnahmeDao.findTeilnahmeByUniqueKey(KUERZEL, 2026)).thenReturn(null);

            // act
            final ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                    () -> teilnahmenService.loadAktuellePrivatteilnahme());

            // assert
            assertAll(
                    () -> assertEquals("Diese Resource gibt es leider nicht oder nicht mehr.", exception.getMessage()),
                    () -> verify(wettbewerbService).loadAktuellenWettbewerb(),
                    () -> verify(wettbewerbsdurchfuehrendeService)
                            .loadWettbewerbsdurchfuehrendenAndAuditMissing(anyString()),
                    () -> verify(teilnahmeDao).findTeilnahmeByUniqueKey(KUERZEL, 2026),
                    () -> verify(auditEventService, never()).recordAuditEvent(any(AuditEventType.class), anyString()),
                    () -> verify(countDao, never()).getAnzahlLoesungszettelByTeilnahmekuerzelAndJahr(KUERZEL, 2026),
                    () -> verify(countDao, never()).getAnzahlKinderByTeilnahmekuerzel(KUERZEL),
                    () -> verify(countDao, never()).getAnzahlKlassenByKuerzelSchule(KUERZEL));

        }
    }

}
