package de.mathejungalt.matheportal.validation;

/**
 * ValidationPatterns.
 */
public final class ValidationPatterns {

    /**
     * Das Pattern für alle freien Texte in Minikänguru.
     */
    public static final String MINIKAENGURU_TEXT_PATTERN = "^[\\p{sc=Latin}\\p{M}\\p{N}\\p{P}\\p{S}\\p{Zs}]*$";

    /**
     * ValidationPatterns
     */
    private ValidationPatterns() {
        super();
    }

}
