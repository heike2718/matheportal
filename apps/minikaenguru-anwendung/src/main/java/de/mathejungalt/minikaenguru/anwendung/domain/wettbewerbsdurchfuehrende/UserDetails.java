package de.mathejungalt.minikaenguru.anwendung.domain.wettbewerbsdurchfuehrende;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Data;

/**
 * UserDetails.
 */
@Data
@Builder
public class UserDetails {

    @JsonProperty
    private String vorname;

    @JsonProperty
    private String nachname;
}
