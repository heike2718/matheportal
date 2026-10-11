package de.mathejungalt.minikaenguru.anwendung.domain.auditevents;

import java.time.Clock;
import java.time.LocalDateTime;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.AuditEventDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.AuditEventEntity;

/**
 * AuditEventService.
 */
@ApplicationScoped
public class AuditEventService {

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    Clock clock;

    @Inject
    AuditEventDao auditEventDao;

    /**
     * Zeichnet ein audit event auf.
     *
     * @param type    AuditEventType
     * @param context String
     */
    public void recordAuditEvent(final AuditEventType type, final String context) {

        final LocalDateTime now = LocalDateTime.now(clock);
        final String userUuid = securityIdentity.getPrincipal().getName();

        final AuditEventEntity entity = AuditEventEntity
                .builder()
                .eventType(type)
                .userUuid(userUuid)
                .context(context)
                .createdAt(now)
                .build();

        auditEventDao.insertAuditEvent(entity);

    }

}
