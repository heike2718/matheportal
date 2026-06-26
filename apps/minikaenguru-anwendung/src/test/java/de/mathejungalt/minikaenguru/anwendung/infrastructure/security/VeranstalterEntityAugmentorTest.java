package de.mathejungalt.minikaenguru.anwendung.infrastructure.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.authsessions.api.SessionFacade;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.VeranstalterDao;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class VeranstalterEntityAugmentorTest {

    @Mock
    VeranstalterDao veranstalterDao;

    @Mock
    SessionFacade sessionFacade;

    @InjectMocks
    VeranstalterEntityAugmentor augmentor;

    @Test
    void should_throwIllegalStateException_when_sessionId_missing() {

        // arrange
        final SecurityIdentity securityIdentity = mock(SecurityIdentity.class);
        when(securityIdentity.getAttribute(SecurityIdentityAttributeKeys.SESSION_ID)).thenReturn(null);

        // act
        final IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> augmentor.augment(securityIdentity));

        // assert

        assertAll(
                () -> assertEquals(
                        "Attribut sessionId fehlt in der SecurityIdentity. SessionIdIdentityProvider pruefen!",
                        exception.getMessage()),
                () -> verify(veranstalterDao, never()).findByUserUuid(anyString()),
                () -> verify(sessionFacade, never()).augmentSession(anyString(), anySet()),
                () -> verify(sessionFacade, never()).markSessionAugmentationChecked(anyString()));
    }
}
