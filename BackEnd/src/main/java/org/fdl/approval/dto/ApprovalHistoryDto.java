package org.fdl.approval.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.fdl.approval.model.ApprovalStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalHistoryDto extends BaseVersionDto {

    private String levelNo;
    private Long mstId;
    @JsonFormat(pattern="dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime reqDate;
    @JsonFormat(pattern="dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime resDate;
    private ApprovalStatus status;
    private String remarks;
    private String aprvUserGroupName;
    private String authUserForwardedName;
    private String authUserActionByName;
    private String refTableName;
    private String docType;
    private String docCode;
    private String authUserPervName;
    private String authUserSubmitName;

    // private LookupDetailDto lookupDetailTrnscType;

    // private List<TrnscDetailDto> trnscDetails = new ArrayList();

}
