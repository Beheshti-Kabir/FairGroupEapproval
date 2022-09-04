package org.fdl.approval.service;

import org.fdl.approval.model.ApprovalHistory;
import org.fdl.approval.model.ApprovalStatus;
import org.fdl.approval.repo.ApprovalHistoryRepo;
import org.fdl.approval.dto.ApprovalHistoryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.fdl.approval.dto._Mode.*;

/**
 *
 * @author Manik
 */
@Service
public class ApprovalHistoryService {

    @Autowired
    private ApprovalHistoryRepo approvalHistoryRepo;


    public List<ApprovalHistoryDto> listConv(List<ApprovalHistory> oos) {
        List<ApprovalHistoryDto> mms = new ArrayList();

        for (ApprovalHistory x : oos) {
            ApprovalHistoryDto b = new ApprovalHistoryDto();
            b.setId(x.getId());
            b.setLevelNo(x.getLevelNo());
            b.setStatus(x.getStatus());
            b.setReqDate(x.getReqDate());
            b.setResDate(x.getResDate());
            b.setRemarks(x.getRemarks());
            b.setMstId(x.getMstId());
            b.setAprvUserGroupName(x.getAprvUserGroupName());
            b.setAuthUserActionByName(x.getAuthUserActionByName());
            b.setDocType(x.getDocType());
            b.setDocCode(x.getDocCode());
            b.setAuthUserPervName(x.getAuthUserPervName());
            b.setAuthUserSubmitName(x.getAuthUserSubmitName());


            mms.add(b);
        }

        return mms;
    }

    public Page<ApprovalHistoryDto> findAll(Long usrId, String comSearch, String searchLookupDetailTrnscType, ApprovalStatus approvalStatus, Pageable pageable) {
        Page<ApprovalHistory> pp = approvalHistoryRepo.customQuery(usrId,comSearch, searchLookupDetailTrnscType, approvalStatus, pageable);
        Page<ApprovalHistoryDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());

        return mmmm;
    }

    /*public Page<ApprovalHistoryDto> findAll(Long usrId, String comSearch, Long searchLookupDetailTrnscTypeId, ApprovalStatus approvalStatus, Pageable pageable) {
        Page<ApprovalHistory> pp = approvalHistoryRepo.customQuery(usrId,comSearch, searchLookupDetailTrnscTypeId, approvalStatus, pageable);
        Page<ApprovalHistoryDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());
        return mmmm;
    }*/
}
