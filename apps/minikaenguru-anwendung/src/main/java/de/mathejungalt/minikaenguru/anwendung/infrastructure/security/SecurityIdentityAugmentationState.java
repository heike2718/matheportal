package de.mathejungalt.minikaenguru.anwendung.infrastructure.security;

/**
 * SecurityIdentityAugmentationState
 */
public enum SecurityIdentityAugmentationState {

    /**
     * Wenn die SecurityIdentity bereits angereichert wurde, wird dies als Attribut mit dem key augmentationState
     * gesetzt.
     */
    AUGMENTED,

    /**
     * Wenn die SecurityIdentity noch nicht angereichert wurde, wird dies als Attribut mit dem key augmentationState
     * gesetzt.
     */
    NOT_AUGMENTED;

}
