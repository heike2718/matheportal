package de.mathejungalt.minikaenguru.anwendung.infrastructure.security;

/**
 * SecurityIdentityAttributeKeys.
 */
public final class SecurityIdentityAttributeKeys {

    /**
     * Key für das attribute, das den fullName transportiert. Kann dann mit
     * SecurityIdentity.getAttribute(SessionIdAttributeKeys.FULL_NAME) herausgeholt werden.
     */
    public static final String FULL_NAME = "fullName";

    /**
     * Key für das attribute, das die sessionId transportiert. Kann dann mit
     * SecurityIdentity.getAttribute(SessionIdAttributeKeys.SESSIION_ID) herausgeholt werden.
     */
    public static final String SESSIION_ID = "sessionId";

    /**
     * Key für das attribute, das das flag augmented transportiert. Kann dann mit
     * SecurityIdentity.getAttribute(SessionIdAttributeKeys.AUGMENTED) herausgeholt werden. Dient als Zeichen dafür,
     * dass die Security
     */
    public static final String AUGMENTATION_STATE = "augmentationState";

    private SecurityIdentityAttributeKeys() {
        super();
    }

}
