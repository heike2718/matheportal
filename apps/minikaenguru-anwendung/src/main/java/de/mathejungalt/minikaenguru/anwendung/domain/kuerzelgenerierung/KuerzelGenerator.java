package de.mathejungalt.minikaenguru.anwendung.domain.kuerzelgenerierung;

import java.util.Random;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class KuerzelGenerator {

    private static final char[] CHAR_POOL = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789".toCharArray();

    String generateKuerzel(final int length) {

        final StringBuilder stringBuilder = new StringBuilder();

        for (int loop = 0; loop < length; loop++) {

            final int index = new Random().nextInt(CHAR_POOL.length);
            stringBuilder.append(CHAR_POOL[index]);
        }

        return stringBuilder.toString();
    }

}
