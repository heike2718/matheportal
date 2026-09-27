package de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization;

import java.lang.reflect.Parameter;

import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;

import org.apache.commons.lang3.StringUtils;

import de.mathejungalt.minikaenguru.anwendung.domain.authorization.AuthorizationService;

/**
 * KuerzelZugriffInterceptor. Stößt die Autorisierung von Zugriffen des eingeloggten Users auf verschiedene Entitäten
 * an.
 */
@KuerzelZugriff
@Interceptor
@Priority(Interceptor.Priority.APPLICATION)
public class KuerzelZugriffInterceptor {

    @Inject
    AuthorizationService authorizationService;

    @AroundInvoke
    public Object authorize(final InvocationContext context) throws Exception {

        final KuerzelZugriff annotation = context.getMethod().getAnnotation(KuerzelZugriff.class);

        if (StringUtils.isBlank(annotation.value())) {
            throw new IllegalStateException("Missing authorization context: " + context.getMethod());
        }

        final Parameter[] parameters = context.getMethod().getParameters();
        final Object[] values = context.getParameters();

        String kuerzel = null;
        int authorizationKeyCount = 0;

        for (int i = 0; i < parameters.length; i++) {

            if (!parameters[i].isAnnotationPresent(AuthorizationKey.class)) {
                continue;
            }

            authorizationKeyCount++;

            if (parameters[i].getType() != String.class) {
                throw new IllegalStateException(
                        "@AuthorizationKey requires a String parameter: " + context.getMethod());
            }

            kuerzel = (String) values[i];
        }

        if (authorizationKeyCount != 1) {
            throw new IllegalStateException("Exactly one @AuthorizationKey is required: " + context.getMethod());
        }

        authorizationService.checkAuthorization(kuerzel, annotation.value());

        return context.proceed();
    }
}
