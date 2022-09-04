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
@Table(name = "TRNSC_USER_GROUP")
public class TrnscUserGroup extends AbstractVersion {

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.TRUE;

    @ManyToOne(optional = false)
    @JoinColumn(name = "LOOKUP_DETAIL_TRNSC_TYPE_ID", nullable = false, unique = true)
    private LookupDetail lookupDetailTrnscType;

    @OneToMany(mappedBy = "trnscUserGroup", fetch = FetchType.EAGER)
    private List<TrnscUserGroupLine> trnscUserGroupLines = new ArrayList();

}
