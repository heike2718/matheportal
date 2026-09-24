package de.mathejungalt.minikaenguru.anwendung.infrastructure.test;

/**
 * TestConstants.
 */
public final class TestConstants {

    /**
     * TestConstants
     */
    private TestConstants() {
        super();
    }

    /**
     * Die Fehlermeldung, die bei einem 400 erwartet wird
     */
    public static final String EXPECTED_BAD_REQUEST_MESSAGE = """
            Ihre Angaben konnten nicht verarbeitet werden. Bitte überprüfen Sie Ihre Eingaben. \
            Wenn Sie keinen Fehler finden, senden Sie bitte eine Mail und fügen Sie nach Möglichkeit\
            einen Screenshot hinzu.
                   """;

}
