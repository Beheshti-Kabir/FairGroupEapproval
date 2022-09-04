package org.fdl.approval.model;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import static org.fdl.approval.model.LookupType.INDEPENDENT;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
//@ToString(exclude = {"lookupDetail"})
@Entity
@Table(name = "LOOKUP_MASTER")
public class LookupMaster extends AbstractVersion {

    @Column(length = 100, nullable = false)
    private String code;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "LOOKUP_TYPE", length = 30, nullable = false)
    private LookupType lookupType = INDEPENDENT;

//    @Column(name = "LOOKUP_DETAIL_DEPENDENT_ID")
//    private Long lookupDetailDependentId;
    @ManyToOne
    @JoinColumn(name = "LOOKUP_DETAIL_DEPENDENT_ID")
    private LookupDetail lookupDetailDependent;

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.TRUE;

    //@JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "lookupMaster", fetch = FetchType.EAGER)
    private List<LookupDetail> lookupDetails = new ArrayList();
}
