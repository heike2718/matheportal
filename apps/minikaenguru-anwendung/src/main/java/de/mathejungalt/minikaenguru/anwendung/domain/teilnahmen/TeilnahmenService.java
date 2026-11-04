package de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.SecurityIdentity;

import de.mathejungalt.minikaenguru.anwendung.domain.authorization.MinikaenguruAuthorizationException;
import de.mathejungalt.minikaenguru.anwendung.domain.exception.MinikaenguruConflictException;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Auswertungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Teilnahme;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.utils.MappingUtils;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerb.WettbewerbService;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.TeilnahmeDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.WettbewerbsdurchfuehrenderDao;
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
    WettbewerbsdurchfuehrenderDao wettbewerbsdurchfuehrenderDao;

    @Inject
    TeilnahmeDao teilnahmeDao;

    @Inject
    Clock clock;

    /**
     * Legt eine Privatteilnahme zum aktuellen Wettbewerb an.
     *
     * @return Teilnahme
     */
    public Teilnahme privatteilnahmeAnlegen() {

        final String userUuid = securityIdentity.getPrincipal().getName();

        final Optional<WettbewerbsdurchfuehrenderEntity> optDurchfuehrender = wettbewerbsdurchfuehrenderDao
                .findByUserUuid(userUuid);

        if (optDurchfuehrender.isEmpty()) {
            throw new MinikaenguruAuthorizationException(
                    "Sie haben keine Berechtigung für den Minikänguru-Wettbewerb.");
        }

        final WettbewerbsdurchfuehrenderEntity durchfuehrender = optDurchfuehrender.get();

        if (Wettbewerbsdurchfuehrungsart.SCHULE == durchfuehrender.getArt()) {
            throw new MinikaenguruAuthorizationException("Sie sich nicht privat zum Minikänguru-Wettbewerb anmelden.");
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

        final Teilnahme result = mapFromEntity(teilnahmeEntity, true);

        return result;
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

        return teilnahme;

    }

}
