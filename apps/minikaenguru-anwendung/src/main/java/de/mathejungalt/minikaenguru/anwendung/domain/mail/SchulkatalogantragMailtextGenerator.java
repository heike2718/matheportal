package de.mathejungalt.minikaenguru.anwendung.domain.mail;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schulkatalogantrag;
import de.mathejungalt.minikaenguru.anwendung.domain.utils.ClasspathResourceUtils;

/**
 * SchulkatalogantragMailtextGenerator.
 */
@ApplicationScoped
public class SchulkatalogantragMailtextGenerator {

    private static final String PATH_MAILTEMPLATE = "/mails/schulkatalogantrag.txt";

    @Inject
    MailSuffixGenerator mailSuffixGenerator;

    private String text;

    /**
     * Ersetzt die Platzhalter im schulkatalogantrag-Template
     *
     * @param antrag Schulkatalogantrag
     * @return String
     */
    public String getMailBody(final Schulkatalogantrag antrag) {

        initializeIfNotInitialized();

        String result = text;

        result = result.replace("#0#", antrag.getNameSchule());
        result = result.replace("#1#", antrag.getPlz());
        result = result.replace("#2#", antrag.getNameOrt());
        result = result.replace("#3#", antrag.getStrasseUndHausnummer());
        result = result.replace("#4#", antrag.getNameLand());

        result += mailSuffixGenerator.getMailSuffix();

        return result;
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
