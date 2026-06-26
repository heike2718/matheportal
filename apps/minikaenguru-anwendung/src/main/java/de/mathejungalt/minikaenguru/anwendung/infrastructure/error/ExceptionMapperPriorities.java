package de.mathejungalt.minikaenguru.anwendung.infrastructure.error;

/**
 * ExceptionMapperPriorities.
 */
public final class ExceptionMapperPriorities {

    /**
     * für ConstraintViolationExceptions.
     */
    public static final int VALIDATION = 1;

    /**
     * für alle anderen RuntimeExceptions.
     */
    public static final int FALLBACK = 1000;

    private ExceptionMapperPriorities() {
        super();
    }

}
