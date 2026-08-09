package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.PersistenceException;

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
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PrivatpersonAnlegenDelegateTest {

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
    AugmentSessionDelegate augmentationDelegate;

    @Mock
    Clock clock;

    @InjectMocks
    PrivatpersonAnlegenDelegate delegate;

    @Test
    void should_privatpersonAnlegen_work_when_no_contstraintViolationInTheDB_at_all() {

        // arrange
        final Set<String> roles = new HashSet<>();
        roles.add("STANDARD");

        doReturn(fixedClock.instant()).when(clock).instant();
        doReturn(fixedClock.getZone()).when(clock).getZone();

        when(kuerzelGeneratorService.generatePrivatteilnahmekuerzel()).thenReturn("A123456789");

        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter("uuid-1"));

        doNothing().when(augmentationDelegate).augmentSession(Wettbewerbsdurchfuehrungsart.PRIVAT);

        final WettbewerbsdurchfuehrenderEntity entity = WettbewerbsdurchfuehrenderEntity
                .builder()
                .newsletterEmpfaenger(false)
                .privatkuerzel("A123456789")
                .zugangsberechtigungUnterlagen(ZugangsberechtigungUnterlagen.STANDARD)
                .art(Wettbewerbsdurchfuehrungsart.PRIVAT)
                .userUuid("uuid")
                .build();

        when(wettbewerbsdurchfuehrenderDao.saveEntity(any(WettbewerbsdurchfuehrenderEntity.class))).thenReturn(entity);

        // act
        final Wettbewerbsdurchfuehrender result = delegate.privatpersonAnlegen();

        // assert
        assertAll(() -> assertNotNull(result),
                () -> verify(kuerzelGeneratorService, times(1)).generatePrivatteilnahmekuerzel(),
                () -> verify(kuerzelGeneratorService, never()).generateSchulkatalogKuerzel(),
                () -> verify(securityIdentity, times(2)).getPrincipal(),
                () -> verify(augmentationDelegate).augmentSession(Wettbewerbsdurchfuehrungsart.PRIVAT));
    }

    @Test
    void should_privatpersonAnlegen_retry_when_duplicate_privatkuerzel() {

        // arrange
        doReturn(fixedClock.instant()).when(clock).instant();
        doReturn(fixedClock.getZone()).when(clock).getZone();

        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter("uuid-1"));

        doNothing().when(augmentationDelegate).augmentSession(Wettbewerbsdurchfuehrungsart.PRIVAT);

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
        final Wettbewerbsdurchfuehrender result = delegate.privatpersonAnlegen();

        // assert
        assertAll(() -> assertEquals("E123456789", result.getTeilnahmenummern().iterator().next()),
                () -> verify(wettbewerbsdurchfuehrenderDao, times(5))
                        .saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)),
                () -> verify(augmentationDelegate).augmentSession(Wettbewerbsdurchfuehrungsart.PRIVAT));
    }

    @Test
    void should_createWettbewerbsdurchfuehrendePrivatEntity_throw_an_exception_when_kuerzel_null() {

        // arrange
        when(kuerzelGeneratorService.generatePrivatteilnahmekuerzel()).thenReturn(null);

        // act
        final MinikaenguruRuntimeException exception = assertThrows(MinikaenguruRuntimeException.class,
                () -> delegate.createWettbewerbsdurchfuehrendePrivatEntity());

        // assert
        assertAll(() -> verify(kuerzelGeneratorService).generatePrivatteilnahmekuerzel(),
                () -> verify(securityIdentity, never()).getPrincipal(),
                () -> assertEquals("Es konnte nach 5 Versuchen kein neues eindeutiges Privatkürzel generiert werden.",
                        exception.getMessage()));
    }

    @Test
    void should_privatpersonAnlegen_terminate_after_5_retries_when_duplicate_privatkuerzel() {
        // arrange
        doReturn(fixedClock.instant()).when(clock).instant();
        doReturn(fixedClock.getZone()).when(clock).getZone();

        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter("uuid-1"));

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
                () -> delegate.privatpersonAnlegen());

        assertAll(() -> assertEquals(
                "Konnte nach 5 Versuchen kein eindeutiges privatkuerzel für wettbewerbsdurchfuegernden generieren, gebe auf",
                exception.getMessage()),
                () -> verify(wettbewerbsdurchfuehrenderDao, times(5))
                        .saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)),
                () -> verify(securityIdentity, never()).getAttribute(anyString()),
                () -> verify(securityIdentity, never()).getRoles(),
                () -> verify(augmentationDelegate, never()).augmentSession(any(Wettbewerbsdurchfuehrungsart.class)));
    }

    @Test
    void should_privatpersonAnlegen_terminate_when_other_cv_violated() {
        doReturn(fixedClock.instant()).when(clock).instant();
        doReturn(fixedClock.getZone()).when(clock).getZone();

        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter("uuid-1"));
        when(kuerzelGeneratorService.generatePrivatteilnahmekuerzel()).thenReturn("A123456789");

        final ConstraintViolationException cvException = new ConstraintViolationException("message", null,
                "uk_wettbewerbsdurchfuehrende_user_uuid");

        final PersistenceException persistenceException = new PersistenceException("user_uuid muss eindeutig sein",
                cvException);

        when(wettbewerbsdurchfuehrenderDao.saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)))
                .thenThrow(persistenceException);

        // act
        final MinikaenguruRuntimeException exception = assertThrows(MinikaenguruRuntimeException.class,
                () -> delegate.privatpersonAnlegen());

        assertAll(
                () -> assertEquals(
                        "Beim Anlegen einer Privatperson ist ein Fehler aufgetreten: user_uuid muss eindeutig sein",
                        exception.getMessage()),
                () -> verify(wettbewerbsdurchfuehrenderDao).saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)),
                () -> verify(securityIdentity, never()).getAttribute(anyString()),
                () -> verify(securityIdentity, never()).getRoles(), () -> verify(securityIdentity, never()).getRoles(),
                () -> verify(augmentationDelegate, never()).augmentSession(any(Wettbewerbsdurchfuehrungsart.class)));
    }

    @Test
    void should_privatpersonAnlegen_terminate_when_other_PersistenceException_without_cause() {
        doReturn(fixedClock.instant()).when(clock).instant();
        doReturn(fixedClock.getZone()).when(clock).getZone();

        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter("uuid-1"));
        when(kuerzelGeneratorService.generatePrivatteilnahmekuerzel()).thenReturn("A123456789");

        final PersistenceException persistenceException = new PersistenceException("schlimm, schlimm, schlimm");

        when(wettbewerbsdurchfuehrenderDao.saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)))
                .thenThrow(persistenceException);

        // act
        final MinikaenguruRuntimeException exception = assertThrows(MinikaenguruRuntimeException.class,
                () -> delegate.privatpersonAnlegen());

        assertAll(
                () -> assertEquals(
                        "Beim Anlegen einer Privatperson ist ein Fehler aufgetreten: schlimm, schlimm, schlimm",
                        exception.getMessage()),
                () -> verify(wettbewerbsdurchfuehrenderDao).saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)),
                () -> verify(securityIdentity, never()).getAttribute(anyString()),
                () -> verify(securityIdentity, never()).getRoles(), () -> verify(securityIdentity, never()).getRoles(),
                () -> verify(augmentationDelegate, never()).augmentSession(any(Wettbewerbsdurchfuehrungsart.class)));
    }
}
