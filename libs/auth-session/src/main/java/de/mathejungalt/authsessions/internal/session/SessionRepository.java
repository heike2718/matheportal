package de.mathejungalt.authsessions.internal.session;

import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import io.quarkus.hibernate.orm.PersistenceUnit;

import org.jspecify.annotations.NonNull;

import de.mathejungalt.authsessions.internal.session.entities.SessionEntity;

/**
 * SessionRepository
 */
@ApplicationScoped
public class SessionRepository {

    @Inject
    @PersistenceUnit("sessions")
    EntityManager entityManager;

    /**
     * Sucht das Objekt mit der gegebenen sessionId.
     *
     * @param sessionId String
     * @return Optional
     */
    public Optional<SessionEntity> findBySessionId(final String sessionId) {

        final List<@NonNull SessionEntity> resultList = entityManager
                .createNamedQuery(SessionEntity.FIND_BY_SESSION_ID, SessionEntity.class)
                .setParameter("sessionId", sessionId)
                .getResultList();

        if (resultList.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(resultList.getFirst());
    }

    /**
     * Insert oder Update.
     *
     * @param sessionEntity SessionEntity
     */
    @Transactional
    public void saveSession(final SessionEntity sessionEntity) {

        if (sessionEntity.getId() == null) {
            entityManager.persist(sessionEntity);
        } else {
            entityManager.merge(sessionEntity);
        }
    }

    /**
     * Löscht die Session.
     *
     * @param sessionEntity SessionEntity
     */
    public void deleteSession(final SessionEntity sessionEntity) {
        if (sessionEntity == null) {
            return;
        }
        entityManager.remove(sessionEntity);
    }

}
