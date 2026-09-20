package de.mathejungalt.matheportal.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

/**
 * NormalizeSpaceDelegateTest.
 */
public class NormalizeSpaceDelegateTest {

    @Test
    void should_return_null_when_null() {

        // act
        final String result = NormalizeSpaceDelegate.normalizeText(null);

        // assert
        assertNull(result);

    }

    @ParameterizedTest
    @ValueSource(strings = { "", "  ", "    " })
    void should_return_an_empty_string(final String value) {

        assertEquals("", NormalizeSpaceDelegate.normalizeText(value));

    }

    @Test
    void should_shrink_many_spaces_to_one() {

        // arrange
        final String text = " Ein  Text   mit vielen   Leerzeichen im    Inneren ";
        final String expected = "Ein Text mit vielen Leerzeichen im Inneren";

        // act
        final String result = NormalizeSpaceDelegate.normalizeText(text);

        // assert
        assertEquals(expected, result);
    }

}
