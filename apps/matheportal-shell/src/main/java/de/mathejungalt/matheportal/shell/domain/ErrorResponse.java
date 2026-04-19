package de.mathejungalt.matheportal.shell.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * ErrorResponse.
 */
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ErrorResponse {

    private String message;

}
