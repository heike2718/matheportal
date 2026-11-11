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
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Anmeldestatus;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Auswertungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Teilnahme;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.utils.MappingUtils;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerb.WettbewerbService;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende.WettbewerbsdurchfuehrendeService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization.AuthorizationKey;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization.KuerzelZugriff;
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
     * Läd die Teilnahmereferenzen. Muss nicht per KuerzelZugriff abgesichert werden, da es nur von bereits
     * abgesicherten Methoden aufgerufen wird.
     *
     * @param teilnahmekuerzel String
     * @return List
     */
    public List<TeilnahmeReferenz> getTeilnahmeReferenzen(final String teilnahmekuerzel) {
        return teilnahmeDao.loadTeilnahmereferenzen(teilnahmekuerzel);
    }

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

        if (Anmeldestatus.BEREITS_ANGEMELDET == TeilnahmeUtils
                .berechneAnmeldestatus(aktuellerWettbewerb, teilnahmerefs)) {
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

        final TeilnahmeEntity teilnahmeEntity = this
                .findTeilnahmeEntityForTeilnahmekuerzelAktuellesWettbewerbsjahr(durchfuehrender.getPrivatkuerzel());

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

        teilnahme.setAnzahlKinder(countDao.getAnzahlKinderByTeilnahmekuerzel(entity.getTeilnahmekuerzel()));
        teilnahme
                .setAnzahlLoesungszettel(countDao
                        .getAnzahlLoesungszettelByTeilnahmekuerzelAndJahr(entity.getTeilnahmekuerzel(),
                                entity.getJahr()));

        return teilnahme;
    }

    /**
     * Legt eine Schulteilnahme zum aktuellen Wettbewerb an.
     *
     * @param schuleId       String das schulkuerzel
     * @param auswertungsart Auswertungsart
     * @return Teilnahme
     */
    @KuerzelZugriff("schule: Teilnahme anlegen")
    public Teilnahme schulteilnahmeAnlegen(final @AuthorizationKey String schuleId,
            final Auswertungsart auswertungsart) {

        // es ist einfacher, diese Methode zu verwenden. Es wird an dieser Stelle nie
        // ein AuditEvent ausgelöst werden wegen der interceptorgesteuerten
        // Autorisierung
        final WettbewerbsdurchfuehrenderEntity durchfuehrender = wettbewerbsdurchfuehrendeService
                .loadWettbewerbsdurchfuehrendenAndAuditMissing("Laden der aktuellen Schulteilnahme");

        if (Wettbewerbsdurchfuehrungsart.PRIVAT == durchfuehrender.getArt()) {
            final String message = "Wettbewerbsanmeldung Schule: Benutzer ist Privatperson";
            auditEventService.recordAuditEvent(AuditEventType.ACCESS_DENIED, message);
            throw new MinikaenguruAuthorizationException(
                    "Sie können keine Schule zum Minikänguru-Wettbewerb anmelden.");
        }

        final Wettbewerb aktuellerWettbewerb = wettbewerbService.loadAktuellenWettbewerb();

        if (!TeilnahmeUtils.laesstWettbewerbsstatusAnmeldungZu(aktuellerWettbewerb)) {
            throw new MinikaenguruConflictException("Der aktuelle Wettbewerb lässt keine Anmeldung zu.");
        }

        final List<TeilnahmeReferenz> teilnahmerefs = teilnahmeDao.loadTeilnahmereferenzen(schuleId);

        if (Anmeldestatus.BEREITS_ANGEMELDET == TeilnahmeUtils
                .berechneAnmeldestatus(aktuellerWettbewerb, teilnahmerefs)) {
            throw new MinikaenguruConflictException("Die Schule ist bereits zum aktuellen Wettbewerb angemeldet.");
        }

        final LocalDateTime now = LocalDateTime.now(clock);

        final TeilnahmeEntity teilnahmeEntity = TeilnahmeEntity
                .builder()
                .teilnahmeart(Wettbewerbsdurchfuehrungsart.SCHULE)
                .teilnahmekuerzel(schuleId)
                .createdAt(now)
                .angemeldetDurch(securityIdentity.getPrincipal().getName())
                .auswertungsart(auswertungsart)
                .jahr(aktuellerWettbewerb.getJahr())
                .build();

        teilnahmeDao.insertTeilnahme(teilnahmeEntity);

        return mapFromEntity(teilnahmeEntity, true);
    }

    /**
     * Läd die Teilnahme der gegebenen Schule am aktuellen Wettbewerb.
     *
     * @param schuleId String das schulkuerzel
     * @return Teilnahme
     */
    @KuerzelZugriff("schule: aktuelle Teilnahme laden")
    public Teilnahme loadAktuelleSchulteilnahme(final @AuthorizationKey String schuleId) {

        // es ist einfacher, diese Methode zu verwenden. Es wird an dieser Stelle nie
        // ein AuditEvent ausgelöst werden wegen der interceptorgesteuerten
        // Autorisierung
        final WettbewerbsdurchfuehrenderEntity durchfuehrender = wettbewerbsdurchfuehrendeService
                .loadWettbewerbsdurchfuehrendenAndAuditMissing("Laden der aktuellen Schulteilnahme");

        if (Wettbewerbsdurchfuehrungsart.PRIVAT == durchfuehrender.getArt()) {
            final String message = "Laden der aktuellen Teilnahme einer Schule: Benutzer ist Privatperson";
            auditEventService.recordAuditEvent(AuditEventType.ACCESS_DENIED, message);
            throw new MinikaenguruAuthorizationException("Sie können keine Schulteilnahmen laden.");
        }

        final TeilnahmeEntity teilnahmeEntity = this
                .findTeilnahmeEntityForTeilnahmekuerzelAktuellesWettbewerbsjahr(durchfuehrender.getSchulkuerzel());

        if (teilnahmeEntity == null) {
            throw new ResourceNotFoundException("Diese Resource gibt es leider nicht oder nicht mehr.");
        }

        return mapFromEntity(teilnahmeEntity, false);
    }

    /**
     * Sucht die JPA-Entity der aktuellen Teilnahme mit dem gegebenen kuerzel.
     *
     * @param teilnahmekuerzel String
     * @return TeilnahmeEntity oder null
     */
    public TeilnahmeEntity findTeilnahmeEntityForTeilnahmekuerzelAktuellesWettbewerbsjahr(
            final String teilnahmekuerzel) {

        final Wettbewerb aktuellerWettbewerb = wettbewerbService.loadAktuellenWettbewerb();

        return teilnahmeDao.findTeilnahmeByUniqueKey(teilnahmekuerzel, aktuellerWettbewerb.getJahr());

    }
}
