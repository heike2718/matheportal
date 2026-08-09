package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ZugangsberechtigungUnterlagen;
import de.mathejungalt.minikaenguru.anwendung.domain.kuerzelgenerierung.KuerzelGeneratorService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.SchulkollegiumDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.SchulkollegiumsmitgliedEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.TestPrincipalAdapter;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class LehrpersonAnlegenDelegateTest {

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
    SchulkollegiumDao schulkollegiumDao;

    @Mock
    Clock clock;

    @InjectMocks
    LehrpersonAnlegenDelegate delegate;

    @Test
    void should_lehrpersonAnlegen_work() {

        // arrange
        final String uuid = "uuid-1";
        final WettbewerbsdurchfuehrenderEntity entity = WettbewerbsdurchfuehrenderEntity
                .builder()
                .newsletterEmpfaenger(false)
                .schulkuerzel("A1234567")
                .zugangsberechtigungUnterlagen(ZugangsberechtigungUnterlagen.STANDARD)
                .art(Wettbewerbsdurchfuehrungsart.SCHULE)
                .userUuid(uuid)
                .build();

        when(wettbewerbsdurchfuehrenderDao.saveEntity(any(WettbewerbsdurchfuehrenderEntity.class))).thenReturn(entity);
        when(schulkollegiumDao.insertEntity(any(SchulkollegiumsmitgliedEntity.class))).thenReturn(314L);
        when(securityIdentity.getPrincipal()).thenReturn(new TestPrincipalAdapter(uuid));

        doReturn(fixedClock.instant()).when(clock).instant();
        doReturn(fixedClock.getZone()).when(clock).getZone();

        // act
        final Wettbewerbsdurchfuehrender result = delegate.lehrpersonAnlegen("A12345678");

        // assert
        assertAll(() -> assertNotNull(result),
                () -> verify(wettbewerbsdurchfuehrenderDao).saveEntity(any(WettbewerbsdurchfuehrenderEntity.class)),
                () -> verify(schulkollegiumDao).insertEntity(any(SchulkollegiumsmitgliedEntity.class)),
                () -> verify(securityIdentity).getPrincipal());

    }

}
