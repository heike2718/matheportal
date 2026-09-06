package de.mathejungalt.minikaenguru.admin.domain.mail;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;

import lombok.extern.slf4j.Slf4j;

/**
 * MailService.
 */
@ApplicationScoped
@Slf4j
public class MailService {

    @Inject
    Mailer mailer;

    /**
     * Versendet die gegebenen Maildaten.
     *
     * @param mailDto MailDto
     */
    public void sendMail(final MailDto mailDto) {

        final String body = mailDto.getText();
        final String betreff = mailDto.getBetreff();

        final String[] hiddenEmpfaenger = getAllHiddenEmpfaenger(mailDto);
        final Mail mail = Mail.withText(mailDto.getEmpfaenger(), betreff, body).addBcc(hiddenEmpfaenger);
        mailer.send(mail);
    }

    private String[] getAllHiddenEmpfaenger(final MailDto mailDto) {

        final List<String> hiddenEmpfaenger = mailDto.getHiddenEmpfaenger();
        if (mailDto.getEmpfaengerQuittungsmail() != null) {
            hiddenEmpfaenger.add(mailDto.getEmpfaengerQuittungsmail());
        }

        return hiddenEmpfaenger.toArray(String[]::new);
    }

    /**
     * Sendet die Mail und fängt Exceptions, die dabei auftreten könnten.
     *
     * @param mailDto MailDto
     */
    public void sendMailQuietly(final MailDto mailDto) {
        try {
            this.sendMail(mailDto);
        } catch (final Exception e) {
            log.warn("Mail konnte nicht versendet werden {}", mailDto.toString(), e);
        }
    }
}
