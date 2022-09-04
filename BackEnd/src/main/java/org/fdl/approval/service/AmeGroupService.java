package org.fdl.approval.service;

import org.fdl.approval.model.AmeGroupLine;
import org.fdl.approval.model.AmeGroup;
import org.fdl.approval.repo.AmeGroupLineRepo;
import org.fdl.approval.repo.AmeGroupRepo;
import org.fdl.approval.repo.AprvUserGroupRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import org.fdl.approval.dto.AmeGroupDto;
import org.fdl.approval.dto.AmeGroupLineDto;
import org.fdl.approval.dto.AprvUserGroupDto;
import org.fdl.approval.dto.SelectDto;

import static org.fdl.approval.dto._Mode.*;

/**
 *
 * @author Manik
 */
@Service
public class AmeGroupService {

    @Autowired
    private AmeGroupRepo ameGroupRepo;

    @Autowired
    private AmeGroupLineRepo ameGroupLineRepo;

    @Autowired
    private AprvUserGroupRepo aprvUserGroupRepo;

    public AmeGroupDto findById(Long id) {

        AmeGroup x = ameGroupRepo.getById(id);
        AmeGroupDto b = new AmeGroupDto();
        b.setId(x.getId());
        b.setVersion(x.getVersion());
        // b.setCode(x.getCode());
        b.setDescription(x.getDescription());
//        b.setGroupDescription(x.getGroupDescription());
        b.setActive(x.isActive());
        //  b.setLookupType(x.getLookupType());

        final AtomicInteger index = new AtomicInteger();

        List<AmeGroupLineDto> productPriceListx = x.getLines().stream()
                .map(p -> {
                    AmeGroupLineDto kk = new AmeGroupLineDto();

                    kk.setId(p.getId());
                    kk.set_index(index.getAndIncrement());

                    // private AmeGroupDto ameGroup;
                    AprvUserGroupDto aud = new AprvUserGroupDto();
                    aud.setId(p.getAprvUserGroup().getId());
                    aud.setName(p.getAprvUserGroup().getName());
                    kk.setAprvUserGroup(aud);

                    kk.setSlNo(p.getSlNo());
                    kk.setActive(p.isActive());

                    return kk;
                })//
                .collect(Collectors.toList());

        b.setLines(productPriceListx);

        return b;
    }

    public List<AmeGroupDto> listConv(List<AmeGroup> oos) {
        List<AmeGroupDto> mms = new ArrayList();

        for (AmeGroup x : oos) {
            AmeGroupDto b = new AmeGroupDto();
            b.setId(x.getId());
            b.setDescription(x.getDescription());
            b.setActive(x.isActive());
            mms.add(b);
        }

        return mms;
    }

    public List<AmeGroupDto> findAll() {
        return listConv(ameGroupRepo.findAll());
    }

    public Page<AmeGroupDto> findAll(String search, Pageable pageable) {
        Page<AmeGroup> pp = ameGroupRepo.customQuery(search.toLowerCase(),pageable);
        System.out.println("find all "+search+pp.getContent());
        Page<AmeGroupDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());
        return mmmm;
    }

    public Page<AmeGroupDto> findAll(Pageable pageable) {
        Page<AmeGroup> pp = ameGroupRepo.findAll(pageable);

        Page<AmeGroupDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());

        return mmmm;
    }

    public void save(AmeGroupDto obj) {

        AmeGroup xx = new AmeGroup();
        xx.setActive(obj.isActive());
        xx.setDescription(obj.getDescription());

        AmeGroup xxx = ameGroupRepo.save(xx);

        processDetail(obj.getLines(), xxx);
    }

    public void deleteById(Long id) {
        ameGroupRepo.deleteById(id);
    }

    public void update(Long id, AmeGroupDto obj) {

        System.out.println("update lookup " + obj);
        AmeGroup xx = ameGroupRepo.findById(id).get();

        xx.setActive(obj.isActive());
        xx.setDescription(obj.getDescription());

        processDetail(obj.getLines(), xx);

        ameGroupRepo.save(xx);
    }

    private void processDetail(List<AmeGroupLineDto> details, AmeGroup xx) {

        for (AmeGroupLineDto dtlDto : details) {

            if (null != dtlDto.get_mode()) {
                switch (dtlDto.get_mode()) {
                    case NEW:
                    case NEW_UPDATED:

                        AmeGroupLine newObj = new AmeGroupLine();
                        newObj.setAmeGroup(xx);
                        newObj.setActive(dtlDto.isActive());

                        newObj.setSlNo(dtlDto.getSlNo());

                        newObj.setAprvUserGroup(aprvUserGroupRepo.getById(dtlDto.getAprvUserGroup().getId()));

                        ameGroupLineRepo.save(newObj);
                        break;
                    case UPDATED:
                        AmeGroupLine oldObj = ameGroupLineRepo.getById(dtlDto.getId());
                        // ameGroupLineRepo.merge(old, childArray);
                        oldObj.setActive(dtlDto.isActive());
                        
                        
                        oldObj.setSlNo(dtlDto.getSlNo());

                        oldObj.setAprvUserGroup(aprvUserGroupRepo.getById(dtlDto.getAprvUserGroup().getId()));

                        //  oldObj.setAuthUser(authUserRepo.getById(dtlDto.getAuthUser().getId()));

                        ameGroupLineRepo.save(oldObj);

                        //await ameGroupLineRepo.update(childArray, { where: { id: childArray.id } });
                        break;
                    case DELETED:
                        ameGroupLineRepo.deleteById(dtlDto.getId());
                        break;
                    default:
                        break;
                }
            }
        }
    }
    
    
    public List<SelectDto> findAllMinDto() {
        List<SelectDto> pp = new ArrayList();
        for (AmeGroup aa : ameGroupRepo.findAll()) {

            SelectDto qq = new SelectDto();
            qq.setValue(aa.getId());
            qq.setLabel(aa.getDescription());
            pp.add(qq);
        }
        return pp;
    }
}
