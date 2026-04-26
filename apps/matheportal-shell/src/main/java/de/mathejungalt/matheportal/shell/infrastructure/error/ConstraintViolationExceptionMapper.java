package de.mathejungalt.matheportal.shell.infrastructure.error;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.annotation.Priority;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.matheportal.shell.domain.generated.ConstraintViolationDetail;
import de.mathejungalt.matheportal.shell.domain.generated.ErrorResponse;

/**
 * ConstraintViolationExceptionMapper.
 */
@Provider
@Priority(ExceptionMapperPriorities.VALIDATION)
public final class ConstraintViolationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {

    @Override
    public Response toResponse(final ConstraintViolationException exception) {

        final List<ConstraintViolationDetail> details = exception
                .getConstraintViolations()
                .stream()
                .map(v -> map(v))
                .collect(Collectors.toList());

        final ErrorResponse errorResponse = new ErrorResponse("Die Anfrage ist nicht valide");
        errorResponse.setConnstraintViolations(details);

        return Response.status(Status.BAD_REQUEST).entity(errorResponse).build();
    }

    private ConstraintViolationDetail map(final ConstraintViolation constraintViolation) {
        final String path = this.simplifyPath(constraintViolation.getPropertyPath().toString());
        final String message = constraintViolation.getMessage();

        final ConstraintViolationDetail result = new ConstraintViolationDetail();
        result.setField(path);
        result.setMessage(message);

        return result;
    }

    private String simplifyPath(final String path) {
        if (path == null) {
            return null;
        }

        final int lastDot = path.lastIndexOf('.');
        if (lastDot >= 0 && lastDot + 1 < path.length()) {
            return path.substring(lastDot + 1);
        }

        return path;
    }

}
