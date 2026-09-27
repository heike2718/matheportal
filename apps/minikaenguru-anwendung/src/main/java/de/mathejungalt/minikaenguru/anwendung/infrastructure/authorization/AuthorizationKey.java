package de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * AuthorizationKey. Markiert den Methodenparameter, der für die Autorisierung des Zugriffs auf eine Entität verwendet
 * wird.
 */
@Retention(RUNTIME)
@Target(PARAMETER)
public @interface AuthorizationKey {
}
