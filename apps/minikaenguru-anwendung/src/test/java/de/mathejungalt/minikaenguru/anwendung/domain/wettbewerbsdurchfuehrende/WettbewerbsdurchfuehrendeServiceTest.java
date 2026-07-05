package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

import jakarta.persistence.PersistenceException;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.quarkus.security.identity.SecurityIdentity;

import org.hibernate.exception.ConstraintViolationException;

import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruRuntimeException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ZugangsberechtigungUnterlagen;
import de.mathejungalt.minikaenguru.anwendung.domain.kuerzelgenerierung.KuerzelGeneratorService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.TestPrincipalAdapter;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WettbewerbsdurchfuehrendeServiceTest {

    // Wanduhr zeigt die Stunde des Instant an mit ZoneId Z, also UTC (Greenwitch)
    // damit man mental nicht rechnen muss, gehen wir auf UTC
    // In PROD sagt die Systemzeit UTC, die env-Variable für die Zeitzone verschiebt
    // es für LocalDateTime.now(clock) auf die Wanduhrzeit von Berlin.
    private final Clock fixedClock = Clock.fixed(Instant.parse("2026-04-08T10:15:30Z"), ZoneOffset.UTC);

    @Mock
    KuerzelGeneratorService kuerzelGeneratorService;

    @Mock
    SecurityIdentity securityIdentity;

    @Mock
    WettbewerbsdurchfuehrenderDao wettbewerbsdurchfuehrenderDao;

    @Mock
    Clock clock;

    @InjectMocks
    WettbewerbsdurchfuehrendeService service;

    @Nested
    class CreateWettbewerbsdurchfuehrendePrivatEntityTests {
        @Test
        void should_createWettbewerbsdurchfuehrendePrivatEntity_work() {
            // arrange
            doReturn(fixedClock.instant()).when(clock).instant();
            doReturn(fixedClock.getZone()).when(clock).getZone();

            when(kuerzelGeneratorService.generatePrivatteilnahmekuerzel()).thenReturn("A123456789");
            when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter("uuid"));

            // act
            final WettbewerbsdurchfuehrenderEntity resulEntity = service.createWettbewerbsdurchfuehrendePrivatEntity();

            // assert
            assertAll(() -> verify(kuerzelGeneratorService).generatePrivatteilnahmekuerzel(),
                    () -> verify(securityIdentity).getPrincipal(),
                    () -> assertEquals("A123456789", resulEntity.getPrivatkuerzel()),
                    () -> assertEquals("uuid", resulEntity.getUserUuid()),
                    () -> assertFalse(resulEntity.isNewsletterEmpfaenger()),
                    () -> assertEquals(ZugangsberechtigungUnterlagen.STANDARD,
                            resulEntity.getZugangsberechtigungUnterlagen()),
                    () -> assertNull(resulEntity.getSchulkuerzel()),
                    () -> assertEquals(LocalDateTime.of(2026, 4, 8, 10, 15, 30), resulEntity.getCreatedAt()),
                    () -> assertEquals(LocalDateTime.of(2026, 4, 8, 10, 15, 30), resulEntity.getUpdatedAt()));

        }

        @Test
        void should_createWettbewerbsdurchfuehrendePrivatEntity_throw_an_exception_when_kuerzel_null() {

            // arrange
            when(kuerzelGeneratorService.generatePrivatteilnahmekuerzel()).thenReturn(null);

            // act
            final MinikaenguruRuntimeException exception = assertThrows(MinikaenguruRuntimeException.class,
                    () -> service.createWettbewerbsdurchfuehrendePrivatEntity());

            // assert
            assertAll(() -> verify(kuerzelGeneratorService).generatePrivatteilnahmekuerzel(),
                    () -> verify(securityIdentity, never()).getPrincipal(),
                    () -> assertEquals(
                            "Es konnte nach 5 Versuchen kein neues eindeutiges Privatkürzel generiert werden.",
                            exception.getMessage()));
        }

    }

    @Nested
    class PrivatpersonAnlegenTests {
        @Test
        void should_privatpersonAnlegen_work_when_no_cve_at_all() {

            doReturn(fixedClock.instant()).when(clock).instant();
            doReturn(fixedClock.getZone()).when(clock).getZone();

            when(kuerzelGeneratorService.generatePrivatteilnahmekuerzel()).thenReturn("A123456789");
            when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter("uuid"));

            final WettbewerbsdurchfuehrenderEntity entity = WettbewerbsdurchfuehrenderEntity
                    .builder()
                    .newsletterEmpfaenger(false)
                    .privatkuerzel("A123456789")
                    .zugangsberechtigungUnterlagen(ZugangsberechtigungUnterlagen.STANDARD)
                    .typ(Wettbewerbsdurchfuehrungsart.PRIVAT)
                    .userUuid("uuid")
                    .build();

            when(wettbewerbsdurchfuehrenderDao.saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)))
                    .thenReturn(entity);

            // act
            final Wettbewerbsdurchfuehrender result = service.privatpersonAnlegen();

            // assert
            assertNotNull(result);

        }

        @Test
        void should_privatpersonAnlegen_retry_when_duplicate_privatkuerzel() {

            // arrange
            doReturn(fixedClock.instant()).when(clock).instant();
            doReturn(fixedClock.getZone()).when(clock).getZone();

            when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter("uuid-1"));

            when(wettbewerbsdurchfuehrenderDao.findByUserUuid("uuid-1")).thenReturn(Optional.empty());

            when(kuerzelGeneratorService.generatePrivatteilnahmekuerzel())
                    .thenReturn("A123456789", "B123456789", "C123456789", "D123456789", "E123456789");

            final ConstraintViolationException cvException = new ConstraintViolationException("message", null,
                    "uk_wettbewerbsdurchfuehrende_privatkuerzel");

            when(wettbewerbsdurchfuehrenderDao.saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)))
                    .thenThrow(new PersistenceException(cvException))
                    .thenThrow(new PersistenceException(cvException))
                    .thenThrow(new PersistenceException(cvException))
                    .thenThrow(new PersistenceException(cvException))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            // act
            final Wettbewerbsdurchfuehrender result = service.privatpersonAnlegen();

            // assert
            assertAll(() -> assertEquals("E123456789", result.getTeilnahmenummern().iterator().next()),
                    () -> verify(wettbewerbsdurchfuehrenderDao, times(5))
                            .saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)));
        }

        @Test
        void should_privatpersonAnlegen_terminate_after_5_retries_when_duplicate_privatkuerzel() {
            // arrange
            doReturn(fixedClock.instant()).when(clock).instant();
            doReturn(fixedClock.getZone()).when(clock).getZone();

            when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter("uuid-1"));

            when(wettbewerbsdurchfuehrenderDao.findByUserUuid("uuid-1")).thenReturn(Optional.empty());

            when(kuerzelGeneratorService.generatePrivatteilnahmekuerzel())
                    .thenReturn("A123456789", "B123456789", "C123456789", "D123456789", "E123456789");

            final ConstraintViolationException cvException = new ConstraintViolationException("message", null,
                    "uk_wettbewerbsdurchfuehrende_privatkuerzel");

            when(wettbewerbsdurchfuehrenderDao.saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)))
                    .thenThrow(new PersistenceException(cvException))
                    .thenThrow(new PersistenceException(cvException))
                    .thenThrow(new PersistenceException(cvException))
                    .thenThrow(new PersistenceException(cvException))
                    .thenThrow(new PersistenceException(cvException));

            // act
            final MinikaenguruRuntimeException exception = assertThrows(MinikaenguruRuntimeException.class,
                    () -> service.privatpersonAnlegen());

            assertAll(() -> assertEquals(
                    "Konnte nach 5 Versuchen kein eindeutiges privatkuerzel für wettbewerbsdurchfuegernden generieren, gebe auf",
                    exception.getMessage()),
                    () -> verify(wettbewerbsdurchfuehrenderDao, times(5))
                            .saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)));
        }

        @Test
        void should_privatpersonAnlegen_terminate_when_other_cv_violated() {
            doReturn(fixedClock.instant()).when(clock).instant();
            doReturn(fixedClock.getZone()).when(clock).getZone();

            when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter("uuid-1"));

            when(wettbewerbsdurchfuehrenderDao.findByUserUuid("uuid-1")).thenReturn(Optional.empty());

            when(kuerzelGeneratorService.generatePrivatteilnahmekuerzel()).thenReturn("A123456789");

            final ConstraintViolationException cvException = new ConstraintViolationException("message", null,
                    "uk_wettbewerbsdurchfuehrende_user_uuid");

            final PersistenceException persistenceException = new PersistenceException("user_uuid muss eindeutig sein",
                    cvException);

            when(wettbewerbsdurchfuehrenderDao.saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)))
                    .thenThrow(persistenceException);

            // act
            final MinikaenguruRuntimeException exception = assertThrows(MinikaenguruRuntimeException.class,
                    () -> service.privatpersonAnlegen());

            assertAll(
                    () -> assertEquals(
                            "Beim Anlegen einer Privatperson ist ein Fehler aufgetreten: user_uuid muss eindeutig sein",
                            exception.getMessage()),
                    () -> verify(wettbewerbsdurchfuehrenderDao)
                            .saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)));
        }

        @Test
        void should_privatpersonAnlegen_terminate_when_other_PersistenceException_wothout_cause() {
            doReturn(fixedClock.instant()).when(clock).instant();
            doReturn(fixedClock.getZone()).when(clock).getZone();

            when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter("uuid-1"));

            when(wettbewerbsdurchfuehrenderDao.findByUserUuid("uuid-1")).thenReturn(Optional.empty());

            when(kuerzelGeneratorService.generatePrivatteilnahmekuerzel()).thenReturn("A123456789");

            final PersistenceException persistenceException = new PersistenceException("schlimm, schlimm, schlimm");

            when(wettbewerbsdurchfuehrenderDao.saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)))
                    .thenThrow(persistenceException);

            // act
            final MinikaenguruRuntimeException exception = assertThrows(MinikaenguruRuntimeException.class,
                    () -> service.privatpersonAnlegen());

            assertAll(
                    () -> assertEquals(
                            "Beim Anlegen einer Privatperson ist ein Fehler aufgetreten: schlimm, schlimm, schlimm",
                            exception.getMessage()),
                    () -> verify(wettbewerbsdurchfuehrenderDao)
                            .saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)));
        }
    }

    @Nested
    class MappingTests {

        @Test
        void should_mapToWettbewerbsdurchfuehrender_work_when_typ_privat() {
            // arrange
            final WettbewerbsdurchfuehrenderEntity entity = WettbewerbsdurchfuehrenderEntity
                    .builder()
                    .newsletterEmpfaenger(false)
                    .privatkuerzel("A123456789")
                    .zugangsberechtigungUnterlagen(ZugangsberechtigungUnterlagen.ENTZOGEN)
                    .typ(Wettbewerbsdurchfuehrungsart.PRIVAT)
                    .userUuid("uuid")
                    .build();

            // act
            final Wettbewerbsdurchfuehrender result = service.mapToWettbewerbsdurchfuehrender(entity);

            // assert
            assertAll(() -> assertEquals(Wettbewerbsdurchfuehrungsart.PRIVAT, result.getDurchfuehrungsart()),
                    () -> assertEquals(ZugangsberechtigungUnterlagen.ENTZOGEN,
                            result.getZugangsberechtigungUnterlagen()),
                    () -> assertFalse(result.getNewsletter()),
                    () -> assertEquals(1, result.getTeilnahmenummern().size()),
                    () -> assertEquals("A123456789", result.getTeilnahmenummern().iterator().next()));
        }

        @Test
        void should_mapToWettbewerbsdurchfuehrender_work_when_typ_schule() {
            // arrange
            final WettbewerbsdurchfuehrenderEntity entity = WettbewerbsdurchfuehrenderEntity
                    .builder()
                    .newsletterEmpfaenger(true)
                    .schulkuerzel("A1234567,B7654321")
                    .zugangsberechtigungUnterlagen(ZugangsberechtigungUnterlagen.ERTEILT)
                    .typ(Wettbewerbsdurchfuehrungsart.SCHULE)
                    .userUuid("uuid")
                    .build();

            // act
            final Wettbewerbsdurchfuehrender result = service.mapToWettbewerbsdurchfuehrender(entity);

            // assert
            assertAll(() -> assertEquals(Wettbewerbsdurchfuehrungsart.SCHULE, result.getDurchfuehrungsart()),
                    () -> assertEquals(ZugangsberechtigungUnterlagen.ERTEILT,
                            result.getZugangsberechtigungUnterlagen()),
                    () -> assertTrue(result.getNewsletter()),
                    () -> assertEquals(2, result.getTeilnahmenummern().size()),
                    () -> assertTrue(result.getTeilnahmenummern().contains("A1234567")),
                    () -> assertTrue(result.getTeilnahmenummern().contains("B7654321")));
        }
    }
}
