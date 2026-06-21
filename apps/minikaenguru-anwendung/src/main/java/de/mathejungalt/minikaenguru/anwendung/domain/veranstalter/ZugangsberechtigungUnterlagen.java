package de.mathejungalt.minikaenguru.anwendung.domain.veranstalter;

/**
 * ZugangsberechtigungUnterlagen.
 */
public enum ZugangsberechtigungUnterlagen {

    /**
     * der Standardzugang, also entsprechend der Freischaltungstermine im Wettbewerb.
     */
    DEFAULT,

    /**
     * keine Zugangsberechtigung.
     */
    ENTZOGEN,

    /**
     * ab jetzt, also auch früher als die Freischaltungstermine erlauben.
     */
    ERTEILT;

}
