package de.mathejungalt.minikaenguru.admin.domain.schulkatalog;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.mathejungalt.minikaenguru.admin.domain.mail.MailDto;
import de.mathejungalt.minikaenguru.admin.domain.mail.MailService;
import de.mathejungalt.minikaenguru.admin.domain.mail.MonitoringMailService;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.dao.SchulkatalogDao;
import de.mathejungalt.minikaenguru.admin.infrastructure.persistence.entities.SchuleReadonlyEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * SchulkatalogMailService.
 */
@ApplicationScoped
@Slf4j
public class SchulkatalogMailService {

    private static final String BETREFF_MAIL_SCHULKATALOG = "Minikänguru: Schulkatalog";

    @ConfigProperty(name = "empfaenger.quittungsmail")
    String empfaengerQuittungsmail;

    @Inject
    SchulkatalogDao schulkatalogDao;

    @Inject
    SchuleEingetragenMailtextGenerator schuleEingetragenMailtextGenerator;

    @Inject
    MonitoringMailService monitoringMailService;

    @Inject
    MailService mailService;

    void sendMailSchuleEingetragen(final String kuerzel, final String emailAuftraggeber) {

        final SchuleReadonlyEntity schuleReadonlyEntity = schulkatalogDao.findDatenSchuleById(kuerzel);
        if (schuleReadonlyEntity == null) {
            log.warn("Mail für Schule konnte nicht gesendet werden, weil es das kuerzel {} nicht gibt", kuerzel);
            monitoringMailService
                    .sendMonitoringMailQuietly("Minikaenguru: Fehler beim Eintragen einer Schule",
                            "Schule mit " + kuerzel + " nicht gefunden. Mail an Auftraggeber " + emailAuftraggeber
                                    + " konnte nicht gesendet werden.");
            return;
        }

        final String mailBody = schuleEingetragenMailtextGenerator
                .getMailBody(schuleReadonlyEntity.getName(), schuleReadonlyEntity.getNameOrt(),
                        schuleReadonlyEntity.getNameLand());

        final MailDto mailDto = MailDto
                .builder()
                .betreff(BETREFF_MAIL_SCHULKATALOG)
                .empfaenger(emailAuftraggeber)
                .empfaengerQuittungsmail(empfaengerQuittungsmail)
                .text(mailBody)
                .build();

        this.mailService.sendMail(mailDto);
    }

}
