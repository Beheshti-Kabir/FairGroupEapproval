package org.fdl.approval.service;

import org.fdl.approval.model.AprvUserGroup;
import org.fdl.approval.model.AprvUserGroupLine;
import org.fdl.approval.repo.AprvUserGroupLineRepo;
import org.fdl.approval.repo.AprvUserGroupRepo;
import org.fdl.approval.repo.AuthUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import org.fdl.approval.dto.AprvUserGroupDto;
import org.fdl.approval.dto.AprvUserGroupLineDto;
import org.fdl.approval.dto.AuthUserDto;
import org.fdl.approval.dto.SelectDto;

import static org.fdl.approval.dto._Mode.*;

/**
 *
 * @author Manik
 */
@Service
public class AprvUserGroupService {

    @Autowired
    private AprvUserGroupRepo aprvUserGroupRepo;

    @Autowired
    private AprvUserGroupLineRepo aprvUserGroupLineRepo;

    @Autowired
    private AuthUserRepo authUserRepo;

    public AprvUserGroupDto findById(Long id) {

        AprvUserGroup x = aprvUserGroupRepo.getById(id);
        AprvUserGroupDto b = new AprvUserGroupDto();
        b.setId(x.getId());
        b.setVersion(x.getVersion());
        // b.setCode(x.getCode());
        b.setDescription(x.getDescription());
        b.setName(x.getName());
        b.setActive(x.isActive());
        //  b.setLookupType(x.getLookupType());

        final AtomicInteger index = new AtomicInteger();

        List<AprvUserGroupLineDto> productPriceListx = x.getAprvUserGroupLines().stream()
                .map(p -> {
                    AprvUserGroupLineDto kk = new AprvUserGroupLineDto();

                    kk.setId(p.getId());
                    kk.set_index(index.getAndIncrement());

                    AuthUserDto aud = new AuthUserDto();
                    aud.setId(p.getAuthUser().getId());
                    aud.setName(p.getAuthUser().getFullName());
                    kk.setAuthUser(aud);

                    kk.setActive(p.isActive());

                    return kk;
                })//
                .collect(Collectors.toList());

        b.setLines(productPriceListx);

        return b;
    }

    public List<AprvUserGroupDto> listConv(List<AprvUserGroup> oos) {
        List<AprvUserGroupDto> mms = new ArrayList();

        for (AprvUserGroup x : oos) {
            AprvUserGroupDto b = new AprvUserGroupDto();
            b.setId(x.getId());
            b.setName(x.getName());
            b.setDescription(x.getDescription());
            b.setActive(x.isActive());
            //b.set(x.isActive());

            mms.add(b);
        }

        return mms;
    }

    public List<AprvUserGroupDto> findAll() {
        return listConv(aprvUserGroupRepo.findAll());
    }

    public Page<AprvUserGroupDto> findAll(String search, Pageable pageable) {
        Page<AprvUserGroup> pp = aprvUserGroupRepo.customQuery(search.toLowerCase(),pageable);
        //System.out.println("find all "+search+pp.getContent());
        Page<AprvUserGroupDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());
        return mmmm;
    }

    public Page<AprvUserGroupDto> findAll(Pageable pageable) {
        Page<AprvUserGroup> pp = aprvUserGroupRepo.findAll(pageable);

        Page<AprvUserGroupDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());

        return mmmm;
    }

    public void save(AprvUserGroupDto obj) {
        // aprvUserGroupRepo.save(obj);

        AprvUserGroup xx = new AprvUserGroup();

        xx.setName(obj.getName());
        xx.setActive(obj.isActive());
        xx.setDescription(obj.getDescription());

        AprvUserGroup xxx = aprvUserGroupRepo.save(xx);

        processDetail(obj.getLines(), xxx);

    }

    public void deleteById(Long id) {
        aprvUserGroupRepo.deleteById(id);
    }

    public void update(Long id, AprvUserGroupDto obj) {

        System.out.println("update lookup " + obj);
        AprvUserGroup xx = aprvUserGroupRepo.findById(id).get();

        xx.setName(obj.getName());
        xx.setActive(obj.isActive());
        xx.setDescription(obj.getDescription());

        processDetail(obj.getLines(), xx);

        aprvUserGroupRepo.save(xx);
    }

    private void processDetail(List<AprvUserGroupLineDto> details, AprvUserGroup xx) {

        for (AprvUserGroupLineDto dtlDto : details) {

            if (null != dtlDto.get_mode()) {
                switch (dtlDto.get_mode()) {
                    case NEW:
                    case NEW_UPDATED:

                        AprvUserGroupLine newObj = new AprvUserGroupLine();
                        newObj.setAprvUserGroup(xx);
                        newObj.setActive(dtlDto.isActive());
                        newObj.setAuthUser(authUserRepo.getById(dtlDto.getAuthUser().getId()));

                        aprvUserGroupLineRepo.save(newObj);
                        break;
                    case UPDATED:
                        AprvUserGroupLine oldObj = aprvUserGroupLineRepo.getById(dtlDto.getId());
                        // aprvUserGroupLineRepo.merge(old, childArray);
                        oldObj.setActive(dtlDto.isActive());
                        oldObj.setAuthUser(authUserRepo.getById(dtlDto.getAuthUser().getId()));

                        aprvUserGroupLineRepo.save(oldObj);

                        //await aprvUserGroupLineRepo.update(childArray, { where: { id: childArray.id } });
                        break;
                    case DELETED:
                        aprvUserGroupLineRepo.deleteById(dtlDto.getId());
                        break;
                    default:
                        break;
                }
            }
        }
    }

    public List<SelectDto> findAllMinDto() {
        List<SelectDto> pp = new ArrayList();
        for (AprvUserGroup aa : aprvUserGroupRepo.findAll()) {

            SelectDto qq = new SelectDto();
            qq.setValue(aa.getId());
            qq.setLabel(aa.getName());
            pp.add(qq);
        }

        return pp;

    }

}
