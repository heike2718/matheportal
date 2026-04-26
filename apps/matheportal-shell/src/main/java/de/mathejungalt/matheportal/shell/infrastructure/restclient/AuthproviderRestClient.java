package de.mathejungalt.matheportal.shell.infrastructure.restclient;

import java.time.temporal.ChronoUnit;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.faulttolerance.Retry;
import org.eclipse.microprofile.faulttolerance.Timeout;
import org.eclipse.microprofile.rest.client.annotation.RegisterProvider;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import de.mathejungalt.matheportal.shell.domain.clientauth.OAuthClientCredentials;
import de.mathejungalt.matheportal.shell.infrastructure.filter.RestClientLoggingFilter;

/**
 * AuthproviderRestClient.
 */
@RegisterRestClient(configKey = "authprovider")
@RegisterProvider(RestClientLoggingFilter.class)
@Path("api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
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
     * accesstoken-API des IAM.
     * 
     * @param clientSecrets OAuthClientCredentials
     * @return Response
     */
    @POST
    @Path("clients/client/accesstoken")
    @Retry(maxRetries = MAX_RETRIES, delay = DELAY_SECONDS)
    @Timeout(value = TIMEOUT_SECONDS, unit = ChronoUnit.SECONDS)
    Response authenticateClient(OAuthClientCredentials clientSecrets);

    /**
     * Tauscht das oneTimeToken gegen ein JWT für den sich authentifizierenden
     * Benutzer.
     * 
     * @param oneTimeToken      String
     * @param clientCredentials OAuthClientCredentials
     * @return Response
     */
    @PUT
    @Path("token/exchange/{oneTimeToken}")
    @Retry(maxRetries = MAX_RETRIES, delay = DELAY_SECONDS)
    @Timeout(value = TIMEOUT_SECONDS, unit = ChronoUnit.SECONDS)
    public Response exchangeOneTimeTokenWithJwt(@PathParam(value = "oneTimeToken") final String oneTimeToken,
            final OAuthClientCredentials clientCredentials);

}
