package de.mathejungalt.matheportal.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * NormalizeSpace. Felder, die diese Annotation tragen, werden vor dem INSERT und UPDATE normalisiert, indem führende
 * und endende Leerzeichen entfernt und mehrere aufeinanderfolgende Leerzeichen zu zu einem Leerzeichen reduziert
 * werden.
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface NormalizeSpace {
}
