package org.fdl.approval.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "AME_GROUP_DTL_TBL", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"GROUP_SEQ_NO", "AME_GROUP_ID"})})
public class AmeGroupLine extends Abstract {

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.TRUE;

    @Column(name = "GROUP_SEQ_NO", nullable = false)
    private Integer slNo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "USER_GROUP_ID", nullable = false)
    private AprvUserGroup aprvUserGroup;

    @ManyToOne(optional = false)
    @JoinColumn(name = "AME_GROUP_ID", nullable = false)
    private AmeGroup ameGroup;

    @Override
    public String toString() {
        return ameGroup.getDescription();
    }
}