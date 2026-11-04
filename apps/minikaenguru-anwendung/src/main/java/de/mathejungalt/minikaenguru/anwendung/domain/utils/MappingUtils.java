package de.mathejungalt.minikaenguru.anwendung.domain.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * MappingUtils.
 */
public final class MappingUtils {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");

    /**
     * MappingUtils.
     */
    private MappingUtils() {
        //
    }

    /**
     * Formatiert das gegebene localDateTime zum Format 'dd.MM.yyyy HH:mm:ss'.
     *
     * @param localDateTime LocalDateTime
     * @return String und null wenn localDateTime null ist.
     */
    public static String formatToDateWithTimeStringNullSave(final LocalDateTime localDateTime) {
        if (localDateTime == null) {
            return null;
        }

        return DATE_TIME_FORMATTER.format(localDateTime);
    }

}
