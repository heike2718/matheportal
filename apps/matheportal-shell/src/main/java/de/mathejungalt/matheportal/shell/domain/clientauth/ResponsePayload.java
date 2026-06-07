package de.mathejungalt.matheportal.shell.domain.clientauth;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * ResponsePayload.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ResponsePayload {

    @JsonProperty
    private MessagePayload messagePayload;

    @JsonProperty
    private Object data;
}
