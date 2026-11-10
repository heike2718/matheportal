package de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen;

import java.util.List;
import java.util.Optional;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Anmeldestatus;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsstatus;

/**
 * TeilnahmeUtils.
 */
public final class TeilnahmeUtils {

    /**
     * Ermittelt, ob der status des aktuellen Wettbewerbs eine Anmeldung zulässt.
     *
     * @param aktuellerWettbewerb Wettbewerb
     * @return boolean
     */
    public static boolean laesstWettbewerbsstatusAnmeldungZu(final Wettbewerb aktuellerWettbewerb) {
        return aktuellerWettbewerb.getStatus() != Wettbewerbsstatus.ERFASST
                && aktuellerWettbewerb.getStatus() != Wettbewerbsstatus.BEENDET;
    }

    /**
     * Ermittelt aus den gegebenen parametern den Anmeldestatus.
     *
     * @param aktuellerWettbewerb Wettbewerb
     * @param teilnahmereferenzen List
     * @return Anmeldestatus
     */
    public static Anmeldestatus berechneAnmeldestatus(final Wettbewerb aktuellWettbewerb,
            final List<TeilnahmeReferenz> teilnahmereferenzen) {

        if (Wettbewerbsstatus.ERFASST == aktuellWettbewerb.getStatus()) {
            return Anmeldestatus.NOCH_NICHT_MOEGLICH;
        }

        if (Wettbewerbsstatus.BEENDET == aktuellWettbewerb.getStatus()) {
            return Anmeldestatus.NICHT_MEHR_MOEGLICH;
        }

        final Optional<TeilnahmeReferenz> optAktuelleTeilnahme = teilnahmereferenzen
                .stream()
                .filter(tr -> aktuellWettbewerb.getJahr().equals(tr.getJahr()))
                .findFirst();

        return optAktuelleTeilnahme.isPresent() ? Anmeldestatus.BEREITS_ANGEMELDET : Anmeldestatus.MOEGLICH;
    }

}
