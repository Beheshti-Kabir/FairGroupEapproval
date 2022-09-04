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
@Table(name = "AME_DTL_TBL", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"CONDI_SEQ_NO", "AME_MST_ID"})})
public class AmeLine extends Abstract {

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.TRUE;

    @Column(name = "CONDI_SEQ_NO", nullable = false)
    private Integer slNo;

    @Column(length = 255)
    private String remarks;

    @ManyToOne(optional = false)
    @JoinColumn(name = "AME_CONDI_ID", nullable = false)
    private AmeCondi ameCondi;

    @ManyToOne(optional = false)
    @JoinColumn(name = "AME_GROUP_ID", nullable = false)
    private AmeGroup ameGroup;

    @ManyToOne(optional = false)
    @JoinColumn(name = "AME_MST_ID", nullable = false)
    private Ame ame;

    @Override
    public String toString() {
        return ame.getDescription();
    }

}