package de.mathejungalt.minikaenguru.anwendung.domain.exception;

import java.util.Optional;

/**
 * ExcpetionUtils. Zur Inspection von Exceptions
 */
public final class ExcpetionUtils {

    private ExcpetionUtils() {
        super();
    }

    /**
     * Sucht im Stack einer Exception nach einer verursachenden Exception.
     *
     * @param <T>       Typ der gesuchten Exception
     * @param throwable Throwable
     * @param causeType Class Typ der interessierenden Exception
     * @return Optional
     */
    public static <T extends Throwable> Optional<T> findCause(final Throwable throwable, final Class<T> causeType) {
        Throwable current = throwable;

        while (current != null) {
            if (causeType.isInstance(current)) {
                return Optional.of(causeType.cast(current));
            }
            current = current.getCause();
        }

        return Optional.empty();
    }
}
