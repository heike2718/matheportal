package de.mathejungalt.minikaenguru.anwendung.infrastructure.resources;

import java.util.List;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.security.TestSecurity;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.PrivatpersonWettbewerbskontext;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.test.MockAugmentSessionTestProfile;

import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@TestHTTPEndpoint(PrivatpersonResource.class)
@TestProfile(MockAugmentSessionTestProfile.class)
public class PrivatpersonResourceTest {

    private static final String UUID_LEHRPERSON_READ = "5a35eb31-4edb-452b-9f37-980e52885677";
    private static final String UUID_PRIVATPERSON_READ = "5af5219c-6c56-49dc-ae66-e90134ed1091";

    @Test
    @TestSecurity(user = UUID_PRIVATPERSON_READ)
    void should_loadMyWettbewerbskontext_work() {

        final PrivatpersonWettbewerbskontext result = given()
                .accept(ContentType.JSON)
                .get("/wettbewerbskontext")
                .then()
                .statusCode(200)
                .and()
                .assertThat()
                .contentType(ContentType.JSON)
                .and()
                .extract()
                .as(PrivatpersonWettbewerbskontext.class);

        assertEquals(true, result.getAnmeldungMoeglich());
        final List<TeilnahmeReferenz> teilnahmeRefs = result.getTeilnahmerefs();
        assertEquals(1, teilnahmeRefs.size());
        final TeilnahmeReferenz teilnahmeRef = teilnahmeRefs.getFirst();
        assertEquals(2017, teilnahmeRef.getJahr());
    }

    @Test
    void should_loadMyWettbewerbskontext_return_401_when_not_loggedIn() {

        given().accept(ContentType.JSON).get("/wettbewerbskontext").then().statusCode(401);
    }

    @Test
    @TestSecurity(user = "abcdef")
    void should_loadMyWettbewerbskontext_return_403_when_kein_wettbewerbsdurchfuehrender() {
        given().accept(ContentType.JSON).get("/wettbewerbskontext").then().statusCode(403);
    }

    @Test
    @TestSecurity(user = UUID_LEHRPERSON_READ)
    void should_loadMyWettbewerbskontext_return_403_when_kein_Lehrperson() {
        given().accept(ContentType.JSON).get("/wettbewerbskontext").then().statusCode(403);
    }

}
