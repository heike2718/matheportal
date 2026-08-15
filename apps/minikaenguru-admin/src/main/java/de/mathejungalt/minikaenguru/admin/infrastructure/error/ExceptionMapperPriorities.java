package de.mathejungalt.minikaenguru.admin.infrastructure.error;

/**
 * ExceptionMapperPriorities.
 */
public final class ExceptionMapperPriorities {

    /**
     * für ConstraintViolationExceptions.
     */
    public static final int VALIDATION = 1;

    /**
     * für fachliche Dinge wie conflict
     */
    public static final int APPLICATION = 100;

    /**
     * für alle anderen RuntimeExceptions.
     */
    public static final int FALLBACK = 1000;

    private ExceptionMapperPriorities() {
        super();
    }

}
