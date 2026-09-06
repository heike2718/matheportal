package de.mathejungalt.minikaenguru.admin.domain.utils;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import org.apache.commons.io.IOUtils;

import de.mathejungalt.minikaenguru.admin.domain.exception.AdminRuntimeException;

/**
 * ClasspathResourceUtils.
 */
public final class ClasspathResourceUtils {

    /**
     * Läd einen Text aus dem Classpath.
     *
     * @param classpathPath String der pfad.
     * @return String
     */
    public static String loadTextFromClasspath(final String classpathPath) {
        try (InputStream in = ClasspathResourceUtils.class.getResourceAsStream(classpathPath)) {

            final StringWriter swText = new StringWriter();
            IOUtils.copy(in, swText, Charset.forName(StandardCharsets.UTF_8.name()));
            return swText.toString();
        } catch (final IOException e) {
            throw new AdminRuntimeException("Ressource aus dem Classpath konnte nicht geladen werden: " + classpathPath,
                    e);
        }
    }

}
