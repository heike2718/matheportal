package de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventService;
import de.mathejungalt.minikaenguru.anwendung.domain.auditevents.AuditEventType;
import de.mathejungalt.minikaenguru.anwendung.domain.authorization.MinikaenguruAuthorizationException;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruConflictException;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.ResourceNotFoundException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Auswertungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Teilnahme;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.utils.MappingUtils;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerb.WettbewerbService;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende.WettbewerbsdurchfuehrendeService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.CountDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.TeilnahmeDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.TeilnahmeEntity;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

/**
 * TeilnahmenService.
 */
@ApplicationScoped
public class TeilnahmenService {

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    WettbewerbService wettbewerbService;

    @Inject
    WettbewerbsdurchfuehrendeService wettbewerbsdurchfuehrendeService;

    @Inject
    AuditEventService auditEventService;

    @Inject
    TeilnahmeDao teilnahmeDao;

    @Inject
    CountDao countDao;

    @Inject
    Clock clock;

    /**
     * Legt eine Privatteilnahme zum aktuellen Wettbewerb an.
     *
     * @return Teilnahme
     * @throws MinikaenguruAuthorizationException wenn keine Berechtigung
     * @throws MinikaenguruConflictException      wenn Anlegen nicht möglich
     */
    public Teilnahme privatteilnahmeAnlegen() throws MinikaenguruAuthorizationException, MinikaenguruConflictException {

        final String userUuid = securityIdentity.getPrincipal().getName();

        final WettbewerbsdurchfuehrenderEntity durchfuehrender = wettbewerbsdurchfuehrendeService
                .loadWettbewerbsdurchfuehrendenAndAuditMissing("Wettbewerbsanmeldung privat");

        if (Wettbewerbsdurchfuehrungsart.SCHULE == durchfuehrender.getArt()) {
            final String message = "Wettbewerbsanmeldung privat: Benutzer ist Lehrperson";
            auditEventService.recordAuditEvent(AuditEventType.ACCESS_DENIED, message);
            throw new MinikaenguruAuthorizationException(
                    "Sie können sich nicht privat zum Minikänguru-Wettbewerb anmelden.");
        }

        final Wettbewerb aktuellerWettbewerb = wettbewerbService.loadAktuellenWettbewerb();

        if (!TeilnahmeUtils.laesstWettbewerbsstatusAnmeldungZu(aktuellerWettbewerb)) {
            throw new MinikaenguruConflictException("Der aktuelle Wettbewerb lässt keine Anmeldung zu.");
        }

        final List<TeilnahmeReferenz> teilnahmerefs = teilnahmeDao
                .loadTeilnahmereferenzen(durchfuehrender.getPrivatkuerzel());

        if (!TeilnahmeUtils.isAnmeldungMoeglich(aktuellerWettbewerb, teilnahmerefs)) {
            throw new MinikaenguruConflictException("Sie haben sich bereits zum aktuellen Wettbewerb angemeldet.");
        }

        final LocalDateTime now = LocalDateTime.now(clock);

        final TeilnahmeEntity teilnahmeEntity = TeilnahmeEntity
                .builder()
                .teilnahmeart(Wettbewerbsdurchfuehrungsart.PRIVAT)
                .teilnahmekuerzel(durchfuehrender.getPrivatkuerzel())
                .createdAt(now)
                .angemeldetDurch(userUuid)
                .auswertungsart(Auswertungsart.ONLINE)
                .jahr(aktuellerWettbewerb.getJahr())
                .build();

        teilnahmeDao.insertTeilnahme(teilnahmeEntity);

        return mapFromEntity(teilnahmeEntity, true);
    }

    /**
     * Läd die aktuelle Teilnahme der eingeloggten Privatperson.
     *
     * @return Teilnahme
     * @throws MinikaenguruAuthorizationException wenn keine Berechtigung
     */
    public Teilnahme loadAktuellePrivatteilnahme()
            throws MinikaenguruAuthorizationException, ResourceNotFoundException {

        final WettbewerbsdurchfuehrenderEntity durchfuehrender = wettbewerbsdurchfuehrendeService
                .loadWettbewerbsdurchfuehrendenAndAuditMissing("aktuelle Privatteilnahme laden");

        if (Wettbewerbsdurchfuehrungsart.SCHULE == durchfuehrender.getArt()) {
            final String message = "aktuelle Privatteilnahme laden: Benutzer ist Lehrperson";
            auditEventService.recordAuditEvent(AuditEventType.ACCESS_DENIED, message);
            throw new MinikaenguruAuthorizationException("Sie können keine Privatteilnahmen laden.");
        }

        final Wettbewerb aktuellerWettbewerb = wettbewerbService.loadAktuellenWettbewerb();

        final TeilnahmeEntity teilnahmeEntity = teilnahmeDao
                .findTeilnahmeByUniqueKey(durchfuehrender.getPrivatkuerzel(), aktuellerWettbewerb.getJahr());

        if (teilnahmeEntity == null) {
            throw new ResourceNotFoundException("Diese Resource gibt es leider nicht oder nicht mehr.");
        }

        return mapFromEntity(teilnahmeEntity, false);
    }

    private Teilnahme mapFromEntity(final TeilnahmeEntity entity, final boolean isNeu) {
        final Teilnahme teilnahme = new Teilnahme()
                .kuerzel(entity.getTeilnahmekuerzel())
                .jahr(entity.getJahr())
                .angemeldetAm(MappingUtils.formatToDateWithTimeStringNullSave(entity.getCreatedAt()))
                .durchfuehrungsart(entity.getTeilnahmeart())
                .auswertungsart(entity.getAuswertungsart());

        if (isNeu) {
            teilnahme.setAnzahlKinder(0);
            teilnahme.setAnzahlKlassen(0);
            teilnahme.setAnzahlLoesungszettel(0);
        }

        if (Wettbewerbsdurchfuehrungsart.SCHULE == entity.getTeilnahmeart()) {
            teilnahme.setAnzahlKlassen(countDao.getAnzahlKlassenByKuerzelSchule(entity.getTeilnahmekuerzel()));
        } else {
            teilnahme.setAnzahlKlassen(0);
        }

        teilnahme
                .setAnzahlKinder(
                        Integer.valueOf(countDao.getAnzahlKinderByTeilnahmekuerzel(entity.getTeilnahmekuerzel())));
        teilnahme
                .setAnzahlLoesungszettel(countDao
                        .getAnzahlLoesungszettelByTeilnahmekuerzelAndJahr(entity.getTeilnahmekuerzel(),
                                entity.getJahr()));

        return teilnahme;

    }

}
