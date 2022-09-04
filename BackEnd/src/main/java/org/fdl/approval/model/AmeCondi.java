package org.fdl.approval.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "AME_CONDI_TBL")
public class AmeCondi extends AbstractVersion {

    @Column(length = 255)
    private String description;

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.TRUE;

    @OneToMany(mappedBy = "ameCondi", fetch = FetchType.EAGER)
    private List<AmeCondiLine> lines = new ArrayList();


}