package de.mathejungalt.minikaenguru.anwendung.domain.shared;

/**
 * PatternConstants.
 */
public final class PatternConstants {

    public static final String REGEXP_KUERZEL = "^[A-Z0-9]*$";

    public static final String REGEXP_UUID = "^[0-9(a-f|A-F)]{8}-[0-9(a-f|A-F)]{4}-4[0-9(a-f|A-F)]{3}-[89ab][0-9(a-f|A-F)]{3}-[0-9(a-f|A-F)]{12}$";

    public static final int MAX_SIZE_KUERZEL_SCHULKATALOG = 8;

    public static final int MAX_SIZE_UUID = 36;

    /**
     * PatternConstants.
     */
    private PatternConstants() {
        super();
    }

}
