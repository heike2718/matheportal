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
import de.mathejungalt.minikaenguru.anwendung.domain.generated.PrivatpersonWettbewerbskontext;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schule;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.WettbewerbsdurchfuehrenderRequest;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.schulkatalog.SchulkatalogService;
import de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen.TeilnahmeUtils;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerb.WettbewerbService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.TeilnahmeDao;
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
    WettbewerbService wettbewerbService;

    @Inject
    TeilnahmeDao teilnahmeDao;

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

        final WettbewerbsdurchfuehrenderEntity entity = loadWettbewerbsdurchfuehrendenAndAuditMissing("Schulen laden");

        if (Wettbewerbsdurchfuehrungsart.PRIVAT == entity.getArt()) {
            final String message = "Schulen laden: Benutzer ist Privatperson";
            auditEventService.recordAuditEvent(AuditEventType.ACCESS_DENIED, message);
            throw new MinikaenguruAuthorizationException(message);
        }

        final String[] kuerzels = StringUtils.split(entity.getSchulkuerzel(), ',');

        return schulkatalogService.loadSchulenByKuerzel(kuerzels);
    }

    /**
     * Läd den Wettbewerbskontext einer Privatperson.
     *
     * @return PrivatpersonWettbewerbskontext
     */
    public PrivatpersonWettbewerbskontext loadMyWettbewerbskontext() {

        final WettbewerbsdurchfuehrenderEntity entity = loadWettbewerbsdurchfuehrendenAndAuditMissing(
                "Wettbewerbskontext laden");

        if (Wettbewerbsdurchfuehrungsart.SCHULE == entity.getArt()) {
            final String message = "Wettbewerbskontext laden: Benutzer ist Lehrperson.";
            auditEventService.recordAuditEvent(AuditEventType.ACCESS_DENIED, message);
            throw new MinikaenguruAuthorizationException(message);
        }

        final List<TeilnahmeReferenz> teilnahmerefs = teilnahmeDao.loadTeilnahmereferenzen(entity.getPrivatkuerzel());
        final Wettbewerb aktuellerWettbewerb = wettbewerbService.loadAktuellenWettbewerb();

        return new PrivatpersonWettbewerbskontext()
                .teilnahmerefs(teilnahmerefs)
                .anmeldestatus(TeilnahmeUtils.berechneAnmeldestatus(aktuellerWettbewerb, teilnahmerefs));
    }

    /**
     * Läd die Entity mit der gegebenen userUuid und protokolliert Zugriff, wenn es sie nicht gibt.
     *
     * @param userUuid String
     * @param context  String
     * @return WettbewerbsdurchfuehrenderEntity - nie null
     * @throws MinikaenguruAuthorizationException wenn es die Entity nicht gibt.
     */
    public WettbewerbsdurchfuehrenderEntity loadWettbewerbsdurchfuehrendenAndAuditMissing(final String context)
            throws MinikaenguruAuthorizationException {
        final Optional<WettbewerbsdurchfuehrenderEntity> optDurchfuehrender = wettbewerbsdurchfuehrenderDao
                .findByUserUuid(securityIdentity.getPrincipal().getName());

        if (optDurchfuehrender.isEmpty()) {
            final String message = context + ": Wettbewerbsdurchführender existiert nicht";
            auditEventService.recordAuditEvent(AuditEventType.ACCESS_DENIED, message);
            throw new MinikaenguruAuthorizationException(
                    "Sie haben keine Berechtigung für den Minikänguru-Wettbewerb.");
        }

        return optDurchfuehrender.get();
    }
}
