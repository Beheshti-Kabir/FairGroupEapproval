package org.fdl.approval.service;

import org.fdl.approval.dto.AmeLineDto;
import org.fdl.approval.dto.AmeDto;
import org.fdl.approval.model.AmeLine;
import org.fdl.approval.model.Ame;
import org.fdl.approval.repo.AmeLineRepo;
import org.fdl.approval.repo.AmeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import org.fdl.approval.dto.AmeCondiDto;
import org.fdl.approval.dto.AmeGroupDto;

import static org.fdl.approval.dto._Mode.*;
import org.fdl.approval.repo.AmeCondiRepo;
import org.fdl.approval.repo.AmeGroupRepo;

/**
 *
 * @author Manik
 */
@Service
public class AmeService {

    @Autowired
    private AmeRepo ameRepo;

    @Autowired
    private AmeLineRepo ameLineRepo;

    @Autowired
    private AmeCondiRepo ameCondiRepo;

    @Autowired
    private AmeGroupRepo ameGroupRepo;

    public AmeDto findById(Long id) {

        Ame x = ameRepo.getById(id);
        AmeDto b = new AmeDto();
        b.setId(x.getId());
        b.setVersion(x.getVersion());
        // b.setCode(x.getCode());
        b.setName(x.getName());
        b.setBaseTable(x.getBaseTable());
        b.setDescription(x.getDescription());
        b.setFormName(x.getFormName());
        b.setPrimaryKey(x.getPrimaryKey());
        b.setParameterName(x.getParameterName());
        b.setUrlLink(x.getUrlLink());
        b.setTransType(x.getTransType());
        b.setActive(x.isActive());
        //  b.setLookupType(x.getLookupType());

        final AtomicInteger index = new AtomicInteger();

        List<AmeLineDto> productPriceListx = x.getLines().stream()
                .map(p -> {
                    AmeLineDto kk = new AmeLineDto();

                    kk.setId(p.getId());
                    kk.set_index(index.getAndIncrement());

                    AmeCondiDto ameCondiDto = new AmeCondiDto();
                    ameCondiDto.setId(p.getAmeCondi().getId());
                    ameCondiDto.setDescription(p.getAmeCondi().getDescription());
                    kk.setAmeCondi(ameCondiDto);

                    AmeGroupDto ameGroupDto = new AmeGroupDto();
                    ameGroupDto.setId(p.getAmeGroup().getId());
                    ameGroupDto.setDescription(p.getAmeGroup().getDescription());
                    kk.setAmeGroup(ameGroupDto);

                    kk.setSlNo(p.getSlNo());
                    kk.setRemarks(p.getRemarks());
                    kk.setActive(p.isActive());

                    return kk;
                })//
                .collect(Collectors.toList());

        b.setLines(productPriceListx);

        return b;
    }

    public List<AmeDto> listConv(List<Ame> oos) {
        List<AmeDto> mms = new ArrayList();

        for (Ame x : oos) {
            AmeDto b = new AmeDto();
            b.setId(x.getId());
            b.setName(x.getName());
            b.setBaseTable(x.getBaseTable());
            b.setDescription(x.getDescription());
            b.setFormName(x.getFormName());
            b.setPrimaryKey(x.getPrimaryKey());
            b.setParameterName(x.getParameterName());
            b.setUrlLink(x.getUrlLink());
            b.setTransType(x.getTransType());
            b.setActive(x.isActive());
            
            mms.add(b);
        }

        return mms;
    }

    public List<AmeDto> findAll() {
        return listConv(ameRepo.findAll());
    }

    public Page<AmeDto> findAll(Pageable pageable) {
        Page<Ame> pp = ameRepo.findAll(pageable);

        Page<AmeDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());

        return mmmm;
    }

    public void save(AmeDto obj) {
        // ameRepo.save(obj);

        Ame xx = new Ame();
        xx.setName(obj.getName());
        xx.setBaseTable(obj.getBaseTable());
        xx.setDescription(obj.getDescription());
        xx.setFormName(obj.getFormName());
        xx.setPrimaryKey(obj.getPrimaryKey());
        xx.setParameterName(obj.getParameterName());
        xx.setUrlLink(obj.getUrlLink());
        xx.setTransType(obj.getTransType());
        // xx.setCondiDescription(obj.getCondiDescription());
        xx.setActive(obj.isActive());

        Ame xxx = ameRepo.save(xx);

        processDetail(obj.getLines(), xxx);
    }

    public void deleteById(Long id) {
        ameRepo.deleteById(id);
    }

    public void update(Long id, AmeDto obj) {

        System.out.println("update lookup " + obj);
        Ame xx = ameRepo.findById(id).get();

        xx.setName(obj.getName());
        xx.setBaseTable(obj.getBaseTable());
        xx.setDescription(obj.getDescription());
        xx.setFormName(obj.getFormName());
        xx.setPrimaryKey(obj.getPrimaryKey());
        xx.setParameterName(obj.getParameterName());
        xx.setUrlLink(obj.getUrlLink());
        xx.setTransType(obj.getTransType());
        xx.setActive(obj.isActive());

        processDetail(obj.getLines(), xx);

        ameRepo.save(xx);
    }

    private void processDetail(List<AmeLineDto> details, Ame xx) {

        for (AmeLineDto dtlDto : details) {

            if (null != dtlDto.get_mode()) {
                switch (dtlDto.get_mode()) {
                    case NEW:
                    case NEW_UPDATED:

                        AmeLine newObj = new AmeLine();
                        newObj.setAme(xx);
                        newObj.setActive(dtlDto.isActive());
                        //sawkat
                        newObj.setSlNo(dtlDto.getSlNo());
                        newObj.setRemarks(dtlDto.getRemarks());

                        newObj.setAmeCondi(ameCondiRepo.getById(dtlDto.getAmeCondi().getId()));
                        newObj.setAmeGroup(ameGroupRepo.getById(dtlDto.getAmeGroup().getId()));
                        ameLineRepo.save(newObj);
                        break;
                    case UPDATED:
                        AmeLine oldObj = ameLineRepo.getById(dtlDto.getId());
                        // ameLineRepo.merge(old, childArray);
                        oldObj.setActive(dtlDto.isActive());
                        //sawkat
                        oldObj.setSlNo(oldObj.getSlNo());
                        oldObj.setRemarks(oldObj.getRemarks());
                        //  oldObj.setAuthUser(authUserRepo.getById(dtlDto.getAuthUser().getId()));

                        
                        oldObj.setAmeCondi(ameCondiRepo.getById(dtlDto.getAmeCondi().getId()));
                        oldObj.setAmeGroup(ameGroupRepo.getById(dtlDto.getAmeGroup().getId()));
                        ameLineRepo.save(oldObj);

                        //await ameLineRepo.update(childArray, { where: { id: childArray.id } });
                        break;
                    case DELETED:
                        ameLineRepo.deleteById(dtlDto.getId());
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
