package de.mathejungalt.minikaenguru.admin.domain.schulkatalog;

import java.util.Random;

import jakarta.enterprise.context.ApplicationScoped;

/**
 * KuerzelGenerator.
 */
@ApplicationScoped
public class KuerzelGenerator {

    private static final char[] CHAR_POOL = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789".toCharArray();

    String generateKuerzel(final int length) {

        final StringBuilder stringBuilder = new StringBuilder();
        final Random random = new Random();

        for (int loop = 0; loop < length; loop++) {

            final int index = random.nextInt(CHAR_POOL.length);
            stringBuilder.append(CHAR_POOL[index]);
        }

        return stringBuilder.toString();
    }
}
