package org.fdl.approval.model;

import lombok.*;
import javax.persistence.*;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "AUTH_ROLE")
public class AuthRole extends AbstractVersion {

    @Column(nullable = false, unique = true, length = 30)//ADMIN, USER
    private String code;

    @Column(nullable = false, unique = true, length = 50)//ADMIN, USER
    private String name;

    @Column(length = 255)//ADMIN, USER
    private String description;

    @Column(name = "is_active", nullable = false)//ADMIN, USER
    private boolean active;

}