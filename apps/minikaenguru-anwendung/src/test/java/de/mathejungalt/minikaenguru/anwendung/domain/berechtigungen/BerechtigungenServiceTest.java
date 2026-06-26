package de.mathejungalt.minikaenguru.anwendung.domain.berechtigungen;

import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.User;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.security.SecurityIdentityAttributeKeys;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * BerechtigungenService.
 */
@ExtendWith(MockitoExtension.class)
public class BerechtigungenServiceTest {

    @Mock
    SecurityIdentity securityIdentity;

    @InjectMocks
    BerechtigungenService berechtigungenService;

    @Test
    void should_createTheUser() {

        // arrange
        final Set<String> roles = Set.of("STANDARD", "LEHRER");

        when(securityIdentity.getAttribute(SecurityIdentityAttributeKeys.FULL_NAME)).thenReturn("David Hilbert");
        when(securityIdentity.getRoles()).thenReturn(roles);

        // act
        final User user = berechtigungenService.getUser();

        // assert
        final Set<String> berechtigungen = user.getBerechtigungen();
        assertAll(() -> assertEquals(2, berechtigungen.size()), () -> assertTrue(berechtigungen.contains("STANDARD")),
                () -> assertTrue(berechtigungen.contains("LEHRER")),
                () -> assertEquals("David Hilbert", user.getFullName()), () -> verify(securityIdentity).getRoles(),
                () -> verify(securityIdentity).getAttribute("fullName"));

    }

    @Test
    void should_throwIllegalStateException_when_fullName_missing() {

        // arrange
        when(securityIdentity.getAttribute(SecurityIdentityAttributeKeys.FULL_NAME)).thenReturn(null);

        // act
        final IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> berechtigungenService.getUser());

        // assert
        assertAll(() -> verify(securityIdentity).getAttribute("fullName"),
                () -> verify(securityIdentity, never()).getRoles(),
                () -> assertEquals(
                        "Attribut fullName fehlt in der SecurityIdentity. SessionIdIdentityProvider pruefen!",
                        exception.getMessage()));

    }
}
