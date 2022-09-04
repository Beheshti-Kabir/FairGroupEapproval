package org.fdl.approval.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "COMPANY_INFO")
public class CompanyInfo extends AbstractVersion {

    @Column(nullable = false, unique = true, length = 30)//ADMIN, USER
    private String code;

    @Column(nullable = false, unique = true, length = 100)//ADMIN, USER
    private String companyName;

    @Column(length = 255)//ADMIN, USER
    private String description;

    @Column(name = "is_active", nullable = false)//ADMIN, USER
    private boolean active;

}