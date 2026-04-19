package de.mathejungalt.matheportal.shell.infrastructure.error;

/**
 * ExceptionMapperPriorities.
 */
public final class ExceptionMapperPriorities {

    public static final int VALIDATION = 1; // ConstraintViolationException
    public static final int IAM_CLIENT = 100; // IamClientException
    public static final int LOGIN = 200; // LoginFailedException
    public static final int FALLBACK = 1000; // RuntimeException

    private ExceptionMapperPriorities() {
    }
}
