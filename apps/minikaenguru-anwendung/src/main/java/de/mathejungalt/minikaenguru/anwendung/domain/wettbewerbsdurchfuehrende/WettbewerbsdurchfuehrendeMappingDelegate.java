package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrender;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.ZugangsberechtigungUnterlagen;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.WettbewerbsdurchfuehrenderEntity;

/**
 * WettbewerbsdurchfuehrendeMappingDelegate.
 */
public class WettbewerbsdurchfuehrendeMappingDelegate {

    WettbewerbsdurchfuehrenderEntity createWettbewerbsdurchfuehrendeEntity(final String userUuid, final String kuerzel,
            final Wettbewerbsdurchfuehrungsart wettbewerbsdurchfuehrungsart, final LocalDateTime now) {

        switch (wettbewerbsdurchfuehrungsart) {
        case PRIVAT:

            return WettbewerbsdurchfuehrenderEntity
                    .builder()
                    .privatkuerzel(kuerzel)
                    .userUuid(userUuid)
                    .art(wettbewerbsdurchfuehrungsart)
                    .zugangsberechtigungUnterlagen(ZugangsberechtigungUnterlagen.STANDARD)
                    .createdAt(now)
                    .updatedAt(now)
                    .build();
        case SCHULE:
            return WettbewerbsdurchfuehrenderEntity
                    .builder()
                    .schulkuerzel(kuerzel)
                    .userUuid(userUuid)
                    .art(wettbewerbsdurchfuehrungsart)
                    .zugangsberechtigungUnterlagen(ZugangsberechtigungUnterlagen.STANDARD)
                    .createdAt(now)
                    .updatedAt(now)
                    .build();

        default:
            throw new IllegalArgumentException(
                    "Unerwartete wettbewerbsdurchfuehrungsart " + wettbewerbsdurchfuehrungsart);
        }

    }

    Wettbewerbsdurchfuehrender mapToWettbewerbsdurchfuehrender(final WettbewerbsdurchfuehrenderEntity result,
            final String userUuid) {

        final Set<String> teilnahmenummern = new HashSet<>();

        switch (result.getArt()) {
        case PRIVAT:
            teilnahmenummern.add(result.getPrivatkuerzel());
            break;
        case SCHULE:
            teilnahmenummern.addAll(Arrays.stream(StringUtils.split(result.getSchulkuerzel(), ",")).toList());
            break;
        default:
            throw new IllegalStateException("unerwarteter Typ " + result.getArt()
                    + " in wettbewerbsdurchfuehrende mit user_uuid = " + userUuid);
        }

        return new Wettbewerbsdurchfuehrender()
                .durchfuehrungsart(result.getArt())
                .teilnahmenummern(teilnahmenummern)
                .zugangsberechtigungUnterlagen(result.getZugangsberechtigungUnterlagen())
                .newsletter(result.isNewsletterEmpfaenger());
    }

}
