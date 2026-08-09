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

import static org.mockito.ArgumentMatchers.anyString;
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
        assertEquals("Dieser Benutzer ist bereits als Wettbewerbsdurchführender registriert.", exception.getMessage());
        verify(privatpersonAnlegenDelegate, never()).privatpersonAnlegen();
        verify(lehrpersonAnlegenDelegate, never()).lehrpersonAnlegen(anyString());
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

        // act
        service.wettbewerbsdurchfuehrendenAnlegen(request);

        // assert
        verify(privatpersonAnlegenDelegate).privatpersonAnlegen();
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

        // act
        service.wettbewerbsdurchfuehrendenAnlegen(request);

        // assert
        verify(lehrpersonAnlegenDelegate).lehrpersonAnlegen("A1234567");
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
