package de.mathejungalt.minikaenguru.admin.domain.mail;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * MonitoringMailService.
 */
@ApplicationScoped
public class MonitoringMailService {

    public static final String BETREFF = "Minikänguru: Error auf PROD";

    @Inject
    MonitoringMailGenerator mailGeneratior;

    @Inject
    MailService mailService;

    /**
     * Sendet eine Mail über die Exception an mich.
     *
     * @param exception RuntimeException
     */
    public void sendMonitoringMailQuietly(final RuntimeException exception) {
        this.sendMonitoringMailQuietly(BETREFF, exception.getMessage());
    }

    /**
     * Sendet eine Mail an mich.
     *
     * @param betreff String
     * @param text    String
     */
    public void sendMonitoringMailQuietly(final String betreff, final String text) {
        final MailDto mailDto = mailGeneratior.generateMonitoringMail(BETREFF, text);
        this.mailService.sendMailQuietly(mailDto);
    }
}
