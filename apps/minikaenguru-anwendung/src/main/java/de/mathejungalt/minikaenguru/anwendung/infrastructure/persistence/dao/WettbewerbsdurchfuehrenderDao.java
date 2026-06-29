package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import io.quarkus.hibernate.orm.PersistenceUnit;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * WettbewerbsdurchfuehrenderDao.
 */
@ApplicationScoped
@Slf4j
public class WettbewerbsdurchfuehrenderDao {

    @Inject
    @PersistenceUnit("minikaenguru")
    EntityManager entityManager;

    /**
     * WettbewerbsdurchfuehrenderDao.
     */
    WettbewerbsdurchfuehrenderDao() {
        super();
    }

    /**
     * Sucht eine WettbewerbsdurchfuehrenderEntity anhand seiner userUuid.
     *
     * @param userUuid String
     * @return Optional
     */
    public Optional<WettbewerbsdurchfuehrenderEntity> findByUserUuid(final String userUuid) {

        final List<WettbewerbsdurchfuehrenderEntity> resultList = entityManager
                .createNamedQuery(WettbewerbsdurchfuehrenderEntity.FIND_BY_USER_UUID,
                        WettbewerbsdurchfuehrenderEntity.class)
                .setParameter("userUuid", userUuid)
                .getResultList();

        log.info("Anzahl Treffer = {}", resultList.size());

        return resultList.stream().findFirst();
    }
}
