package de.mathejungalt.minikaenguru.admin.domain.mail;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * MailDto.<br>
 * <br>
 * <ul>
 * <li>empfaenger: to</li>
 * <li>betreff: subject</li>
 * <li>text: body</li>
 * <li>empfaengerQuittungsmail: Mailadresse, an die gegebene Mail zur Information zusätzlich gesendet werden soll. Wenn
 * nicht null, wird sie den BCC-Empfängern hinzugefügt.</li>
 * <li>hiddenEmpfaenger: bcc</li>
 * </ul>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MailDto {

    /** to. */
    @ToString.Exclude
    private String empfaenger;

    /** subject. */
    private String betreff;

    /** body. */
    private String text;

    /**
     * Mailadresse, an die gegebene Mail zur Information zusätzlich gesendet werden soll. Wenn nicht null, wird sie den
     * BCC-Empfängern hinzugefügt.
     */
    @ToString.Exclude
    private String empfaengerQuittungsmail;

    /** bcc. */
    @Builder.Default
    @ToString.Exclude
    private List<String> hiddenEmpfaenger = new ArrayList<>();
}
