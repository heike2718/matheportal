package de.mathejungalt.minikaenguru.anwendung.infrastructure.restclient;

import java.time.temporal.ChronoUnit;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import org.eclipse.microprofile.faulttolerance.Retry;
import org.eclipse.microprofile.faulttolerance.Timeout;
import org.eclipse.microprofile.rest.client.annotation.RegisterProvider;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende.UserDetails;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.filter.RestClientLoggingFilter;

@RegisterRestClient(configKey = "authprovider")
@RegisterProvider(RestClientLoggingFilter.class)
@Path("api")
@Produces(MediaType.APPLICATION_JSON)
@FunctionalInterface
public interface AuthproviderRestClient {

    /**
     * Anzahl erneuter Versuche, wenn IAM zu lange braucht.
     */
    int MAX_RETRIES = 3;

    /**
     * Wartezeit zwischen 2 REST-Requests im Fehlerfall.
     */
    int DELAY_SECONDS = 1000;

    /**
     * Timeout.
     */
    int TIMEOUT_SECONDS = 10;

    /**
     * Läd die Details des Users mit einer gegebenen uuid.
     *
     * @param uuid         String
     * @param clientId     String
     * @param clientSecret String
     * @param nonce        String
     * @return UserDetails
     */
    @GET
    @Path("/users/{uuid}/name")
    @Retry(maxRetries = MAX_RETRIES, delay = DELAY_SECONDS)
    @Timeout(value = TIMEOUT_SECONDS, unit = ChronoUnit.SECONDS)
    UserDetails getUserDetails(@PathParam("uuid") String uuid, @HeaderParam("X-CLIENT-ID") String clientId,
            @HeaderParam("X-CLIENT-SECRET") String clientSecret, @HeaderParam("X-NONCE") String nonce);

}
