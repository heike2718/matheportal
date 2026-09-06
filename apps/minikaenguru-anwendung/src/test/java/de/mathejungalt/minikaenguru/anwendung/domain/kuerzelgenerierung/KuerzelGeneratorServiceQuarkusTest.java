package de.mathejungalt.minikaenguru.anwendung.domain.kuerzelgenerierung;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
public class KuerzelGeneratorServiceQuarkusTest {

    @Inject
    KuerzelGeneratorService service;

    @Test
    void test_length_for_Privatteilnahme() {

        // act
        final String kuerzel = service.generatePrivatteilnahmekuerzel();

        // assert
        assertEquals(10, kuerzel.length());
    }
}
