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
@Table(name = "AME_MST_TBL")
public class Ame extends AbstractVersion {

    @Column(name = "AME_NAME",length = 200, nullable = false)
    private String name;
    
    @Column(length = 255)
    private String description;

    @Column(length = 200, nullable = false)
    private String formName;

    @Column(length = 200, nullable = false)
    private String baseTable;

    @Column(length = 200, nullable = false)
    private String primaryKey;

    @Column(length = 500)
    private String parameterName;

    @Column(length = 200)
    private String urlLink;

    @Column(length = 200)
    private String transType;

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.TRUE;

    @OneToMany(mappedBy = "ame", fetch = FetchType.LAZY)
    @OrderBy("slNo desc")
    private List<AmeLine> lines = new ArrayList();
}