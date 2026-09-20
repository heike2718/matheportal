package de.mathejungalt.matheportal.validation;

import org.apache.commons.lang3.StringUtils;

/**
 * NormalizeSpaceDelegate.
 */
public final class NormalizeSpaceDelegate {

    /**
     * NormalizeSpaceDelegate.
     */
    private NormalizeSpaceDelegate() {
        super();
    }

    /**
     * Entfernt führende und endende Leerzeichen und schrumpft mehrere aufeinanderfolgende Leerzeichen zu einem
     * zusammen.
     *
     * @param text String. darf null sein
     * @return String (null wenn text null)
     */
    public static String normalizeText(final String text) {
        return StringUtils.normalizeSpace(text);
    }

}
