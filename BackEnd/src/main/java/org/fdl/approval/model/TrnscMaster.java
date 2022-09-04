package org.fdl.approval.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
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
//@ToString(exclude = {"lookupDetailTrnscType","trnscDetail","trnscAttach"})
@Entity
@Table(name = "TRNSC_MASTER")
public class TrnscMaster extends AbstractVersion {

    @Column(length = 100)
    private String code;

    @Column(length = 200)
    private String referenceEmail;

    @Column(length = 4000)
    private String termsCondition;

    @Column (name="SUBMIT_USER_ID")
    private Long submitUserId;

    @Column(length = 4000)
    private String submitUserName;

    @Column(name = "TRNSC_DATE", nullable = false)
    private LocalDate trnscDate;

    @Column(name = "TOTAL_AMOUNT", nullable = false)
    private double totalAmount;

    @Column(length = 4000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "APPROVAL_STATUS", length = 30, nullable = false)
    private ApprovalStatus approvalStatus = ApprovalStatus.NOT_SUBMITTED;

    @ManyToOne
    @JoinColumn(name = "TRNSC_MASTER_ADMEND_REF_ID")
    private TrnscMaster trnscMasterAdmendRef;

    @ManyToOne(optional = false)
    @JoinColumn(name = "LOOKUP_DETAIL_TRNSC_TYPE_ID", nullable = false)
    private LookupDetail lookupDetailTrnscType;

    @ManyToOne
    @JoinColumn(name = "LOOKUP_DETAIL_FUND_SOURCE_ID")
    private LookupDetail lookupDetailFundSource;

    @ManyToOne
    @JoinColumn(name = "LOOKUP_DETAIL_DEPARTMENT_ID")
    private LookupDetail lookupDetailDepartment;


    @ManyToOne(optional = false)
    @JoinColumn(name = "COMPANY_INFO_ID", nullable = false)
    private CompanyInfo companyInfo;

    //@Transient
    //private String lookupDetailTrnscTypeCode; 
    //@JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "trnscMaster", fetch = FetchType.LAZY)
    private List<TrnscDetail> trnscDetails = new ArrayList();

    //@JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "trnscMaster", fetch = FetchType.LAZY)
    private List<TrnscAttach> trnscAttachs = new ArrayList();

    @Override
    public String toString(){
        return code;
    }

}
