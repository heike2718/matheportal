package de.mathejungalt.matheportal.shell.domain.exception;

import de.mathejungalt.matheportal.shell.domain.clientauth.ResponsePayload;

/**
 * IamResponseException.
 */
public class IamResponseException extends RuntimeException {

    private final int httpStatus;

    private final ResponsePayload responsePayload;

    public IamResponseException(final String message, final int httpStatus, final ResponsePayload responsePayload) {

        super(message);
        this.httpStatus = httpStatus;
        this.responsePayload = responsePayload;

    }

    public int getHttpStatus() {
        return httpStatus;
    }

    public ResponsePayload getResponsePayload() {
        return responsePayload;
    }

}
