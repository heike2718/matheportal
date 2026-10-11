package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.AuditEventEntity;

/**
 * AuditEventDao.
 */
@ApplicationScoped
public class AuditEventDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * @param entity AuditEventEntity
     */
    @Transactional
    public void insertAuditEvent(final AuditEventEntity entity) {
        this.entityManager.persist(entity);
    }

}
