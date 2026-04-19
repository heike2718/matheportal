package de.mathejungalt.matheportal.shell.domain.login;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * UrlResponse transportiert eine Url.
 */
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UrlResponse {

    String url;

}
