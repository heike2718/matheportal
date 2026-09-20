package de.mathejungalt.minikaenguru.admin.infrastructure.persistence;

import java.lang.reflect.Field;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import org.apache.commons.lang3.reflect.FieldUtils;

import de.mathejungalt.matheportal.validation.NormalizeSpace;
import de.mathejungalt.matheportal.validation.NormalizeSpaceDelegate;

/**
 * TextNormalizationListener
 */
public class TextNormalizationListener {

    @PrePersist
    @PreUpdate
    public void normalize(final Object entity) {
        FieldUtils
                .getFieldsListWithAnnotation(entity.getClass(), NormalizeSpace.class)
                .forEach(field -> normalizeField(entity, field));
    }

    private void normalizeField(final Object entity, final Field field) {

        if (!String.class.equals(field.getType())) {
            throw new IllegalStateException(
                    "@NormalizeSpace darf nur auf String-Feldern verwendet werden: " + field.getName());
        }

        try {
            final String value = (String) FieldUtils.readField(field, entity, true);
            final String normalizedValue = NormalizeSpaceDelegate.normalizeText(value);

            FieldUtils.writeField(field, entity, normalizedValue, true);
        } catch (final IllegalAccessException e) {
            throw new IllegalStateException("Feld %s konnte nicht normalisiert werden".formatted(field.getName()), e);
        }
    }

}
