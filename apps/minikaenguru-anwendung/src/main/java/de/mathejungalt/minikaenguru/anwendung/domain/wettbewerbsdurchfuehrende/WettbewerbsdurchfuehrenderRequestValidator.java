package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.WettbewerbsdurchfuehrenderRequest;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.SchulkatalogDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.SchuleEntity;

/**
 * WettbewerbsdurchfuehrenderRequestValidator.
 */
@ApplicationScoped
public class WettbewerbsdurchfuehrenderRequestValidator
        implements ConstraintValidator<ValidWettbewerbsdurchfuehrenderRequest, WettbewerbsdurchfuehrenderRequest> {

    @Inject
    SchulkatalogDao schulkatalogDao;

    @Override
    public boolean isValid(final WettbewerbsdurchfuehrenderRequest value, final ConstraintValidatorContext context) {

        if (value == null) {
            return true;
        }

        if (value.getDurchfuehrungsart() == Wettbewerbsdurchfuehrungsart.PRIVAT) {
            return true;
        }

        final String schulkuerzel = value.getSchulkuerzel();

        if (schulkuerzel == null) {

            context.disableDefaultConstraintViolation();
            context
                    .buildConstraintViolationWithTemplate(
                            "Bei Wettbewerbsdurchfuehrungsart SCHULE ist ein schulkuerzel erforderlich.")
                    .addConstraintViolation();

            return false;
        }

        final Optional<SchuleEntity> optSchule = schulkatalogDao.findSchuleByKuerzel(value.getSchulkuerzel());

        if (optSchule.isPresent()) {
            return true;
        }

        context.disableDefaultConstraintViolation();
        context
                .buildConstraintViolationWithTemplate("schulkuerzel " + schulkuerzel + " existiert nicht")
                .addConstraintViolation();

        return false;
    }
}
