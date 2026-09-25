package de.mathejungalt.minikaenguru.anwendung.domain.schulkatalog;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schulkatalogantrag;
import de.mathejungalt.minikaenguru.anwendung.domain.mail.MailDto;
import de.mathejungalt.minikaenguru.anwendung.domain.mail.MailService;
import de.mathejungalt.minikaenguru.anwendung.domain.mail.SchulkatalogantragMailtextGenerator;

import lombok.extern.slf4j.Slf4j;

/**
 * SchulkatalogantragService.
 */
@ApplicationScoped
@Slf4j
public class SchulkatalogantragService {

    private static final String BETREFF_MAIL_SCHULKATALOG = "Minikänguru: Schulkatalog";

    @ConfigProperty(name = "email.minikaenguru")
    String empfaengerQuittungsmail;

    @Inject
    SchulkatalogantragMailtextGenerator schulkatalogantragMailtextGenerator;

    @Inject
    MailService mailService;

    /**
     * Sendet den Antrag per Mail.
     *
     * @param antrag Schulkatalogantrag
     */
    public void sendeSchulkatalogantrag(final Schulkatalogantrag antrag) {

        final String mailBody = schulkatalogantragMailtextGenerator.getMailBody(antrag);

        final MailDto mailDto = MailDto
                .builder()
                .betreff(BETREFF_MAIL_SCHULKATALOG)
                .empfaenger(antrag.getEmailAuftraggeber())
                .empfaengerQuittungsmail(empfaengerQuittungsmail)
                .text(mailBody)
                .build();

        this.mailService.sendMail(mailDto);

    }

}
