package de.mathejungalt.matheportal.shell.infrastructure.routing;

import java.util.Map;
import java.util.function.Predicate;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import io.quarkus.vertx.web.RouteFilter;

import io.vertx.ext.web.RoutingContext;
import lombok.extern.slf4j.Slf4j;

/**
 * SPARouteFilter.
 */
@Slf4j
public final class SPARouteFilter {

    private static final Predicate<String> FILE_NAME_PREDICATE = Pattern
            .compile(".*[.][a-zA-Z\\d]+")
            .asMatchPredicate();

    private static final String API_PREFIX = "/api/";

    private static final String SPA_ROOT_PATH = "/matheportal-shell/";

    private static final String SPA_API_PREFIX = "/matheportal-shell" + API_PREFIX;

    private static final String SPA_INDEX_HTML = SPA_ROOT_PATH + "index.html";

    @RouteFilter(100)
    void apiFilter(final RoutingContext routingContext) {

        final String path = routingContext.normalizedPath();
        log.debug("Check reroute with path: " + path);

        if (isApiRequest(path)) {

            // reroute to REST-API
            final String rerouted = path.replaceFirst(SPA_ROOT_PATH, "/") + getQueryParameters(routingContext);
            log.debug("(1) rc.reroute: " + rerouted);
            routingContext.reroute(rerouted);
            return;
        }

        if (isSpaDeepLink(path)) {
            log.debug("(2) Reroute SPA deep link: {} nach {}", path, SPA_INDEX_HTML);
            routingContext.reroute(SPA_INDEX_HTML);
            return;
        }

        log.debug("(3) global else => rc.next()");
        routingContext.next();
    }

    private boolean isApiRequest(final String path) {
        return path.startsWith(SPA_API_PREFIX);
    }

    private boolean isSpaDeepLink(final String path) {
        return path.startsWith(SPA_ROOT_PATH) && !SPA_ROOT_PATH.equals(path) && !isStaticFile(path);
    }

    private boolean isStaticFile(final String path) {
        return FILE_NAME_PREDICATE.test(path);
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
