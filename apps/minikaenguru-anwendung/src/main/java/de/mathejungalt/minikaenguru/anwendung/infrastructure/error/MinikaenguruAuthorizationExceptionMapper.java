package de.mathejungalt.minikaenguru.anwendung.infrastructure.error;

import jakarta.annotation.Priority;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import de.mathejungalt.minikaenguru.anwendung.domain.authorization.MinikaenguruAuthorizationException;

import lombok.extern.slf4j.Slf4j;

/**
 * MinikaenguruAuthorizationExceptionMapper
 */
@Provider
@Priority(ExceptionMapperPriorities.APPLICATION)
@Slf4j
public class MinikaenguruAuthorizationExceptionMapper implements ExceptionMapper<MinikaenguruAuthorizationException> {

    @Override
    public Response toResponse(final MinikaenguruAuthorizationException exception) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'toResponse'");
    }

}
