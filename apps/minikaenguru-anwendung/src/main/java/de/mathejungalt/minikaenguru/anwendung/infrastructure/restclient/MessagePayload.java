package de.mathejungalt.minikaenguru.anwendung.infrastructure.restclient;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

/**
 * MessagePayload
 */
@Getter
public class MessagePayload {

    @JsonProperty
    private String level;

    @JsonProperty
    private String message;
}
