package org.fdl.approval.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "AME_CONDI_DTL_TBL", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"CONDI_SL_NO", "AME_CONDI_ID"})})
public class AmeCondiLine extends Abstract {

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.TRUE;

    @Column(name = "CONDI_SL_NO", nullable = false)
    private Integer slNo;

    @Column(length = 2000)
    private String condiSql;

    @ManyToOne(optional = false)
    @JoinColumn(name = "AME_CONDI_ID", nullable = false)
    private AmeCondi ameCondi;

    @Override
    public String toString() {
        return ameCondi.getDescription();
    }
}