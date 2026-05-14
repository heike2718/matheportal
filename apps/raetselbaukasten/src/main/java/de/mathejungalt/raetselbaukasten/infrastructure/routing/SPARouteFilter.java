package de.mathejungalt.raetselbaukasten.infrastructure.routing;

import java.util.Map;
import java.util.function.Predicate;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import io.quarkus.vertx.web.RouteFilter;

import io.vertx.ext.web.RoutingContext;
import lombok.extern.slf4j.Slf4j;

/**
 * SPARouteFilter
 */
@Slf4j
public final class SPARouteFilter {

    private static final int MAX_TOKEN_COUNT = 2;

    private static final Predicate<String> FILE_NAME_PREDICATE = Pattern
            .compile(".*[.][a-zA-Z\\d]+")
            .asMatchPredicate();

    private static final String API_PREFIX = "/api/";

    private static final String APP_PLUS_API_PREFIX = "/raetselbaukasten" + API_PREFIX;

    private static final String DEFAULT_APP = "/raetselbaukasten/";

    private static final String[] PATH_PREFIXES = { DEFAULT_APP };

    @RouteFilter(100)
    void apiFilter(final RoutingContext routingContext) {

        final String path = routingContext.normalizedPath();
        log.debug("Check reroute with path: " + path);

        if (path.startsWith(APP_PLUS_API_PREFIX)) {

            // reroute to REST-API
            final String rerouted = path.replaceFirst(DEFAULT_APP, "/") + getQueryParameters(routingContext);
            log.debug("(2) rc.reroute: " + rerouted);
            routingContext.reroute(rerouted);
        } else {

            log.debug("(3)");

            if (this.doesNotNeedRedirect(path)) {

                log.debug("(4)");
                routingContext.next();
            } else {

                log.debug("(5)");

                if (path.startsWith(DEFAULT_APP)) {

                    // I0094: deep-Angular-Router-Links (z.B. /raetselbaukasten/xxx/)
                    // müssen zur SPA Grund-URL
                    // (/raetselbaukasten/) umgeleitet werden. Danach übernimmt wieder das
                    // Angular-Routing
                    // Jetzt funktionieren Bookmarking, Back-Button sowie F5 ohne dass es ein 404
                    // gibt.
                    final String[] tokens = path.split("/");
                    log.debug("(6) Anzahl token = {}", tokens.length);

                    if (tokens.length > MAX_TOKEN_COUNT) {

                        final String rerouted = "/" + tokens[1] + "/";
                        log.debug("(7) Umleiten von deep Angular router links: {} nach {} ", path, rerouted);
                        routingContext.reroute(rerouted);
                    } else {

                        log.debug("(8) kein Umleiten der SPA-Grund-URL {} ", path);
                        routingContext.next();
                    }

                } else {

                    log.debug("(9) global else => rc.next()");
                    routingContext.next();
                }
            }
        }

    }

    private boolean doesNotNeedRedirect(final String path) {

        if (isRootPath(path)) {

            log.debug("(3-1) kein Umleiten von /");
            return true;
        }

        if (FILE_NAME_PREDICATE.test(path)) {

            log
                    .debug("(3-2) kein Umleiten von statischen files aus src/main/resources/META-INF/resources/raetselbaukasten/");
            return true;
        }

        if (Stream.of(PATH_PREFIXES).noneMatch(path::startsWith)) {

            log.debug("(3-3) kein Umleiten von Pfaden, die nicht mit {} beginnen", DEFAULT_APP);
            return true;
        }

        log.debug("(3-4)");
        return false;
    }

    private boolean isRootPath(final String path) {
        return "/".equals(path);
    }

    private String getQueryParameters(final RoutingContext routingContext) {

        final Map<String, String> queryParams = routingContext
                .queryParams()
                .entries()
                .stream()
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        if (queryParams.isEmpty()) {

            return "";
        }

        final StringBuilder stringBuilder = new StringBuilder("?");
        queryParams.forEach((key, value) -> stringBuilder.append(key).append("=").append(value).append("&"));

        stringBuilder.deleteCharAt(stringBuilder.length() - 1);

        return stringBuilder.toString();

    }

}
