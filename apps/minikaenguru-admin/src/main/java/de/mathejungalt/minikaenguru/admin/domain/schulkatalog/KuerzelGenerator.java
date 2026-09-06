package de.mathejungalt.minikaenguru.admin.domain.schulkatalog;

import java.util.concurrent.ThreadLocalRandom;

import jakarta.enterprise.context.ApplicationScoped;

/**
 * KuerzelGenerator.
 */
@ApplicationScoped
public class KuerzelGenerator {

    private static final char[] CHAR_POOL = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789".toCharArray();

    /**
     * Generiert einen String der Länge length.
     *
     * @param length int
     * @return String
     */
    String generateKuerzel(final int length) {

        final StringBuilder stringBuilder = new StringBuilder();

        for (int loop = 0; loop < length; loop++) {

            final int index = ThreadLocalRandom.current().nextInt(CHAR_POOL.length);
            stringBuilder.append(CHAR_POOL[index]);
        }

        return stringBuilder.toString();
    }
}
