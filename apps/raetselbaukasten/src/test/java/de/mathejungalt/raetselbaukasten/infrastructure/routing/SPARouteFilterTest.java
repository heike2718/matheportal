package de.mathejungalt.raetselbaukasten.infrastructure.routing;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import io.vertx.core.MultiMap;
import io.vertx.ext.web.RoutingContext;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SPARouteFilterTest {

    private final SPARouteFilter filter = new SPARouteFilter();

    @Test
    void apiFilter_apiPath_reroutesToApiWithoutAppPrefix() {

        final RoutingContext routingContext = mock(RoutingContext.class);

        when(routingContext.normalizedPath()).thenReturn("/raetselbaukasten/api/session");

        when(routingContext.queryParams()).thenReturn(MultiMap.caseInsensitiveMultiMap());

        filter.apiFilter(routingContext);

        verify(routingContext).reroute("/api/session");
        verify(routingContext, never()).next();
    }

    @Test
    void apiFilter_apiPathWithQueryParams_reroutesToApiWithQueryParams() {

        final RoutingContext routingContext = mock(RoutingContext.class);

        when(routingContext.normalizedPath()).thenReturn("/raetselbaukasten/api/session");

        when(routingContext.queryParams())
                .thenReturn(MultiMap.caseInsensitiveMultiMap().add("foo", "bar").add("x", "1"));

        filter.apiFilter(routingContext);

        verify(routingContext).reroute("/api/session?foo=bar&x=1");
        verify(routingContext, never()).next();
    }

    @Test
    void apiFilter_rootPath_callsNext() {

        final RoutingContext routingContext = mock(RoutingContext.class);

        when(routingContext.normalizedPath()).thenReturn("/");

        filter.apiFilter(routingContext);

        verify(routingContext).next();
        verify(routingContext, never()).reroute(org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void apiFilter_staticFile_callsNext() {

        final RoutingContext routingContext = mock(RoutingContext.class);

        when(routingContext.normalizedPath()).thenReturn("/raetselbaukasten/assets/logo.png");

        filter.apiFilter(routingContext);

        verify(routingContext).next();
        verify(routingContext, never()).reroute(org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void apiFilter_spaRoot_callsNext() {

        final RoutingContext routingContext = mock(RoutingContext.class);

        when(routingContext.normalizedPath()).thenReturn("/raetselbaukasten/");

        filter.apiFilter(routingContext);

        verify(routingContext).next();
        verify(routingContext, never()).reroute(org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void apiFilter_otherPath_callsNext() {

        final RoutingContext routingContext = mock(RoutingContext.class);

        when(routingContext.normalizedPath()).thenReturn("/other/path");

        filter.apiFilter(routingContext);

        verify(routingContext).next();
        verify(routingContext, never()).reroute(org.mockito.ArgumentMatchers.anyString());
    }

    // TODO: dies später an tatsächliche Angular-Routes anpassen.
    @ParameterizedTest
    @ValueSource(
            strings = { "/raetselbaukasten/aufgaben", "/raetselbaukasten/aufgaben/123", "/raetselbaukasten/profil",
                    "/raetselbaukasten/profil/", "/raetselbaukasten/foo/bar/baz" })
    void apiFilter_spaDeepLink_reroutesToIndexHtml(final String path) {

        final RoutingContext routingContext = mock(RoutingContext.class);

        when(routingContext.normalizedPath()).thenReturn(path);

        filter.apiFilter(routingContext);

        verify(routingContext).reroute("/raetselbaukasten/index.html");
        verify(routingContext, never()).next();
    }

    // TODO: dies später an tatsächliche Angular-Routes anpassen.
    @ParameterizedTest
    @ValueSource(
            strings = { "/", "/raetselbaukasten/", "/raetselbaukasten/index.html", "/raetselbaukasten/favicon.ico",
                    "/raetselbaukasten/assets/main.js", "/raetselbaukasten/assets/styles.css",
                    "/raetselbaukasten/assets/logo.png", "/other/path" })
    void apiFilter_noSpaDeepLink_callsNext(final String path) {

        final RoutingContext routingContext = mock(RoutingContext.class);

        when(routingContext.normalizedPath()).thenReturn(path);

        filter.apiFilter(routingContext);

        verify(routingContext).next();
        verify(routingContext, never()).reroute(anyString());
    }
}
