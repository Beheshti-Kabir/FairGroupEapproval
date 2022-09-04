package org.fdl.approval.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.fdl.approval.model.ApprovalStatus;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrnscMasterDto extends BaseVersionDto {
    
    private String code;

    private LocalDate trnscDate;

    private double totalAmount;

    private String description;

    private String referenceEmail;
    private String termsCondition;
    private Long submitUserId;
    private String submitUserName;

    private ApprovalStatus approvalStatus = ApprovalStatus.NOT_SUBMITTED;

    private LookupDetailDto lookupDetailTrnscType;

    private LookupDetailDto lookupDetailFundSource;

    private LookupDetailDto lookupDetailDepartment;

    private CompanyInfoDto companyInfo;

    private SelectDto trnscMasterAdmendRef;

    private List<TrnscDetailDto> trnscDetails = new ArrayList();

    private List<TrnscAttachDto> trnscAttachs = new ArrayList();

    @Override
    public String toString(){
        return code;
    }
}
