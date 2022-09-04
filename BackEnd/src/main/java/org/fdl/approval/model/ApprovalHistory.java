package org.fdl.approval.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonFormat;
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
@Entity(name = "ApprovalHistory")
@Table(name = "APPROVAL_HISTORY")
public class ApprovalHistory extends Abstract {

    @Column(name = "LEVEL_NO", length = 50, nullable = false)
    private String levelNo;

    @Column(length = 255, nullable = false)
    private String name;

    @Column(name = "MST_ID", nullable = false)
    private Long mstId;

    @Column(name = "REQ_DATE")
    @JsonFormat(pattern="dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime reqDate;

    @Column(name = "RES_DATE")
    @JsonFormat(pattern="dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime resDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ApprovalStatus status;

    @Column(length = 255)
    private String remarks;

    //approval group, which has many user
    //either group or forward must have one value;
    //in forword level will contain DOT, i.e. 1.1 etc.
    @Column(name = "aprv_user_group_id")
    private Long aprvUserGroupId;

    @Column(name = "aprv_user_group_name", length = 100)
    private String aprvUserGroupName;

    @Column(name = "auth_user_forwarded_id")
    private Long authUserForwardedId;

    @Column(name = "auth_user_forwarded_name", length = 250)
    private String authUserForwardedName;

    //who real action
    @Column(name = "auth_user_action_by_id")
    private Long authUserActionById;

    @Column(name = "auth_user_action_by_name", length = 250)
    private String authUserActionByName;

    /////////////////////////////////////all need to add
    @Column(name = "ref_table_name", length = 30)
    private String refTableName;

    @Column(name = "doc_type", length = 250)
    private String docType;

    @Column(name = "doc_code", length = 250)
    private String docCode;

    @Column(name = "auth_user_perv_name", length = 250)
    private String authUserPervName;

    @Column(name = "auth_user_perv_id")
    private Long authUserPervId;

    @Column(name = "auth_user_submit_name", length = 250)
    private String authUserSubmitName;

    @Column(name = "auth_user_submit_id")
    private Long authUserSubmitId;

    @Column(name = "is_rejected", nullable = false)
    private boolean rejected;

}
