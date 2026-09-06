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

    public MailDto generateMonitoringMail(final String betreff, final String text) {

        return MailDto.builder().empfaenger(empfaenger).betreff(betreff).text(text).build();
    }
}
