package org.fdl.approval.service;

import java.util.ArrayList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import org.fdl.approval.dto.LookupDetailDto;
import org.fdl.approval.dto.LookupMasterDto;
import org.fdl.approval.model.LookupMaster;
import static org.fdl.approval.dto._Mode.DELETED;
import static org.fdl.approval.dto._Mode.NEW;
import static org.fdl.approval.dto._Mode.NEW_UPDATED;
import static org.fdl.approval.dto._Mode.UPDATED;
import org.fdl.approval.model.LookupDetail;
import org.fdl.approval.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

/**
 *
 * @author Manik
 */
@Service
public class LookupMasterService {

    @Autowired
    private LookupMasterRepo lookupMasterRepo;

    @Autowired
    private LookupDetailRepo lookupDetailRepo;

    public LookupMasterDto findById(Long id) {

        LookupMaster x = lookupMasterRepo.getById(id);
        LookupMasterDto b = new LookupMasterDto();
        b.setId(x.getId());
        b.setVersion(x.getVersion());
        b.setCode(x.getCode());
        b.setDescription(x.getDescription());
        b.setName(x.getName());
        b.setActive(x.isActive());
        b.setLookupType(x.getLookupType());

        if (x.getLookupDetailDependent() != null) {
            LookupDetailDto gtg = new LookupDetailDto();
            gtg.setId(x.getLookupDetailDependent().getId());
            gtg.setCode(x.getLookupDetailDependent().getCode());
            b.setLookupDetailDependent(gtg);
        } else {
            b.setLookupDetailDependent(null);
        }

        final AtomicInteger index = new AtomicInteger();

        List<LookupDetailDto> productPriceListx = x.getLookupDetails().stream()
                .map(p -> {
                    LookupDetailDto kk = new LookupDetailDto();

                    kk.setId(p.getId());
                    kk.setCode(p.getCode());
                    kk.set_index(index.getAndIncrement());

                    kk.setDescription(p.getDescription());
                    kk.setActive(p.isActive());
                    kk.setEntryEnable(p.isEntryEnable());

                    return kk;
                })//
                .collect(Collectors.toList());

        b.setLookupDetails(productPriceListx);

        return b;
    }

    public List<LookupMasterDto> listConv(List<LookupMaster> oos) {
        List<LookupMasterDto> mms = new ArrayList();

        for (LookupMaster x : oos) {
            LookupMasterDto b = new LookupMasterDto();
            b.setId(x.getId());
            b.setCode(x.getCode());
            b.setName(x.getName());
            b.setDescription(x.getDescription());
            b.setActive(x.isActive());
            b.setLookupType(x.getLookupType());

            if (x.getLookupDetailDependent() != null) {
                LookupDetailDto gtg = new LookupDetailDto();
                gtg.setId(x.getLookupDetailDependent().getId());
                gtg.setCode(x.getLookupDetailDependent().getCode());
                b.setLookupDetailDependent(gtg);
            } else {
                b.setLookupDetailDependent(null);
            }

            mms.add(b);
        }

        return mms;
    }

    public List<LookupMasterDto> findAll() {
        return listConv(lookupMasterRepo.findAll());
    }

    public Page<LookupMasterDto> findAll(Pageable pageable) {
        Page<LookupMaster> pp = lookupMasterRepo.findAll(pageable);

        Page<LookupMasterDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());

        return mmmm;
    }

    public void save(LookupMasterDto obj) {
        // lookupMasterRepo.save(obj);

        LookupMaster xx = new LookupMaster();

        xx.setCode(obj.getCode());
        xx.setName(obj.getName());
        xx.setActive(obj.isActive());
        xx.setLookupType(obj.getLookupType());
        xx.setDescription(obj.getDescription());

        if (obj.getLookupDetailDependent() != null) {
            xx.setLookupDetailDependent(lookupDetailRepo.getById(obj.getLookupDetailDependent().getId()));
        } else {
            xx.setLookupDetailDependent(null);
        }

        LookupMaster xxx = lookupMasterRepo.save(xx);

        processDetail(obj.getLookupDetails(), xxx);

    }

    public void deleteById(Long id) {
        lookupMasterRepo.deleteById(id);
    }

    public void update(Long id, LookupMasterDto obj) {

        System.out.println("update lookup " + obj);
        LookupMaster xx = lookupMasterRepo.findById(id).get();

        xx.setCode(obj.getCode());
        xx.setName(obj.getName());
        xx.setActive(obj.isActive());
        xx.setLookupType(obj.getLookupType());
        xx.setDescription(obj.getDescription());
        if (obj.getLookupDetailDependent() != null) {
            xx.setLookupDetailDependent(lookupDetailRepo.getById(obj.getLookupDetailDependent().getId()));
        } else {
            xx.setLookupDetailDependent(null);
        }
        processDetail(obj.getLookupDetails(), xx);

        lookupMasterRepo.save(xx);
    }

    private void processDetail(List<LookupDetailDto> details, LookupMaster xx) {

        for (LookupDetailDto dtlDto : details) {

            if (null != dtlDto.get_mode()) {
                switch (dtlDto.get_mode()) {
                    case NEW:
                    case NEW_UPDATED:

                        LookupDetail newObj = new LookupDetail();
                        newObj.setLookupMaster(xx);
                        newObj.setDescription(dtlDto.getDescription());
                        newObj.setCode(dtlDto.getCode());
                        newObj.setActive(dtlDto.isActive());
                        newObj.setEntryEnable(dtlDto.isEntryEnable());

                        lookupDetailRepo.save(newObj);
                        break;
                    case UPDATED:
                        LookupDetail oldObj = lookupDetailRepo.getById(dtlDto.getId());
                        // lookupDetailRepo.merge(old, childArray);
                        oldObj.setDescription(dtlDto.getDescription());
                        oldObj.setCode(dtlDto.getCode());
                        oldObj.setActive(dtlDto.isActive());
                        oldObj.setEntryEnable(dtlDto.isEntryEnable());
                        lookupDetailRepo.save(oldObj);

                        //await lookupDetailRepo.update(childArray, { where: { id: childArray.id } });
                        break;
                    case DELETED:
                        lookupDetailRepo.deleteById(dtlDto.getId());
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
