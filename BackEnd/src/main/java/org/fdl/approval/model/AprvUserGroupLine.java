package org.fdl.approval.model;

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
@Table(name = "APRV_USER_GROUP_LINE", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"AUTH_USER_ID", "APRV_USER_GROUP_ID"})})
public class AprvUserGroupLine extends Abstract {

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.TRUE;

    @ManyToOne(optional = false)
    @JoinColumn(name = "APRV_USER_GROUP_ID", nullable = false)
    private AprvUserGroup aprvUserGroup;

    @ManyToOne(optional = false)
    @JoinColumn(name = "AUTH_USER_ID", nullable = false)
    private AuthUser authUser;

    @Override
    public String toString() {
        return aprvUserGroup.getDescription();
    }
}