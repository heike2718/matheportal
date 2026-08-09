package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruConflictException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.WettbewerbsdurchfuehrenderRequest;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ZugangsberechtigungUnterlagen;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.TestPrincipalAdapter;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WettbewerbsdurchfuehrendeServiceTest {

    @Mock
    SecurityIdentity securityIdentity;

    @Mock
    PrivatpersonAnlegenDelegate privatpersonAnlegenDelegate;

    @Mock
    LehrpersonAnlegenDelegate lehrpersonAnlegenDelegate;

    @Mock
    WettbewerbsdurchfuehrenderDao wettbewerbsdurchfuehrenderDao;

    @Mock
    AugmentSessionDelegate augmentationDelegate;

    @InjectMocks
    WettbewerbsdurchfuehrendeService service;

    @Test
    void should_loadDurchfuehrenden_returnNull_when_uuid_is_unknown() {

        // arrange
        final String uuid = "uuid-1";
        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter(uuid));
        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(uuid)).thenReturn(Optional.empty());

        // act
        final Wettbewerbsdurchfuehrender result = service.loadDurchfuehrenden();

        // assert
        assertAll(() -> assertNull(result), () -> verify(securityIdentity).getPrincipal(),
                () -> verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(uuid));

    }

    @Test
    void should_loadDurchfuehrenden_returnDurchfuehrenden_when_uuid_is_known() {

        // arrange
        final String uuid = "uuid-1";

        final WettbewerbsdurchfuehrenderEntity entity = createEntity();

        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter(uuid));
        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(uuid)).thenReturn(Optional.of(entity));

        // act
        final Wettbewerbsdurchfuehrender result = service.loadDurchfuehrenden();

        // assert
        assertAll(() -> assertNotNull(result), () -> verify(securityIdentity, times(2)).getPrincipal(),
                () -> verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(uuid));

    }

    @Test
    void should_wettbewerbsdurchfuehrendenAnlegen_throwConflict_when_exists() {

        // arrange
        final String uuid = "uuid-1";
        final WettbewerbsdurchfuehrenderEntity entity = createEntity();
        final WettbewerbsdurchfuehrenderRequest request = new WettbewerbsdurchfuehrenderRequest()
                .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.SCHULE)
                .schulkuerzel("A1234567");

        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter(uuid));
        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(uuid)).thenReturn(Optional.of(entity));

        // act
        final MinikaenguruConflictException exception = assertThrows(MinikaenguruConflictException.class,
                () -> service.wettbewerbsdurchfuehrendenAnlegen(request));

        // assert
        assertAll(
                () -> assertEquals("Dieser Benutzer ist bereits als Wettbewerbsdurchführender registriert.",
                        exception.getMessage()),
                () -> verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(uuid),
                () -> verify(privatpersonAnlegenDelegate, never()).privatpersonAnlegen(),
                () -> verify(lehrpersonAnlegenDelegate, never()).lehrpersonAnlegen(anyString()),
                () -> verify(augmentationDelegate, never()).augmentSession(any(Wettbewerbsdurchfuehrungsart.class)));
    }

    @Test
    void should_wettbewerbsdurchfuehrendenAnlegen_propagateException_from_load() {

        // arrange
        final String uuid = "uuid-1";
        final WettbewerbsdurchfuehrenderRequest request = new WettbewerbsdurchfuehrenderRequest()
                .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.PRIVAT);

        final RuntimeException runtimeException = new RuntimeException("schlimmer fehler");

        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter(uuid));
        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(uuid)).thenThrow(runtimeException);

        // act
        final RuntimeException exception = assertThrows(RuntimeException.class,
                () -> service.wettbewerbsdurchfuehrendenAnlegen(request));

        // assert
        assertAll(() -> assertEquals("schlimmer fehler", exception.getMessage()),
                () -> verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(uuid),
                () -> verify(privatpersonAnlegenDelegate, never()).privatpersonAnlegen(),
                () -> verify(lehrpersonAnlegenDelegate, never()).lehrpersonAnlegen(anyString()),
                () -> verify(augmentationDelegate, never()).augmentSession(any(Wettbewerbsdurchfuehrungsart.class)));
    }

    @Test
    void should_wettbewerbsdurchfuehrendenAnlegen_propagateException_from_privat() {

        // arrange
        final String uuid = "uuid-1";
        final WettbewerbsdurchfuehrenderRequest request = new WettbewerbsdurchfuehrenderRequest()
                .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.PRIVAT);

        final RuntimeException runtimeException = new RuntimeException("schlimmer fehler");

        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter(uuid));
        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(uuid)).thenReturn(Optional.empty());
        when(privatpersonAnlegenDelegate.privatpersonAnlegen()).thenThrow(runtimeException);

        // act
        final RuntimeException exception = assertThrows(RuntimeException.class,
                () -> service.wettbewerbsdurchfuehrendenAnlegen(request));

        // assert
        assertAll(() -> assertEquals("schlimmer fehler", exception.getMessage()),
                () -> verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(uuid),
                () -> verify(privatpersonAnlegenDelegate).privatpersonAnlegen(),
                () -> verify(augmentationDelegate, never()).augmentSession(any(Wettbewerbsdurchfuehrungsart.class)));
    }

    @Test
    void should_wettbewerbsdurchfuehrendenAnlegen_propagateException_from_lehrer() {

        // arrange
        final String uuid = "uuid-1";
        final WettbewerbsdurchfuehrenderRequest request = new WettbewerbsdurchfuehrenderRequest()
                .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.SCHULE)
                .schulkuerzel("A1234567");

        final RuntimeException runtimeException = new RuntimeException("schlimmer fehler");

        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter(uuid));
        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(uuid)).thenReturn(Optional.empty());
        when(lehrpersonAnlegenDelegate.lehrpersonAnlegen("A1234567")).thenThrow(runtimeException);

        // act
        final RuntimeException exception = assertThrows(RuntimeException.class,
                () -> service.wettbewerbsdurchfuehrendenAnlegen(request));

        // assert
        assertAll(() -> assertEquals("schlimmer fehler", exception.getMessage()),
                () -> verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(uuid),
                () -> verify(lehrpersonAnlegenDelegate).lehrpersonAnlegen(anyString()),
                () -> verify(augmentationDelegate, never()).augmentSession(any(Wettbewerbsdurchfuehrungsart.class)));
    }

    @Test
    void should_wettbewerbsdurchfuehrendenAnlegen_delegate_when_privat() {

        // arrange
        final String uuid = "uuid-1";
        final WettbewerbsdurchfuehrenderRequest request = new WettbewerbsdurchfuehrenderRequest()
                .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.PRIVAT);

        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter(uuid));
        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(uuid)).thenReturn(Optional.empty());
        when(privatpersonAnlegenDelegate.privatpersonAnlegen()).thenReturn(new Wettbewerbsdurchfuehrender());
        doNothing().when(augmentationDelegate).augmentSession(Wettbewerbsdurchfuehrungsart.PRIVAT);

        // act
        service.wettbewerbsdurchfuehrendenAnlegen(request);

        // assert
        assertAll(() -> verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(uuid),
                () -> verify(privatpersonAnlegenDelegate).privatpersonAnlegen(),
                () -> verify(augmentationDelegate).augmentSession(Wettbewerbsdurchfuehrungsart.PRIVAT));
    }

    @Test
    void should_wettbewerbsdurchfuehrendenAnlegen_delegate_when_schule() {

        // arrange
        final String uuid = "uuid-1";
        final WettbewerbsdurchfuehrenderRequest request = new WettbewerbsdurchfuehrenderRequest()
                .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.SCHULE)
                .schulkuerzel("A1234567");

        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter(uuid));
        when(wettbewerbsdurchfuehrenderDao.findByUserUuid(uuid)).thenReturn(Optional.empty());
        when(lehrpersonAnlegenDelegate.lehrpersonAnlegen("A1234567")).thenReturn(new Wettbewerbsdurchfuehrender());
        doNothing().when(augmentationDelegate).augmentSession(Wettbewerbsdurchfuehrungsart.SCHULE);

        // act
        service.wettbewerbsdurchfuehrendenAnlegen(request);

        // assert
        assertAll(() -> verify(wettbewerbsdurchfuehrenderDao).findByUserUuid(uuid),
                () -> verify(lehrpersonAnlegenDelegate).lehrpersonAnlegen("A1234567"),
                () -> verify(augmentationDelegate).augmentSession(Wettbewerbsdurchfuehrungsart.SCHULE));
    }

    private WettbewerbsdurchfuehrenderEntity createEntity() {
        return WettbewerbsdurchfuehrenderEntity
                .builder()
                .newsletterEmpfaenger(false)
                .schulkuerzel("A1234567,Z7654321")
                .art(Wettbewerbsdurchfuehrungsart.SCHULE)
                .zugangsberechtigungUnterlagen(ZugangsberechtigungUnterlagen.ENTZOGEN)
                .build();
    }

}
