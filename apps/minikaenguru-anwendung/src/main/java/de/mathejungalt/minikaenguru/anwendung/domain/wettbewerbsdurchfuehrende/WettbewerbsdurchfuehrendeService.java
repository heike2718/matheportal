package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;

import org.apache.commons.lang3.StringUtils;

import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventService;
import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventType;
import de.mathejungalt.minikaenguru.anwendung.domain.authorization.MinikaenguruAuthorizationException;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruConflictException;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruRuntimeException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schule;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.WettbewerbsdurchfuehrenderRequest;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.schulkatalog.SchulkatalogService;
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
    AuditEventService auditEventService;

    @Inject
    SchulkatalogService schulkatalogService;

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    AugmentSessionDelegate augmentSessionDelegate;

    /**
     * Läd den Wettbewerbsdurchfuehrenden anhand der userUuid aus der SecurityIdentity.
     *
     * @return Wettbewerbsdurchfuehrender oder null
     */
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
    public Wettbewerbsdurchfuehrender wettbewerbsdurchfuehrendenAnlegen(
            final WettbewerbsdurchfuehrenderRequest request) {

        if (loadDurchfuehrenden() != null) {
            throw new MinikaenguruConflictException(
                    "Dieser Benutzer ist bereits als Wettbewerbsdurchführender registriert.");
        }

        Wettbewerbsdurchfuehrender result = null;

        switch (request.getDurchfuehrungsart()) {
        case PRIVAT:
            result = privatpersonAnlegenDelegate.privatpersonAnlegen();
            break;
        case SCHULE:
            result = lehrpersonAnlegenDelegate.lehrpersonAnlegen(request.getSchulkuerzel());
            break;
        default:
            throw new MinikaenguruRuntimeException(
                    "unerwartete wettbewerbsdurchfuehrungsart " + request.getDurchfuehrungsart());
        }

        augmentSessionDelegate.augmentSession(request.getDurchfuehrungsart());

        return result;
    }

    /**
     * Läd die Schulen des eingeloggten Benutzers.
     *
     * @return List
     */
    public List<Schule> loadMySchools() {

        final Optional<WettbewerbsdurchfuehrenderEntity> opt = wettbewerbsdurchfuehrenderDao
                .findByUserUuid(securityIdentity.getPrincipal().getName());

        if (opt.isEmpty()) {
            final String message = "Benutzer mit dieser uuid ist kein Wettbewerbsdurchführender. Laden von Schulen nicht erlaubt";
            auditEventService.recordAuditEvent(AuditEventType.ACCESS_DENIED, message);
            throw new MinikaenguruAuthorizationException(message);
        }

        final WettbewerbsdurchfuehrenderEntity entity = opt.get();
        if (Wettbewerbsdurchfuehrungsart.PRIVAT == entity.getArt()) {
            final String message = "Benutzer mit dieser uuid ist Privatperson. Laden von Schulen nicht erlaubt";
            auditEventService.recordAuditEvent(AuditEventType.ACCESS_DENIED, message);
            throw new MinikaenguruAuthorizationException(message);
        }

        final String[] kuerzels = StringUtils.split(entity.getSchulkuerzel(), ',');

        return schulkatalogService.loadSchulenByKuerzel(kuerzels);
    }
}
