package de.mathejungalt.matheportal.shell.infrastructure.routing;

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

    final RoutingContext routingContext = mock(RoutingContext.class);

    private final SPARouteFilter filter = new SPARouteFilter();

    @Test
    void apiFilter_apiPath_reroutesToApiWithoutAppPrefix() {

        when(routingContext.normalizedPath()).thenReturn("/matheportal-shell/api/session");
        when(routingContext.queryParams()).thenReturn(MultiMap.caseInsensitiveMultiMap());

        filter.apiFilter(routingContext);

        verify(routingContext).reroute("/api/session");
        verify(routingContext, never()).next();
    }

    @Test
    void apiFilter_apiPathWithQueryParams_reroutesToApiWithQueryParams() {

        when(routingContext.normalizedPath()).thenReturn("/matheportal-shell/api/session");
        when(routingContext.queryParams())
                .thenReturn(MultiMap.caseInsensitiveMultiMap().add("foo", "bar").add("x", "1"));

        filter.apiFilter(routingContext);

        verify(routingContext).reroute("/api/session?foo=bar&x=1");
        verify(routingContext, never()).next();
    }

    @Test
    void apiFilter_rootPath_callsNext() {

        when(routingContext.normalizedPath()).thenReturn("/");

        filter.apiFilter(routingContext);

        verify(routingContext).next();
        verify(routingContext, never()).reroute(org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void apiFilter_staticFile_callsNext() {

        when(routingContext.normalizedPath()).thenReturn("/matheportal-shell/assets/logo.png");

        filter.apiFilter(routingContext);

        verify(routingContext).next();
        verify(routingContext, never()).reroute(org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void apiFilter_spaRoot_callsNext() {

        when(routingContext.normalizedPath()).thenReturn("/matheportal-shell/");

        filter.apiFilter(routingContext);

        verify(routingContext).next();
        verify(routingContext, never()).reroute(org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void apiFilter_otherPath_callsNext() {

        when(routingContext.normalizedPath()).thenReturn("/other/path");

        filter.apiFilter(routingContext);

        verify(routingContext).next();
        verify(routingContext, never()).reroute(org.mockito.ArgumentMatchers.anyString());
    }

    // TODO: dies später an tatsächliche Angular-Routes anpassen.
    @ParameterizedTest
    @ValueSource(
            strings = { "/matheportal-shell/aufgaben", "/matheportal-shell/aufgaben/123", "/matheportal-shell/profil",
                    "/matheportal-shell/profil/", "/matheportal-shell/foo/bar/baz" })
    void apiFilter_spaDeepLink_reroutesToIndexHtml(final String path) {

        when(routingContext.normalizedPath()).thenReturn(path);

        filter.apiFilter(routingContext);

        verify(routingContext).reroute("/matheportal-shell/index.html");
        verify(routingContext, never()).next();
    }

    // TODO: dies später an tatsächliche Angular-Routes anpassen.
    @ParameterizedTest
    @ValueSource(
            strings = { "/", "/matheportal-shell/", "/matheportal-shell/index.html", "/matheportal-shell/favicon.ico",
                    "/matheportal-shell/assets/main.js", "/matheportal-shell/assets/styles.css",
                    "/matheportal-shell/assets/logo.png", "/other/path" })
    void apiFilter_noSpaDeepLink_callsNext(final String path) {

        when(routingContext.normalizedPath()).thenReturn(path);

        filter.apiFilter(routingContext);

        verify(routingContext).next();
        verify(routingContext, never()).reroute(anyString());
    }
}
