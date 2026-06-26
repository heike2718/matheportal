package de.mathejungalt.authsessions.api;

/**
 * SecurityIdentityAugmentationState
 */
public enum SecurityIdentityAugmentationState {

    /**
     * Die Session wurde noch nicht gegen die anwendungsspezifische Datenbank geprüft.
     */
    NOT_AUGMENTED,

    /**
     * Die Session wurde geprüft und um anwendungsspezifische Berechtigungen erweitert.
     */
    AUGMENTED,

    /**
     * Die Session wurde geprüft, aber es gab keine anwendungsspezifischen Berechtigungen.
     */
    NO_AUGMENTATION

}
