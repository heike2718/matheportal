package de.mathejungalt.minikaenguru.anwendung.infrastructure.error;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.annotation.Priority;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import org.apache.commons.lang3.StringUtils;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * ConstraintViolationExceptionMapper.
 */
@Provider
@Priority(ExceptionMapperPriorities.VALIDATION)
@Slf4j
public final class ConstraintViolationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {

    private static final String MESSAGE = """
            Das hat leider nicht funktioniert. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut. \
            Wenn Sie keinen Fehler finden, senden Sie bitte eine Mail und fügen Sie nach Möglichkeit \
            einen Screenshot hinzu.
                   """;

    @Override
    public Response toResponse(final ConstraintViolationException exception) {

        final List<String> details = exception
                .getConstraintViolations()
                .stream()
                .map(this::map)
                .collect(Collectors.toList());

        log.warn("Bad request: {}", StringUtils.join(details));

        final ErrorResponse errorResponse = new ErrorResponse(MESSAGE);

        return Response.status(Status.BAD_REQUEST).entity(errorResponse).build();
    }

    private String map(@SuppressWarnings("rawtypes") final ConstraintViolation constraintViolation) {
        final String path = this.simplifyPath(constraintViolation.getPropertyPath().toString());
        final String message = constraintViolation.getMessage();

        return path + ": " + message;
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
