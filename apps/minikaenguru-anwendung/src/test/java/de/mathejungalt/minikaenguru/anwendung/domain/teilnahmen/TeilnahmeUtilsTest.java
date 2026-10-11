package de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen;

import java.util.List;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.EnumSource;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsstatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

/**
 * TeilnahmeUtilsTest.
 */
public class TeilnahmeUtilsTest {

    @ParameterizedTest
    @CsvSource({ "ERFASST, false", "ANMELDUNG, true", "DOWNLOAD_LEHRER, true", "DOWNLOAD_PRIVAT, true",
            "BEENDET, false" })
    void should_determine_anmeldungMoeglich_when_no_teilnahmen(final Wettbewerbsstatus status, final boolean expected) {

        // arrange
        final Wettbewerb wettbewerb = new Wettbewerb().jahr(2026).status(status);

        // act
        final boolean result = TeilnahmeUtils.isAnmeldungMoeglich(wettbewerb, List.of());

        // assert
        assertEquals(expected, result);
    }

    @ParameterizedTest
    @CsvSource({ "ERFASST, false", "ANMELDUNG, true", "DOWNLOAD_LEHRER, true", "DOWNLOAD_PRIVAT, true",
            "BEENDET, false" })
    void should_determine_anmeldungMoeglich_when_only_previous_teilnahmen(final Wettbewerbsstatus status,
            final boolean expected) {

        // arrange
        final Wettbewerb wettbewerb = new Wettbewerb().jahr(2026).status(status);

        final List<TeilnahmeReferenz> teilnahmereferenzen = List
                .of(new TeilnahmeReferenz(2025, "A1234567"), new TeilnahmeReferenz(2024, "A1234567"));

        // act
        final boolean result = TeilnahmeUtils.isAnmeldungMoeglich(wettbewerb, teilnahmereferenzen);

        // assert
        assertEquals(expected, result);
    }

    @ParameterizedTest
    @EnumSource(Wettbewerbsstatus.class)
    void should_notAllowAnmeldung_when_teilnahme_for_current_year_exists(final Wettbewerbsstatus status) {

        // arrange
        final Wettbewerb wettbewerb = new Wettbewerb().jahr(2026).status(status);

        final List<TeilnahmeReferenz> teilnahmereferenzen = List
                .of(new TeilnahmeReferenz(2025, "A1234567"), new TeilnahmeReferenz(2026, "A1234567"),
                        new TeilnahmeReferenz(2024, "A1234567"));

        // act
        final boolean result = TeilnahmeUtils.isAnmeldungMoeglich(wettbewerb, teilnahmereferenzen);

        // assert
        assertFalse(result);
    }
}
