package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.time.LocalDateTime;

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

        return new Wettbewerbsdurchfuehrender()
                .durchfuehrungsart(result.getArt())
                .zugangsberechtigungUnterlagen(result.getZugangsberechtigungUnterlagen())
                .newsletter(result.isNewsletterEmpfaenger());
    }

}
