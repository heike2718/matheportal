package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.time.Clock;
import java.time.LocalDateTime;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.SchulkollegiumDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.SchulkollegiumsmitgliedEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * LehrpersonAnlegenDelegate. Übernimmt das Anlegen eines Wettbewerbsdurchführenden für eine Schule.
 */
@Slf4j
@ApplicationScoped
public class LehrpersonAnlegenDelegate {

    private final WettbewerbsdurchfuehrendeMappingDelegate mappingDelegate = new WettbewerbsdurchfuehrendeMappingDelegate();

    @Inject
    WettbewerbsdurchfuehrenderDao wettbewerbsdurchfuehrenderDao;

    @Inject
    SchulkollegiumDao schulkollegiumDao;

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    Clock clock;

    @Transactional
    Wettbewerbsdurchfuehrender lehrpersonAnlegen(final String schulkuerzel) {

        final LocalDateTime now = LocalDateTime.now(clock);
        final String userUuid = securityIdentity.getPrincipal().getName();

        final WettbewerbsdurchfuehrenderEntity entity = this.mappingDelegate
                .createWettbewerbsdurchfuehrendeEntity(userUuid, schulkuerzel, Wettbewerbsdurchfuehrungsart.SCHULE,
                        now);

        final SchulkollegiumsmitgliedEntity schulkollegiumsmitgliedEntity = SchulkollegiumsmitgliedEntity
                .builder()
                .createdAt(now)
                .userUuid(userUuid)
                .schulkuerzel(schulkuerzel)
                .build();

        schulkollegiumDao.insertEntity(schulkollegiumsmitgliedEntity);

        final WettbewerbsdurchfuehrenderEntity result = wettbewerbsdurchfuehrenderDao.saveEntity(entity);
        log.info("lehrperson angelegt - uuid = {}, schulkuerzel = {}", result.getUserUuid(), schulkuerzel);

        return this.mappingDelegate.mapToWettbewerbsdurchfuehrender(result, userUuid);
    }

}
