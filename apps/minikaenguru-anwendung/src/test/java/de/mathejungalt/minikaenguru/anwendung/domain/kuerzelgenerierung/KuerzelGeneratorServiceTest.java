package de.mathejungalt.minikaenguru.anwendung.domain.kuerzelgenerierung;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.dao.KuerzelDao;
import de.mathejungalt.minikaenguru.anwendung.infrastructure.persistence.entities.KuerzelEntity;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class KuerzelGeneratorServiceTest {

    @Mock
    KuerzelDao kuerzelDao;

    @Mock
    KuerzelGenerator kuerzelGenerator;

    @InjectMocks
    KuerzelGeneratorService service;

    @Test
    void should_return_first_kuerzel_when_kein_treffer() {
        final String expectedValue = "1ABCDEFGHI";
        when(kuerzelGenerator.generateKuerzel(10)).thenReturn(expectedValue);
        when(kuerzelDao.findKuerzelById(expectedValue)).thenReturn(null);

        // act
        final String result = service.generatePrivatteilnahmekuerzel();

        // assert
        ;

        assertAll(() -> assertEquals(expectedValue, result),
                () -> verify(kuerzelGenerator, times(1)).generateKuerzel(10),
                () -> verify(kuerzelDao, times(1)).findKuerzelById(anyString()));

    }

    @Test
    void should_terminate_with_not_null_when_remaining_attempts() {

        // arrange
        final String kuerzelEins = "1ABCDEFGHI";
        final String kuerzelZwei = "2ABCDEFGHI";
        final String kuerzelDrei = "3ABCDEFGHI";
        final String kuerzelVier = "4ABCDEFGHI";
        final String kuerzelFuenf = "5ABCDEFGHI";

        final KuerzelEntity kuerzelEntity = KuerzelEntity.builder().kuerzel("ABCDEFGHIJ").build();

        when(kuerzelGenerator.generateKuerzel(10))
                .thenReturn(kuerzelEins, kuerzelZwei, kuerzelDrei, kuerzelVier, kuerzelFuenf);

        when(kuerzelDao.findKuerzelById(kuerzelEins)).thenReturn(kuerzelEntity);
        when(kuerzelDao.findKuerzelById(kuerzelZwei)).thenReturn(kuerzelEntity);
        when(kuerzelDao.findKuerzelById(kuerzelDrei)).thenReturn(kuerzelEntity);
        when(kuerzelDao.findKuerzelById(kuerzelVier)).thenReturn(kuerzelEntity);
        when(kuerzelDao.findKuerzelById(kuerzelFuenf)).thenReturn(null);

        // act
        final String result = service.generatePrivatteilnahmekuerzel();

        // assert
        ;

        assertAll(() -> assertEquals(kuerzelFuenf, result),
                () -> verify(kuerzelGenerator, times(5)).generateKuerzel(10),
                () -> verify(kuerzelDao, times(5)).findKuerzelById(anyString()));

    }

    @Test
    void should_terminate_after_5_attempts() {

        // arrange
        final String kuerzelEins = "1ABCDEFGHI";
        final String kuerzelZwei = "2ABCDEFGHI";
        final String kuerzelDrei = "3ABCDEFGHI";
        final String kuerzelVier = "4ABCDEFGHI";
        final String kuerzelFuenf = "5ABCDEFGHI";
        final String kuerzelSechs = "6ABCDEFGHI";

        final KuerzelEntity kuerzelEntity = KuerzelEntity.builder().kuerzel("ABCDEFGHIJ").build();

        when(kuerzelGenerator.generateKuerzel(10))
                .thenReturn(kuerzelEins, kuerzelZwei, kuerzelDrei, kuerzelVier, kuerzelFuenf, kuerzelSechs);

        when(kuerzelDao.findKuerzelById(kuerzelEins)).thenReturn(kuerzelEntity);
        when(kuerzelDao.findKuerzelById(kuerzelZwei)).thenReturn(kuerzelEntity);
        when(kuerzelDao.findKuerzelById(kuerzelDrei)).thenReturn(kuerzelEntity);
        when(kuerzelDao.findKuerzelById(kuerzelVier)).thenReturn(kuerzelEntity);
        when(kuerzelDao.findKuerzelById(kuerzelFuenf)).thenReturn(kuerzelEntity);
        when(kuerzelDao.findKuerzelById(kuerzelSechs)).thenReturn(kuerzelEntity);

        // act
        final String result = service.generatePrivatteilnahmekuerzel();

        // assert
        assertAll(() -> assertNull(result), () -> verify(kuerzelGenerator, times(6)).generateKuerzel(10),
                () -> verify(kuerzelDao, times(6)).findKuerzelById(anyString()));
    }
}
