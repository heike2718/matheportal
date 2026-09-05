package de.mathejungalt.minikaenguru.admin.domain.schulkatalog;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
public class KuerzelGeneratorServiceQuarkusTest {

    @Inject
    KuerzelService service;

    @Test
    void test_length_for_Schulkatalog() {

        // act
        final String kuerzel = service.generateSchulkatalogKuerzel();

        // assert
        assertEquals(8, kuerzel.length());
    }

}
