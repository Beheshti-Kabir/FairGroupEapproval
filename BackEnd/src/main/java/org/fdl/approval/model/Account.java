package org.fdl.approval.model;

import lombok.*;
import org.hibernate.validator.constraints.Email;
import javax.persistence.*;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ACCOUNT")
public class Account extends AbstractVersion {

    @Column(name = "MOBILE_NO", unique = true, length = 14, nullable = false)
    private String mobileNo;

    @Column(name = "VERIFICATION_CODE", length = 6, nullable = false)
    private String verificationCode;

    @Column(name = "FIRST_NAME", length = 35 )
    private String firstName;

    @Column(name = "LAST_NAME", length = 35)
    private String lastName;

    @Email
    @Column(length = 50, unique = true)
    private String email;

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.FALSE;

    @Column(name = "IS_VERIFIED", nullable = false)
    private boolean verified = Boolean.FALSE;

    @Column(length = 64)
    private String password;

}