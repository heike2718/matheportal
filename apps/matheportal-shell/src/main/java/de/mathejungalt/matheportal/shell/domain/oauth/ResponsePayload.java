package de.mathejungalt.matheportal.shell.domain.oauth;

import com.fasterxml.jackson.annotation.JsonProperty;

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

    @JsonProperty
    MessagePayload messagePayload;

}
