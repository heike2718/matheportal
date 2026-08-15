package de.mathejungalt.minikaenguru.admin.infrastructure.resources;

import java.util.stream.Stream;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.admin.domain.generated.ErrorResponse;

import io.restassured.http.Method;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.params.provider.Arguments.arguments;

@QuarkusTest
@TestHTTPEndpoint(SchulkatalogResource.class)
public class SchulkatalogResourceInputValidationTest {

    static Stream<Arguments> endpoints() {
        return Stream
                .of(arguments("GET", "/laender/ABCDEF/orte"), arguments("GET", "laender/hähä/orte"),
                        arguments("GET", "/orte/hähä/schulen"), arguments("GET", "/orte/123456789/schulen"));
    }

    @ParameterizedTest
    @MethodSource("endpoints")
    @TestSecurity(user = "test-user", roles = { "ADMIN" })
    void should_return_400_when_input_invalid(final Method method, final String path) {

        final ErrorResponse result = given()
                .when()
                .request(method, path)
                .then()
                .statusCode(400)
                .and()
                .extract()
                .as(ErrorResponse.class);

        assertEquals("Die Anfrage ist nicht valide.", result.getMessage());
        assertEquals(1, result.getConstraintViolations().size());

    }
}
