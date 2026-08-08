package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import java.util.Optional;
import java.util.Set;

import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import org.junit.jupiter.api.Test;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.WettbewerbsdurchfuehrenderRequest;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsdurchfuehrungsart;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.SchulkatalogDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.SchuleEntity;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * WettbewerbsdurchfuehrenderRequestValidatorTest.
 */
@QuarkusTest
public class WettbewerbsdurchfuehrenderRequestValidatorTest {

    @Inject
    Validator validator;

    @InjectMock
    SchulkatalogDao schulkatalogDao;

    private class TestBean {

        @ValidWettbewerbsdurchfuehrenderRequest
        private final WettbewerbsdurchfuehrenderRequest request;

        TestBean(final WettbewerbsdurchfuehrenderRequest request) {
            this.request = request;

        }

    }

    @Test
    void should_pass_when_null() {

        // arrange
        final TestBean testBean = new TestBean(null);

        // act
        final Set<ConstraintViolation<TestBean>> constraintViolations = validator.validate(testBean);

        // assert
        assertAll(() -> assertEquals(0, constraintViolations.size()),
                () -> verify(schulkatalogDao, never()).findSchuleByKuerzel(anyString()));

    }

    @Test
    void should_pass_when_valid_privat() {

        // arrange
        final WettbewerbsdurchfuehrenderRequest request = new WettbewerbsdurchfuehrenderRequest()
                .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.PRIVAT);

        final TestBean testBean = new TestBean(request);

        // act
        final Set<ConstraintViolation<TestBean>> constraintViolations = validator.validate(testBean);

        // assert
        assertAll(() -> assertEquals(0, constraintViolations.size()),
                () -> verify(schulkatalogDao, never()).findSchuleByKuerzel(anyString()));

    }

    @Test
    void should_pass_when_schule_and_known_schulkuerzel() {

        // arrange
        final String schulkuerzel = "A1234567";

        when(schulkatalogDao.findSchuleByKuerzel(schulkuerzel)).thenReturn(Optional.of(new SchuleEntity()));

        final WettbewerbsdurchfuehrenderRequest request = new WettbewerbsdurchfuehrenderRequest()
                .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.SCHULE)
                .schulkuerzel(schulkuerzel);

        final TestBean testBean = new TestBean(request);

        // act
        final Set<ConstraintViolation<TestBean>> constraintViolations = validator.validate(testBean);

        // assert
        assertAll(() -> assertEquals(0, constraintViolations.size()),
                () -> verify(schulkatalogDao).findSchuleByKuerzel(schulkuerzel));

    }

    @Test
    void should_notPass_when_schule_and_schulkuerzel_null() {

        // arrange
        final WettbewerbsdurchfuehrenderRequest request = new WettbewerbsdurchfuehrenderRequest()
                .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.SCHULE);

        final TestBean testBean = new TestBean(request);

        // act
        final Set<ConstraintViolation<TestBean>> constraintViolations = validator.validate(testBean);

        // assert
        assertEquals(1, constraintViolations.size());

        final ConstraintViolation<TestBean> constraintViolation = constraintViolations.iterator().next();

        assertAll(
                () -> assertEquals("Bei Wettbewerbsdurchfuehrungsart SCHULE ist ein schulkuerzel erforderlich.",
                        constraintViolation.getMessage()),
                () -> verify(schulkatalogDao, never()).findSchuleByKuerzel(anyString()));

    }

    @Test
    void should_notPass_when_schule_and_schulkuerzel_unknown() {

        // arrange

        final String schulkuerzel = "A1234567";

        final WettbewerbsdurchfuehrenderRequest request = new WettbewerbsdurchfuehrenderRequest()
                .durchfuehrungsart(Wettbewerbsdurchfuehrungsart.SCHULE)
                .schulkuerzel(schulkuerzel);

        final TestBean testBean = new TestBean(request);

        when(schulkatalogDao.findSchuleByKuerzel(schulkuerzel)).thenReturn(Optional.empty());

        // act
        final Set<ConstraintViolation<TestBean>> constraintViolations = validator.validate(testBean);

        // assert
        assertEquals(1, constraintViolations.size());

        final ConstraintViolation<TestBean> constraintViolation = constraintViolations.iterator().next();

        assertAll(() -> assertEquals("schulkuerzel A1234567 existiert nicht", constraintViolation.getMessage()),
                () -> verify(schulkatalogDao).findSchuleByKuerzel(anyString()));

    }

}
