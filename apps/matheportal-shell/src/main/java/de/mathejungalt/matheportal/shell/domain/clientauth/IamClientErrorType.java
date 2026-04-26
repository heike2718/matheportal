package de.mathejungalt.matheportal.shell.domain.clientauth;

/**
 * IamClientErrorType.
 */
public enum IamClientErrorType {

    /**
     * 503 - RestCommunicationFailedException.
     */
    IAM_UNREACHABLE,

    /**
     * 500 - IamResponseException.
     */
    IAM_ERROR_RESPONSE,

    /**
     * 500 - RestResponseProcessingException.
     */
    IAM_CONTRACT_VIOLATION,

    /**
     * 500 - ClientAuthException.
     */
    SECURITY_VIOLATION
}
