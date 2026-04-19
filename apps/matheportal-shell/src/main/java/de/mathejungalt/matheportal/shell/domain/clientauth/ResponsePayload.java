package de.mathejungalt.matheportal.shell.domain.clientauth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * ResponsePayload
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ResponsePayload {

    MessagePayload messagePayload;

    Object data;
}
