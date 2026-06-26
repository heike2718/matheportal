package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.VeranstalterEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * VeranstalterDao.
 */
@ApplicationScoped
@Slf4j
public class VeranstalterDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * VeranstalterDao.
     */
    VeranstalterDao() {
        super();
    }

    /**
     * Sucht einen Veranstalter anhand seiner (für veranstalter).
     *
     * @param userUuid
     * @return Optional
     */
    public Optional<VeranstalterEntity> findByUserUuid(final String userUuid) {

        final List<VeranstalterEntity> resultList = entityManager
                .createNamedQuery(VeranstalterEntity.FIND_BY_USER_UUID, VeranstalterEntity.class)
                .setParameter("userUuid", userUuid)
                .getResultList();

        log.info("Anzahl Treffer = {}", resultList.size());

        return resultList.stream().findFirst();
    }
}
