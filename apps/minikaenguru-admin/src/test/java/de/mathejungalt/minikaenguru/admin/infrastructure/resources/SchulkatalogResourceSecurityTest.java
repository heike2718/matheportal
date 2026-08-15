package de.mathejungalt.minikaenguru.admin.infrastructure.resources;

import java.util.stream.Stream;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;

import io.restassured.http.Method;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.params.provider.Arguments.arguments;

@QuarkusTest
@TestHTTPEndpoint(SchulkatalogResource.class)
public class SchulkatalogResourceSecurityTest {

    static Stream<Arguments> endpoints() {
        return Stream
                .of(arguments("GET", "/laender"), arguments("GET", "laender/DE-TH/orte"),
                        arguments("GET", "/orte/46AL373N/schulen"));
    }

    @ParameterizedTest(name = "[{index}] {0} {1} -> 401 Anonym")
    @MethodSource("endpoints")
    void should_return_401_when_not_authenticaded(final Method method, final String path) {
        given().when().request(method, path).then().statusCode(401);
    }

    @ParameterizedTest(name = "[{index}] {0} {1} -> 403 Falsche Rolle")
    @MethodSource("endpoints")
    @TestSecurity(user = "test-user", roles = { "STANDARD" })
    void should_return_403_when_not_admin(final Method method, final String path) {
        given().when().request(method, path).then().statusCode(403);
    }
}
