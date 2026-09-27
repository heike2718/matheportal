package de.mathejungalt.minikaenguru.anwendung.domain.authorization;

import java.security.Principal;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventService;
import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventType;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthorizationServiceTest {

    private static final String USER_UUID = "abcdef";

    private static final String KUERZEL = "K1234567";

    private static final String CONTEXT = "Testkontext";

    private final Principal principal = new Principal() {

        @Override
        public String getName() {
            return USER_UUID;
        }

    };

    @Mock
    SecurityIdentity securityIdentity;

    @Mock
    AuditEventService auditEventService;

    @Mock
    WettbewerbsdurchfuehrenderDao wettbewerbsdurchfuehrenderDao;

    @InjectMocks
    AuthorizationService authorizationService;

    @Test
    void should_not_throw_an_exception_when_zugriff_erlaubt_mit_SCHULE() {

        // arrange
        when(securityIdentity.getPrincipal()).thenReturn(principal);

        final WettbewerbsdurchfuehrenderEntity entity = WettbewerbsdurchfuehrenderEntity
                .builder()
                .art(Wettbewerbsdurchfuehrungsart.SCHULE)
                .userUuid(USER_UUID)
                .schulkuerzel("I7654321,K1234567")
                .build();

        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(USER_UUID)).thenReturn(Optional.of(entity));

        // act
        authorizationService.checkAuthorization(KUERZEL, CONTEXT);

        // assert
        verify(auditEventService, never()).recordAuditEvent(any(AuditEventType.class), anyString());
        verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(USER_UUID);

    }

    @Test
    void should_not_throw_an_exception_when_zugriff_erlaubt_mit_PRIVAT() {

        // arrange
        when(securityIdentity.getPrincipal()).thenReturn(principal);

        final WettbewerbsdurchfuehrenderEntity entity = WettbewerbsdurchfuehrenderEntity
                .builder()
                .art(Wettbewerbsdurchfuehrungsart.PRIVAT)
                .userUuid(USER_UUID)
                .privatkuerzel("K1234567")
                .build();

        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(USER_UUID)).thenReturn(Optional.of(entity));

        // act
        authorizationService.checkAuthorization(KUERZEL, CONTEXT);

        // assert
        verify(auditEventService, never()).recordAuditEvent(any(AuditEventType.class), anyString());
        verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(USER_UUID);

    }

    @Test
    void should_throw_an_exception_when_wettbewerbsdurchfuehrender_does_not_exist() {

        // arrange
        when(securityIdentity.getPrincipal()).thenReturn(principal);
        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(USER_UUID)).thenReturn(Optional.empty());
        doNothing().when(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());

        // act
        final MinikaenguruAuthorizationException exception = assertThrows(MinikaenguruAuthorizationException.class,
                () -> authorizationService.checkAuthorization(KUERZEL, CONTEXT));

        // assert
        verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(USER_UUID);
        verify(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());

        assertEquals(
                "Testkontext - Benutzer mit dieser uuid ist kein Wettbewerbsdurchführender. Zugriff auf Entität mit kuerzel K1234567",
                exception.getMessage());

    }

    @Test
    void should_throw_an_exception_when_wettbewerbsdurchfuehrender_SCHULE_with_other_schulkuerzel() {

        // arrange
        when(securityIdentity.getPrincipal()).thenReturn(principal);

        final WettbewerbsdurchfuehrenderEntity entity = WettbewerbsdurchfuehrenderEntity
                .builder()
                .art(Wettbewerbsdurchfuehrungsart.SCHULE)
                .userUuid(USER_UUID)
                .schulkuerzel("I7654321,Z1234567")
                .build();

        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(USER_UUID)).thenReturn(Optional.of(entity));
        doNothing().when(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());

        // act
        final MinikaenguruAuthorizationException exception = assertThrows(MinikaenguruAuthorizationException.class,
                () -> authorizationService.checkAuthorization(KUERZEL, CONTEXT));

        // assert
        verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(USER_UUID);
        verify(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());

        assertEquals("Testkontext - Zugriff auf Entität mit kuerzel K1234567", exception.getMessage());

    }

    @Test
    void should_throw_an_exception_when_wettbewerbsdurchfuehrender_PRIVAT_with_other_schulkuerzel() {

        // arrange
        when(securityIdentity.getPrincipal()).thenReturn(principal);

        final WettbewerbsdurchfuehrenderEntity entity = WettbewerbsdurchfuehrenderEntity
                .builder()
                .art(Wettbewerbsdurchfuehrungsart.PRIVAT)
                .userUuid(USER_UUID)
                .privatkuerzel("K123456789")
                .build();

        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(USER_UUID)).thenReturn(Optional.of(entity));
        doNothing().when(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());

        // act
        final MinikaenguruAuthorizationException exception = assertThrows(MinikaenguruAuthorizationException.class,
                () -> authorizationService.checkAuthorization(KUERZEL, CONTEXT));

        // assert
        verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(USER_UUID);
        verify(auditEventService).recordAuditEvent(any(AuditEventType.class), anyString());

        assertEquals("Testkontext - Zugriff auf Entität mit kuerzel K1234567", exception.getMessage());

    }

}
