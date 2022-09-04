package org.fdl.approval.dto;

import java.io.Serializable;
import lombok.*;

/**
 *
 * @author  Manik
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDto implements Serializable {

    private Long uid;

    private String firstName;

    private String lastName;

    private Long cityId;

    private Long zipId;

    private String email;

    private String password;

}