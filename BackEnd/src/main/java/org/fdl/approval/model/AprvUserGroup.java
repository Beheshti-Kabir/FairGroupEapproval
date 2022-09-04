package org.fdl.approval.model;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "APRV_USER_GROUP")
public class AprvUserGroup extends AbstractVersion {

    @Column(length = 100, nullable = false, unique = true)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.TRUE;

    @OneToMany(mappedBy = "aprvUserGroup", fetch = FetchType.EAGER)
    private List<AprvUserGroupLine> aprvUserGroupLines = new ArrayList();
}