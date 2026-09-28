package de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen;

import java.util.List;
import java.util.Optional;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsstatus;

/**
 * TeilnahmeUtils.
 */
public final class TeilnahmeUtils {

    /**
     * Ermittelt aus den gegebenen parametern, ob eine Anmeldung zum Wettbewerb möglich ist.
     *
     * @param aktuellerWettbewerb Wettbewerb
     * @param teilnahmereferenzen List
     * @return
     */
    public static boolean isAnmeldungMoeglich(final Wettbewerb aktuellerWettbewerb,
            final List<TeilnahmeReferenz> teilnahmereferenzen) {

        final Optional<TeilnahmeReferenz> optTeilnahmeAktuellesJahr = teilnahmereferenzen
                .stream()
                .filter(r -> r.getJahr().equals(aktuellerWettbewerb.getJahr()))
                .findFirst();

        if (optTeilnahmeAktuellesJahr.isPresent()) {
            return false;
        }

        return (aktuellerWettbewerb.getStatus() != Wettbewerbsstatus.ERFASST
                && aktuellerWettbewerb.getStatus() != Wettbewerbsstatus.BEENDET);
    }

}
