package de.mathejungalt.minikaenguru.anwendung.domain.schule;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Klasse;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.KlasseRequest;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization.AuthorizationKey;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization.KuerzelZugriff;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.KlasseDao;

/**
 * KlasseService.
 */
@ApplicationScoped
public class KlasseService {

    @Inject
    KlasseDao klasseDao;

    /**
     * Läd die Klasse mit der gegebenen klasseId
     *
     * @param schuleId String
     * @param klasseId String
     * @return Klasse
     */
    @KuerzelZugriff("klasse: laden")
    public Klasse loadKlasse(@AuthorizationKey final String schuleId, final String klasseId) {
        return null;
    }

    /**
     * Ändert den Namen der Klasse.
     *
     * @param schuleId      String
     * @param klasseId      String
     * @param klasseRequest KlasseRequest
     * @return Klasse
     */
    @KuerzelZugriff("klasse: ändern")
    public Klasse klasseAendern(@AuthorizationKey final String schuleId, final String klasseId,
            final KlasseRequest klasseRequest) {
        return null;
    }

    /**
     * Löscht die gegebene Klasse
     *
     * @param schuleId String
     * @param klasseId Strin
     */
    @KuerzelZugriff("klasse: löschen")
    public void klasseLoeschen(@AuthorizationKey final String schuleId, final String klasseId) {

    }

}
