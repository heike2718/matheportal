package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Schule;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.MockAugmentSessionTestProfile;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@QuarkusTest
@TestHTTPEndpoint(LehrpersonResource.class)
@TestProfile(MockAugmentSessionTestProfile.class)
public class LehrpersonResourceTest {

    private static final String UUID_PRIVATPERSON_READ = "5af5219c-6c56-49dc-ae66-e90134ed1091";

    @Test
    @TestSecurity(user = "412b67dc-132f-465a-a3c3-468269e866cb")
    void should_loadMySchools_work() {

        final Schule[] schulen = given()
                .accept(ContentType.JSON)
                .get()
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(Schule[].class);

        assertEquals(10, schulen.length);
        {
            final Optional<Schule> optSchule = Arrays
                    .stream(schulen)
                    .filter(schule -> "0LDKMW8U".equals(schule.getKuerzel()))
                    .findFirst();

            assertTrue(optSchule.isPresent());
            final Schule schule = optSchule.get();
            assertAll(() -> assertNotNull(schule.getOrt()), () -> assertNotNull(schule.getOrt().getLand()));
        }
        {
            final Optional<Schule> optSchule = Arrays
                    .stream(schulen)
                    .filter(schule -> "G1HDI46O".equals(schule.getKuerzel()))
                    .findFirst();

            assertTrue(optSchule.isPresent());
            final Schule schule = optSchule.get();
            assertAll(() -> assertNotNull(schule.getOrt()), () -> assertNotNull(schule.getOrt().getLand()));
        }

    }

    @Test
    void should_loadMySchools_return_401_when_not_logged_in() {
        given().accept(ContentType.JSON).get().then().statusCode(401);
    }

    @Test
    @TestSecurity(user = "abcdef")
    void should_loadMySchools_reurn_403_when_kein_wettbwerbsdurchfuehrender() {

        given().accept(ContentType.JSON).get().then().statusCode(403);
    }

    @Test
    @TestSecurity(user = UUID_PRIVATPERSON_READ)
    void should_loadMySchools_reurn_403_when_privatperson() {

        given().accept(ContentType.JSON).get().then().statusCode(403);
    }

}
