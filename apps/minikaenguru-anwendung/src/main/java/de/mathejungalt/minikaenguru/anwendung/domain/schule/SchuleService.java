package de.mathejungalt.minikaenguru.anwendung.domain.schule;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;

import io.quarkus.security.identity.SecurityIdentity;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.faulttolerance.exceptions.TimeoutException;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schule;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.SchuleWettbewerbskontext;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.schulkatalog.SchulkatalogService;
import de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen.TeilnahmeUtils;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerb.WettbewerbService;
import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende.UserDetails;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization.AuthorizationKey;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization.KuerzelZugriff;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider.AuthproviderHttpException;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.authprovider.AuthproviderRestClient;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.SchulkollegiumDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.TeilnahmeDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.VertragAuftragsdatenverarbeitungDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.SchulkollegiumsmitgliedEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * SchuleService.
 */
@ApplicationScoped
@Slf4j
public class SchuleService {

    @ConfigProperty(name = "client.id")
    String clientId;

    @ConfigProperty(name = "client.secret")
    String clientSecret;

    @Inject
    @RestClient
    AuthproviderRestClient authproviderRestClient;

    @Inject
    SchulkatalogService schulkatalogService;

    @Inject
    WettbewerbService wettbewerbService;

    @Inject
    TeilnahmeDao teilnahmeDao;

    @Inject
    SchulkollegiumDao schulkollegiumDao;

    @Inject
    VertragAuftragsdatenverarbeitungDao vertragAuftragsdatenverarbeitungDao;

    @Inject
    SecurityIdentity securityIdentity;

    /**
     * Läd den Wettebwerbskontext der Schule mit diesem kuerzel.
     *
     * @param schuleId String
     * @return SchuleWettbewerbskontext
     */
    @KuerzelZugriff("schule: Wettbewerbskontext")
    public SchuleWettbewerbskontext loadWettbewerbskontext(@AuthorizationKey final String schuleId) {

        final Schule schule = schulkatalogService.loadSchulenByKuerzel(new String[] { schuleId }).getFirst();
        final List<String> kollegen = loadKollegen(schuleId);
        final List<TeilnahmeReferenz> teilnahmerefs = teilnahmeDao.loadTeilnahmereferenzen(schuleId);
        final boolean vertragDSGVOVorhanden = vertragAuftragsdatenverarbeitungDao.schuleHasVertragDSGVO(schuleId);

        final Wettbewerb aktuellerWettbewerb = wettbewerbService.loadAktuellenWettbewerb();

        return new SchuleWettbewerbskontext()
                .schule(schule)
                .kollegen(kollegen)
                .teilnahmerefs(teilnahmerefs)
                .vertragDSGVOVorhanden(vertragDSGVOVorhanden)
                .anmeldungMoeglich(TeilnahmeUtils.isAnmeldungMoeglich(aktuellerWettbewerb, teilnahmerefs));
    }

    List<String> loadKollegen(final String schuleId) {

        final String ownUuid = securityIdentity.getPrincipal().getName();

        final List<SchulkollegiumsmitgliedEntity> kollegen = schulkollegiumDao
                .findAllForSchule(schuleId)
                .stream()
                .filter(k -> !k.getUserUuid().equals(ownUuid))
                .toList();

        final List<String> result = new ArrayList<>();

        for (final SchulkollegiumsmitgliedEntity kollege : kollegen) {
            final String name = loadKollege(kollege.getUserUuid());
            if (name != null) {
                result.add(name);
            }
        }

        return result;

    }

    String loadKollege(final String userUuid) {

        final String nonce = UUID.randomUUID().toString();
        try {
            final UserDetails userDetails = authproviderRestClient
                    .getUserDetails(userUuid, clientId, clientSecret, nonce);
            return userDetails.getVorname() + " " + userDetails.getNachname();
        } catch (final AuthproviderHttpException e) {
            log.warn("http-status {} beim Laden der Namen fuer {}", e.getStatus(), userUuid);
            return null;
        } catch (TimeoutException | ProcessingException e) {
            log.error("Fehler beim laden des Namen fuer kollege {} (wird ignoriert): {}", userUuid, e.getMessage(), e);
            return null;
        }
    }
}
