package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.SchulkollegiumsmitgliedEntity;

import lombok.extern.slf4j.Slf4j;

@ApplicationScoped
@Slf4j
public class SchulkollegiumDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * Gibt eine Liste von SchulkollegiumsmitgliedEntity mit der gegebenen userUuid zurück.
     *
     * @param userUuid
     * @return List
     */
    public List<SchulkollegiumsmitgliedEntity> findAllForUser(final String userUuid) {

        return entityManager
                .createNamedQuery(SchulkollegiumsmitgliedEntity.FIND_BY_UUID, SchulkollegiumsmitgliedEntity.class)
                .setParameter("userUuid", userUuid)
                .getResultList();
    }

    /**
     * Gibt eine Liste von SchulkollegiumsmitgliedEntity mit der gegebenen userUuid zurück.
     *
     * @param userUuid
     * @return List
     */
    public List<SchulkollegiumsmitgliedEntity> findAllForSchule(final String schulkuerzel) {

        return entityManager
                .createNamedQuery(SchulkollegiumsmitgliedEntity.FIND_BY_SCHULKUERZEL,
                        SchulkollegiumsmitgliedEntity.class)
                .setParameter("schulkuerzel", schulkuerzel)
                .getResultList();
    }

    /**
     * Sucht den eindeutig durch das schulkuerzel und die userUuid bestimmten Eintrag.
     *
     * @param userUuid     String
     * @param schulkuerzel String
     * @return Optional
     */
    public Optional<SchulkollegiumsmitgliedEntity> findForUserAndSchule(final String userUuid,
            final String schulkuerzel) {

        final List<SchulkollegiumsmitgliedEntity> resulList = entityManager
                .createNamedQuery(SchulkollegiumsmitgliedEntity.FIND_BY_SCHULKUERZEL,
                        SchulkollegiumsmitgliedEntity.class)
                .setParameter("schulkuerzel", schulkuerzel)
                .getResultList();

        if (resulList.isEmpty()) {
            return Optional.empty();
        }

        if (resulList.size() > 1) {
            log
                    .error("mehr als ein Treffer in schulkollegien mit user_uuid = {} und kuerzel_schule {} - unmöglich wegen UK.",
                            userUuid, schulkuerzel);
        }

        return Optional.of(resulList.getFirst());

    }

    /**
     * Erzeugt einen neuen Eintrag in schulkollegien
     *
     * @param entity SchulkollegiumsmitgliedEntity
     * @return Long die technische Id
     */
    public Long insertEntity(final SchulkollegiumsmitgliedEntity entity) {

        entityManager.persist(entity);
        return entity.getId();
    }

}
