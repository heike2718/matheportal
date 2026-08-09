package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruConflictException;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruRuntimeException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.WettbewerbsdurchfuehrenderRequest;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * WettbewerbsdurchfuehrendeService.
 */
@Slf4j
@ApplicationScoped
public class WettbewerbsdurchfuehrendeService {

    private final WettbewerbsdurchfuehrendeMappingDelegate mappingDelegate = new WettbewerbsdurchfuehrendeMappingDelegate();

    @Inject
    PrivatpersonAnlegenDelegate privatpersonAnlegenDelegate;

    @Inject
    LehrpersonAnlegenDelegate lehrpersonAnlegenDelegate;

    @Inject
    WettbewerbsdurchfuehrenderDao wettbewerbsdurchfuehrenderDao;

    @Inject
    SecurityIdentity securityIdentity;

    /**
     * Läd den Wettbewerbsdurchfuehrenden anhand der userUuid aus der SecurityIdentity.
     *
     * @return Wettbewerbsdurchfuehrender oder null
     */
    @Transactional
    public Wettbewerbsdurchfuehrender loadDurchfuehrenden() {

        final Optional<WettbewerbsdurchfuehrenderEntity> opt = wettbewerbsdurchfuehrenderDao
                .findByUserUuid(securityIdentity.getPrincipal().getName());

        if (opt.isPresent()) {
            return this.mappingDelegate
                    .mapToWettbewerbsdurchfuehrender(opt.get(), securityIdentity.getPrincipal().getName());
        }

        return null;
    }

    /**
     * Legt einen Wettbewerbsdurchfuehrenden an.
     *
     * @param request WettbewerbsdurchfuehrenderRequest
     * @return Wettbewerbsdurchfuehrender
     */
    @Transactional
    public Wettbewerbsdurchfuehrender wettbewerbsdurchfuehrendenAnlegen(
            final WettbewerbsdurchfuehrenderRequest request) {

        if (loadDurchfuehrenden() != null) {
            throw new MinikaenguruConflictException(
                    "Dieser Benutzer ist bereits als Wettbewerbsdurchführender registriert.");
        }

        switch (request.getDurchfuehrungsart()) {
        case PRIVAT:
            return privatpersonAnlegenDelegate.privatpersonAnlegen();
        case SCHULE:
            return lehrpersonAnlegenDelegate.lehrpersonAnlegen(request.getSchulkuerzel());
        default:
            throw new MinikaenguruRuntimeException(
                    "unerwartete wettbewerbsdurchfuehrungsart " + request.getDurchfuehrungsart());
        }
    }
}
