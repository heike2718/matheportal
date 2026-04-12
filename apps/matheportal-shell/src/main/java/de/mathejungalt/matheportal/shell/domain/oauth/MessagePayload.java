package de.mathejungalt.matheportal.shell.domain.oauth;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

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
    @Schema(description = "Level der Message: INFO | WARN | ERROR")
    private String level;

    @JsonProperty
    @Schema(description = "die message")
    private String message;

}
