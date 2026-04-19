package de.mathejungalt.matheportal.shell.domain.clientauth;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * MessagePayload
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MessagePayload {

    @JsonProperty
    private String level;

    @JsonProperty
    private String message;
}
