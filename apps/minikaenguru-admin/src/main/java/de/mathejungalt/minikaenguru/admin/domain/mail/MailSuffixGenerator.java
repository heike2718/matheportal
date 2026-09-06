package de.mathejungalt.minikaenguru.admin.domain.mail;

import jakarta.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.mathejungalt.minikaenguru.admin.domain.utils.ClasspathResourceUtils;

/**
 * MailSuffixGenerator.
 */
@ApplicationScoped
public class MailSuffixGenerator {

    private static final String PATH_EMAIL_SUFFIX = "/mails/mailsuffix.txt";

    @ConfigProperty(name = "email.minikaenguru")
    String mailadresseMinikaenguru;

    @ConfigProperty(name = "email.noreply")
    String mailadresseNoreply;

    private String mailSuffix;

    /**
     * Gibt den Text zurück, der jeder Mail angehängt wird.
     *
     * @return String
     */
    public String getMailSuffix() {
        initializeIfNotInitialized();
        return mailSuffix;
    }

    private void initializeIfNotInitialized() {
        if (mailSuffix == null) {
            initSuffix();
        }
    }

    private void initSuffix() {
        String text = ClasspathResourceUtils.loadTextFromClasspath(PATH_EMAIL_SUFFIX);
        text = text.replace("#0#", mailadresseMinikaenguru);
        text = text.replace("#1#", mailadresseNoreply);

        this.mailSuffix = text;
    }

}
