package de.mathejungalt.matheportal.shell.infrastructure.routing;

import java.util.Map;
import java.util.function.Predicate;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import io.quarkus.vertx.web.RouteFilter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.vertx.ext.web.RoutingContext;

/**
 * SPARouteFilter.
 */
public class SPARouteFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(SPARouteFilter.class);

    private static final Predicate<String> FILE_NAME_PREDICATE = Pattern
            .compile(".*[.][a-zA-Z\\d]+")
            .asMatchPredicate();

    private static final String API_PREFIX = "/api/";

    private static final String APP_PLUS_API_PREFIX = "/matheportal-shell" + API_PREFIX;

    private static final String DEFAULT_APP = "/matheportal-shell/";

    private static final String[] PATH_PREFIXES = { DEFAULT_APP };

    @RouteFilter(100)
    void apiFilter(RoutingContext routingContext) {

        final String path = routingContext.normalizedPath();
        LOGGER.debug("Check reroute with path: " + path);

        if (path.startsWith(APP_PLUS_API_PREFIX)) {

            // reroute to REST-API
            String rerouted = path.replaceFirst(DEFAULT_APP, "/") + getQueryParameters(routingContext);
            LOGGER.debug("(2) rc.reroute: " + rerouted);
            routingContext.reroute(rerouted);
        } else {

            LOGGER.debug("(3)");

            if (this.doesNotNeedRedirect(path)) {

                LOGGER.debug("(4)");
                routingContext.next();
            } else {

                LOGGER.debug("(5)");

                if (path.startsWith(DEFAULT_APP)) {

                    // I0094: deep-Angular-Router-Links (z.B. /matheportal-shell/xxx/)
                    // müssen zur SPA Grund-URL
                    // (/matheportal-shell/) umgeleitet werden. Danach übernimmt wieder das
                    // Angular-Routing
                    // Jetzt funktionieren Bookmarking, Back-Button sowie F5 ohne dass es ein 404
                    // gibt.
                    String[] tokens = path.split("/");
                    LOGGER.debug("(6) Anzahl token = {}", tokens.length);

                    if (tokens.length > 2) {

                        // /raetselbaukasten/ => 2 tokens!
                        String rerouted = "/" + tokens[1] + "/";
                        LOGGER.debug("(7) Umleiten von deep Angular router links: {} nach {} ", path, rerouted);
                        routingContext.reroute(rerouted);
                    } else {

                        LOGGER.debug("(8) kein Umleiten der SPA-Grund-URL {} ", path);
                        routingContext.next();
                    }

                } else {

                    LOGGER.debug("(9) global else => rc.next()");
                    routingContext.next();
                }
            }
        }

    }

    private boolean doesNotNeedRedirect(final String path) {

        if (path.equals("/")) {

            LOGGER.debug("(3-1) kein Umleiten von /");
            return true;
        }

        if (FILE_NAME_PREDICATE.test(path)) {

            LOGGER
                    .debug("(3-2) kein Umleiten von statischen files aus src/main/resources/META-INF/resources/raetselbaukasten/");
            return true;
        }

        if (Stream.of(PATH_PREFIXES).noneMatch(path::startsWith)) {

            LOGGER.debug("(3-3) kein Umleiten von Pfaden, die nicht mit {} beginnen", DEFAULT_APP);
            return true;
        }

        LOGGER.debug("(3-4)");
        return false;
    }

    private String getQueryParameters(final RoutingContext routingContext) {

        Map<String, String> queryParams = routingContext
                .queryParams()
                .entries()
                .stream()
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        if (queryParams.isEmpty()) {

            return "";
        }

        StringBuffer sb = new StringBuffer("?");
        queryParams.forEach((key, value) -> sb.append(key).append("=").append(value).append("&"));

        sb.deleteCharAt(sb.length() - 1);

        return sb.toString();

    }

}
