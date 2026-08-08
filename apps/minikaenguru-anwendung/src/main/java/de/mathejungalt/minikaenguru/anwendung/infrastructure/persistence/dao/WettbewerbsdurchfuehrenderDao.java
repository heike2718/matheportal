package de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao;

import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

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

        log.debug("Anzahl Treffer = {}", resultList.size());

        return resultList.stream().findFirst();
    }

    /**
     * Legt neuen Eintrag an oder aktualisiert existierenden.
     *
     * @param entity WettbewerbsdurchfuehrenderEntity
     * @return WettbewerbsdurchfuehrenderEntity
     */
    @Transactional
    public WettbewerbsdurchfuehrenderEntity saveEntity(final WettbewerbsdurchfuehrenderEntity entity) {

        if (entity.getId() == null) {
            this.entityManager.persist(entity);
            return entity;
        } else {
            return this.entityManager.merge(entity);
        }
    }
}
