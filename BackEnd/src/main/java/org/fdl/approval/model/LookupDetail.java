package org.fdl.approval.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"lookupMaster"})
@Entity
@Table(name = "LOOKUP_DETAIL")
public class LookupDetail extends Abstract {

    @Column(length = 255, nullable = false)
    private String code;

    @Column(length = 255)
    private String description;

    @Column(name = "IS_ENTRY_ENABLE", nullable = false)
    private boolean entryEnable = Boolean.TRUE;

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.TRUE;

    //@JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "LOOKUP_MASTER_ID", nullable = false)
    private LookupMaster lookupMaster;

    @Override
    public String toString() {
        return lookupMaster.getDescription();
    }

}
