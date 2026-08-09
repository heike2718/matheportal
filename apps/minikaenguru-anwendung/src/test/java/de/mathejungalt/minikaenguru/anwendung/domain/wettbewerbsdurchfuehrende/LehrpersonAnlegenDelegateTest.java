package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.kuerzelgenerierung.KuerzelGeneratorService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.SchulkollegiumDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;

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
    LehrpersonAnlegenDelegate service;

    @Mock
    AugmentSessionDelegate augmentationDelegate;

}
