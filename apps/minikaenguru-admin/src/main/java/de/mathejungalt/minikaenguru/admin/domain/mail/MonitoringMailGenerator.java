package de.mathejungalt.minikaenguru.admin.domain.mail;

import jakarta.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * MonitoringMailGenerator.
 */
@ApplicationScoped
public class MonitoringMailGenerator {

    @ConfigProperty(name = "empfaenger.quittungsmail")
    String empfaenger;

    /**
     * Generiert eine Monitoring-Mail. Wenn irgendwas ins server.log geschrieben wird, sende ich es mir zusätzlich als
     * Mail.
     *
     * @param betreff String
     * @param text    String
     * @return MailDto
     */
    public MailDto generateMonitoringMail(final String betreff, final String text) {

        return MailDto.builder().empfaenger(empfaenger).betreff(betreff).text(text).build();
    }
}
