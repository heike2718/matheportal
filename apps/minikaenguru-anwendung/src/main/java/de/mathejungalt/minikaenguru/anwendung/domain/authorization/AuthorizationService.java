package de.mathejungalt.minikaenguru.anwendung.domain.authorization;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;

import org.apache.commons.lang3.StringUtils;

import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventService;
import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventType;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

/**
 * AuthorizationService
 */
@ApplicationScoped
public class AuthorizationService {

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    AuditEventService auditEventService;

    @Inject
    WettbewerbsdurchfuehrenderDao wettbewerbsdurchfuehrenderDao;

    /**
     * Prüft die Zulässigkeit des Zugriffs auf eine Entität mit diesem kuerzel.
     *
     * @param kuerzel String eindeutiger Identifier einer Entität.
     * @param context String für das audit event.
     */
    public void checkAuthorization(final String kuerzel, final String context) {
        final String uuid = securityIdentity.getPrincipal().getName();
        final Optional<WettbewerbsdurchfuehrenderEntity> optional = wettbewerbsdurchfuehrenderDao.findByUserUuid(uuid);

        if (optional.isEmpty()) {
            final String message = context
                    + " - Benutzer mit dieser uuid ist kein Wettbewerbsdurchführender. Zugriff auf Entität mit kuerzel "
                    + kuerzel;
            auditEventService.recordAuditEvent(AuditEventType.ACCESS_DENIED, message);
            throw new MinikaenguruAuthorizationException(message);
        }

        final WettbewerbsdurchfuehrenderEntity entity = optional.get();

        final Wettbewerbsdurchfuehrungsart art = entity.getArt();

        final List<String> zulaessigeKuerzel = new ArrayList<>();

        switch (art) {
        case PRIVAT:
            zulaessigeKuerzel.add(entity.getPrivatkuerzel());
            break;
        case SCHULE:
            zulaessigeKuerzel.addAll(Arrays.asList(StringUtils.split(entity.getSchulkuerzel(), ',')));
            break;
        default:
            throw new IllegalArgumentException("Unerwartete Wettbewerbsdurchfuehrungsart " + art);
        }

        if (!zulaessigeKuerzel.contains(kuerzel)) {
            final String message = context + " - Zugriff auf Entität mit kuerzel " + kuerzel;
            auditEventService.recordAuditEvent(AuditEventType.ACCESS_DENIED, message);
            throw new MinikaenguruAuthorizationException(message);
        }
    }
}
