package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.lang.annotation.RetentionPolicy;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.TYPE;

/**
 * ValidWettbewerbsdurchfuehrenderRequest.
 */
@Target({ FIELD, METHOD, PARAMETER, TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = WettbewerbsdurchfuehrenderRequestValidator.class)
public @interface ValidWettbewerbsdurchfuehrenderRequest {

    String message() default "Ungültiger Wettbewerbsdurchführender";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
