package de.mathejungalt.minikaenguru.admin.domain.schulkatalog;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import de.mathejungalt.minikaenguru.admin.domain.mail.MailSuffixGenerator;
import de.mathejungalt.minikaenguru.admin.domain.utils.ClasspathResourceUtils;

/**
 * SchuleEingetragenMailtextGenerator
 */
@ApplicationScoped
public class SchuleEingetragenMailtextGenerator {

    private static final String PATH_MAILTEMPLATE = "/mails/schuleEingetragen.txt";

    @Inject
    MailSuffixGenerator mailSuffixGenerator;

    private String text;

    String getMailBody(final String nameSchule, final String nameOrt, final String nameLand) {
        initializeIfNotInitialized();

        String body = text;
        body = body.replace("#0#", nameSchule);
        body = body.replace("#1#", nameOrt);
        body = body.replace("#2#", nameLand);

        body += mailSuffixGenerator.getMailSuffix();

        return body;
    }

    private void initializeIfNotInitialized() {
        if (text == null) {
            initText();
        }
    }

    private void initText() {
        this.text = ClasspathResourceUtils.loadTextFromClasspath(PATH_MAILTEMPLATE);
    }

}
