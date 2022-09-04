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
@Table(name = "APPROVAL_QUEUE")
public class ApprovalQueue extends Abstract {

    @ManyToOne(optional = false)
    @JoinColumn(name = "AUTH_USER_ID", nullable = false)
    private AuthUser authUser;

    @Column(length = 1000, nullable = false)
    private String description;

    @Column(name = "MST_ID", nullable = false)
    private Long mstId;

    @Column(name = "DOC_TYPE", length = 100, nullable = false)
    private String docType;

    @Column(name = "USER_EMAIL", length = 100, nullable = false)
    private String userEmail;

    @Column(name = "TABLE_NAME", length = 30, nullable = false)
    private String tableName;

    @Column(length = 255, nullable = false)
    private String url;
}
