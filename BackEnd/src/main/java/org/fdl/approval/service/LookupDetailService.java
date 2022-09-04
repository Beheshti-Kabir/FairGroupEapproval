package org.fdl.approval.service;

import java.util.ArrayList;
import java.util.List;

import org.fdl.approval.dto.LookupDetailDto;
import org.fdl.approval.dto.TrnscAttachDto;
import org.fdl.approval.dto.TrnscDetailDto;
import org.fdl.approval.model.LookupDetail;
import org.fdl.approval.dto.LookupDetailDto;
import org.fdl.approval.dto.SelectDto;
import org.fdl.approval.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Manik
 */
@Service
public class LookupDetailService {

    @Autowired
    private LookupDetailRepo lookupDetailRepo;

    public List<SelectDto> listConv(List<LookupDetail> oos) {
        List<SelectDto> mms = new ArrayList();

        for (LookupDetail x : oos) {
            SelectDto b = new SelectDto();
            b.setValue(x.getId());
            b.setLabel(x.getCode());
            mms.add(b);
        }

        return mms;
    }

    public List<SelectDto> lookupDetails() {
        return listConv(lookupDetailRepo.findCustom());
    }

    public List<SelectDto> lookupDetails(long id) {
        return listConv(lookupDetailRepo.findCustom(id));
    }

    public List<SelectDto> lookupDetails(long id, long authUserId) {
        return listConv(lookupDetailRepo.findCustom(id, authUserId));
    }

    public List<SelectDto> lookupDetailParticular(long parentId) {

        return listConv(lookupDetailRepo.findCustomParticular(parentId));
//        return listConv(lookupDetailRepo.findCustomNew(lookupType, parentId, authUserId));
    }

    public List<SelectDto> lookupDetailCurrency(long parentId) {

        return listConv(lookupDetailRepo.findCustomParticular(parentId));
//        return listConv(lookupDetailRepo.findCustomNew(lookupType, parentId, authUserId));
    }

    public List<SelectDto> lookupDetailParentCode(String parentCode) {
        return listConv(lookupDetailRepo.findCustomParentCode(parentCode));
    }

    public void save(LookupDetailDto obj) {
        // lookupDetailRepo.save(obj);
    }

    public void deleteById(Long id) {
        lookupDetailRepo.deleteById(id);
    }

    public void update(Long id, LookupDetailDto obj) {
        LookupDetail xx = lookupDetailRepo.findById(id).get();
        xx.setCode(obj.getCode());
        //xx.setApprovalStatus(obj.getApprovalStatus());

        lookupDetailRepo.save(xx);
    }

}
