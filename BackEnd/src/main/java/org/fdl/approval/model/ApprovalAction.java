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
@Table(name = "APPROVAL_ACTION")
public class ApprovalAction extends Abstract {

    //@ManyToOne(optional = false)
    @Column(name = "AUTH_USER_ID", nullable = false)
    private Long authUserId;

    @Column(name = "MST_ID", nullable = false)
    private Long mstId;

    //@ManyToOne
    @Column(name = "AUTH_USER_FORWARD_TO_ID")
    private Long authUserForwardToId;

    @Column
    private String remarks;

    @Column(length = 50, nullable = false)
    private String cmd;

    @Column(name = "DOCUMENT_ROOT", length = 50, nullable = false)
    private String documentRoot;

    @Column(name = "URL_ROOT", length = 100)
    private String urlRoot;
}
