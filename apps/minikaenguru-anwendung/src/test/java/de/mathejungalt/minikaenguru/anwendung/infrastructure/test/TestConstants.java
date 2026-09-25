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
            Das hat leider nicht funktioniert. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut. \
            Wenn Sie keinen Fehler finden, senden Sie bitte eine Mail und fügen Sie nach Möglichkeit \
            einen Screenshot hinzu.
                   """;

}
