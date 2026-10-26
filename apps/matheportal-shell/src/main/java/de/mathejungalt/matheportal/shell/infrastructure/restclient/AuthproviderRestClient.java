package de.mathejungalt.matheportal.shell.infrastructure.restclient;

import java.time.temporal.ChronoUnit;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import org.eclipse.microprofile.faulttolerance.Retry;
import org.eclipse.microprofile.faulttolerance.Timeout;
import org.eclipse.microprofile.faulttolerance.exceptions.TimeoutException;
import org.eclipse.microprofile.rest.client.annotation.RegisterProvider;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import de.mathejungalt.matheportal.shell.domain.clientauth.OAuthClientCredentials;
import de.mathejungalt.matheportal.shell.domain.clientauth.OauthClientAccessToken;
import de.mathejungalt.matheportal.shell.domain.login.ExchangeTokenResponse;
import de.mathejungalt.matheportal.shell.infrastructure.filter.RestClientLoggingFilter;

/**
 * AuthproviderRestClient.
 */
@RegisterRestClient(configKey = "authprovider")
@RegisterProvider(RestClientLoggingFilter.class)
@RegisterProvider(AuthproviderRestClientResponseExceptionMapper.class)
@Path("api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface AuthproviderRestClient {

    /**
     * accesstoken-API des IAM.
     *
     * @param clientSecrets OAuthClientCredentials
     * @return Response
     */
    @POST
    @Path("clients/client/accesstoken/v2")
    @Retry(maxRetries = 0, delay = 200, delayUnit = ChronoUnit.MILLIS, retryOn = TimeoutException.class)
    @Timeout(value = 10000, unit = ChronoUnit.MILLIS) // NOPMD
    OauthClientAccessToken authenticateClient(OAuthClientCredentials clientSecrets);

    /**
     * Tauscht das oneTimeToken gegen ein JWT für den sich authentifizierenden Benutzer.
     *
     * @param oneTimeToken      String
     * @param clientCredentials OAuthClientCredentials
     * @return Response
     */
    @PUT
    @Path("token/exchange/{oneTimeToken}/v2")
    @Retry(maxRetries = 0, delay = 200, delayUnit = ChronoUnit.MILLIS, retryOn = TimeoutException.class)
    @Timeout(value = 10000, unit = ChronoUnit.MILLIS) // NOPMD
    ExchangeTokenResponse exchangeOneTimeTokenWithJwt(@PathParam("oneTimeToken") String oneTimeToken,
            OAuthClientCredentials clientCredentials);

}
