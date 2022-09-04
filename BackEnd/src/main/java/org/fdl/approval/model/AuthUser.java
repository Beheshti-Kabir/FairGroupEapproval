package org.fdl.approval.model;

import lombok.*;
import org.hibernate.validator.constraints.Email;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
@Table(name = "AUTH_USER")
public class AuthUser extends AbstractVersion {

    @Column(unique = true, length = 30, nullable = false)
    private String code;

    @Email
    @Column(length = 50, unique = true)
    private String email;

    @Column(length = 14, unique = true)
    private String mobile;

    @Column(length = 64, nullable = false)
    private String password;

    @Column(name = "DISPLAY_NAME", length = 15, nullable = false)
    private String displayName;

    @Column(name = "FULL_NAME", length = 35, nullable = false)
    private String fullName;

    @Column(name = "USER_TYPE", length = 35)
    private String userType;

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.FALSE;

    @Column(name = "IS_ACCOUNT_EXPIRED", nullable = false)
    private boolean accountExpired = Boolean.FALSE;

    @Column(name = "IS_ACCOUNT_LOCKED", nullable = false)
    private boolean accountLocked = Boolean.FALSE;

    @Column(name = "IS_CREDENTIALS_EXPIRED", nullable = false)
    private boolean credentialsExpired = Boolean.FALSE;

    @Column(name = "IMAGE_PATH")
    private String imagePath;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "AUTH_USER_AUTH_ROLE",
            uniqueConstraints = {
                @UniqueConstraint(columnNames = {"AUTH_USER_ID", "AUTH_ROLE_ID"}
                )},
            joinColumns = {
                @JoinColumn(name = "AUTH_USER_ID", nullable = false)},
            inverseJoinColumns = {
                @JoinColumn(name = "AUTH_ROLE_ID", nullable = false)})
    private Set<AuthRole> authRoles = new LinkedHashSet<>();
    /*
    public Set<GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> grantedAuthorities = new LinkedHashSet<>();
        for (AuthRole role : authRoles) {
            grantedAuthorities.add(new SimpleGrantedAuthority(role.getCode()));
        }
        return grantedAuthorities;
    }*/

}
