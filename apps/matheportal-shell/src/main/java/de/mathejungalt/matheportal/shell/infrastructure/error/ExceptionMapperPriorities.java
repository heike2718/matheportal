package de.mathejungalt.matheportal.shell.infrastructure.error;

/**
 * ExceptionMapperPriorities.
 */
public final class ExceptionMapperPriorities {

    /**
     * für ConstraintViolationExceptions.
     */
    public static final int VALIDATION = 1;

    /**
     * für Exceptions aus der Kommunikation mit iam.
     */
    public static final int IAM_CLIENT = 100;

    /**
     * für Authentifizierungsfehler.
     */
    public static final int LOGIN = 200;

    /**
     * für abgelaufene oder ungültige Sessions.
     */
    public static final int SESSION = 300;

    /**
     * für alle anderen RuntimeExceptions.
     */
    public static final int FALLBACK = 1000;

    private ExceptionMapperPriorities() {
    }
}
