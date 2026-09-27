package de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

import de.mathejungalt.minikaenguru.anwendung.domain.authorization.AuthorizationService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@QuarkusTest
public class KuerzelZugriffInterceptorTest {

    @Inject
    AuthorizationTestService testService;

    @InjectMock
    AuthorizationService authorizationService;

    @Test
    void should_continue_when_ok() {

        // arrange
        doNothing().when(authorizationService).checkAuthorization(anyString(), anyString());

        // act
        testService.loadTeilnahme("K1234567");

        // assert
        verify(authorizationService).checkAuthorization(anyString(), anyString());
    }

    @Test
    void should_throw_an_exception_when_annotated_without_context() {

        // act
        final IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> testService.withoutAuditContext("K1234567"));

        verify(authorizationService, never()).checkAuthorization(anyString(), anyString());

        assertEquals(
                "Missing authorization context: public void de.mathejungalt.minikaenguru.anwendung.domain.authorization.AuthorizationTestService.withoutAuditContext(java.lang.String)",
                exception.getMessage());
    }

    @Test
    void should_throw_an_exception_when_0_AuthorizationKey() {

        // act
        final IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> testService.withoutAuthorizationKey("K1234567"));

        verify(authorizationService, never()).checkAuthorization(anyString(), anyString());

        assertEquals(
                "Exactly one @AuthorizationKey is required: public void de.mathejungalt.minikaenguru.anwendung.domain.authorization.AuthorizationTestService.withoutAuthorizationKey(java.lang.String)",
                exception.getMessage());
    }

    @Test
    void should_throw_an_exception_when_more_than_one_AuthorizationKey() {

        // act
        final IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> testService.withMultipleAuthorizationKeys("K1234567", "P123456789"));

        verify(authorizationService, never()).checkAuthorization(anyString(), anyString());

        assertEquals(
                "Exactly one @AuthorizationKey is required: public void de.mathejungalt.minikaenguru.anwendung.domain.authorization.AuthorizationTestService.withMultipleAuthorizationKeys(java.lang.String,java.lang.String)",
                exception.getMessage());
    }

    @Test
    void should_throw_an_exception_when_AuthorizationKey_with_invalid_type() {

        // act
        final IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> testService.withInvalidAuthorizationKey(1L));

        verify(authorizationService, never()).checkAuthorization(anyString(), anyString());

        assertEquals(
                "@AuthorizationKey requires a String parameter: public void de.mathejungalt.minikaenguru.anwendung.domain.authorization.AuthorizationTestService.withInvalidAuthorizationKey(java.lang.Long)",
                exception.getMessage());
    }
}
