package de.mathejungalt.matheportal.shell.domain.exception;

import de.mathejungalt.matheportal.shell.domain.clientauth.IamClientErrorType;

/**
 * IamUnreachableException.
 */
public class IamUnreachableException extends IamClientException {

    private static final long serialVersionUID = 1L;

    public IamUnreachableException(final String message, final Throwable cause) {
        super(message, cause, IamClientErrorType.IAM_UNREACHABLE);
    }

}
