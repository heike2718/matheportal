package de.mathejungalt.minikaenguru.anwendung.infrastructure.authorization;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import jakarta.enterprise.util.Nonbinding;
import jakarta.interceptor.InterceptorBinding;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * KuerzelZugriff. Markiert eine Methode als für eine Autorizierung vorgesehen.
 */
@InterceptorBinding
@Retention(RUNTIME)
@Target({ METHOD, TYPE })
public @interface KuerzelZugriff {

    @Nonbinding
    String value() default "";
}
