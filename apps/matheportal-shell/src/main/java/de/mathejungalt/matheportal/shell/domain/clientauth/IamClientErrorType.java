package de.mathejungalt.matheportal.shell.domain.clientauth;

/**
 * IamClientErrorType.
 */
public enum IamClientErrorType {
    IAM_UNREACHABLE, // 503 → RestCommunicationFailedException
    IAM_ERROR_RESPONSE, // 500 → IamResponseException
    IAM_CONTRACT_VIOLATION, // 500 → RestResponseProcessingException
    SECURITY_VIOLATION // 500 → ClientAuthException
}
