package de.mathejungalt.minikaenguru.anwendung.domain.teilnahmen;

import java.util.List;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import de.mathejungalt.minikaenguru.anwendung.domain.generated.Anmeldestatus;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.TeilnahmeReferenz;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerb;
import de.mathejungalt.minikaenguru.anwendung.domain.generated.Wettbewerbsstatus;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * TeilnahmeUtilsTest.
 */
public class TeilnahmeUtilsTest {

    @ParameterizedTest
    @CsvSource({ "ERFASST, false", "ANMELDUNG, true", "DOWNLOAD_LEHRER, true", "DOWNLOAD_PRIVAT, true",
            "BEENDET, false" })
    void should_laesstWettbewerbsstatusAnmeldungZu_return_the_expected_value(final Wettbewerbsstatus wettbewerbsstatus,
            final boolean expectedResult) {

        // arrange
        final Wettbewerb wettbewerb = new Wettbewerb().jahr(2026).status(wettbewerbsstatus);

        // act
        boolean result = TeilnahmeUtils.laesstWettbewerbsstatusAnmeldungZu(wettbewerb);

        // assert
        assertEquals(expectedResult, result);

    }

    @ParameterizedTest
    @CsvSource({ "ERFASST, NOCH_NICHT_MOEGLICH", "ANMELDUNG, MOEGLICH", "DOWNLOAD_LEHRER, MOEGLICH",
            "DOWNLOAD_PRIVAT, MOEGLICH", "BEENDET, NICHT_MEHR_MOEGLICH" })
    void should_berechneAnmeldestatus_return_the_expected_status_when_teilnahmerefs_empty(
            final Wettbewerbsstatus wettbewerbsstatus, final Anmeldestatus expectedAnmeldestatus) {

        // arrange
        final Wettbewerb wettbewerb = new Wettbewerb().jahr(2026).status(wettbewerbsstatus);

        // act
        Anmeldestatus anmeldestatus = TeilnahmeUtils.berechneAnmeldestatus(wettbewerb, List.of());

        // assert
        assertEquals(expectedAnmeldestatus, anmeldestatus);

    }

    @ParameterizedTest
    @CsvSource({ "ERFASST, NOCH_NICHT_MOEGLICH", "ANMELDUNG, MOEGLICH", "DOWNLOAD_LEHRER, MOEGLICH",
            "DOWNLOAD_PRIVAT, MOEGLICH", "BEENDET, NICHT_MEHR_MOEGLICH" })
    void should_berechneAnmeldestatus_return_the_expected_status_when_keine_aktuelle_anmeldung(
            final Wettbewerbsstatus wettbewerbsstatus, final Anmeldestatus expectedAnmeldestatus) {

        // arrange
        final Wettbewerb wettbewerb = new Wettbewerb().jahr(2026).status(wettbewerbsstatus);
        final List<TeilnahmeReferenz> teilnahmereferenzen = List
                .of(new TeilnahmeReferenz(2025, "A1234567"), new TeilnahmeReferenz(2024, "A1234567"));

        // act
        Anmeldestatus anmeldestatus = TeilnahmeUtils.berechneAnmeldestatus(wettbewerb, teilnahmereferenzen);

        // assert
        assertEquals(expectedAnmeldestatus, anmeldestatus);

    }

    @ParameterizedTest
    @CsvSource({ "ERFASST, NOCH_NICHT_MOEGLICH", "ANMELDUNG, BEREITS_ANGEMELDET", "DOWNLOAD_LEHRER, BEREITS_ANGEMELDET",
            "DOWNLOAD_PRIVAT, BEREITS_ANGEMELDET", "BEENDET, NICHT_MEHR_MOEGLICH" })
    void should_berechneAnmeldestatus_return_the_expected_status_when_teilnahme_for_current_year_exists(
            final Wettbewerbsstatus wettbewerbsstatus, final Anmeldestatus expectedAnmeldestatus) {

        // arrange
        final Wettbewerb wettbewerb = new Wettbewerb().jahr(2026).status(wettbewerbsstatus);

        final List<TeilnahmeReferenz> teilnahmereferenzen = List
                .of(new TeilnahmeReferenz(2025, "A1234567"), new TeilnahmeReferenz(2026, "A1234567"),
                        new TeilnahmeReferenz(2024, "A1234567"));

        // act
        final Anmeldestatus anmeldestatus = TeilnahmeUtils.berechneAnmeldestatus(wettbewerb, teilnahmereferenzen);

        // assert
        assertEquals(expectedAnmeldestatus, anmeldestatus);
    }
}
