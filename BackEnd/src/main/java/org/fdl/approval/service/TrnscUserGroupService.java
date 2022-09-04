package org.fdl.approval.service;

import java.util.ArrayList;

import org.fdl.approval.dto.*;
import org.fdl.approval.model.AmeCondi;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.fdl.approval.model.TrnscUserGroup;
import static org.fdl.approval.dto._Mode.DELETED;
import static org.fdl.approval.dto._Mode.NEW;
import static org.fdl.approval.dto._Mode.NEW_UPDATED;
import static org.fdl.approval.dto._Mode.UPDATED;
import org.fdl.approval.model.TrnscUserGroupLine;
import org.fdl.approval.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

/**
 *
 * @author Manik
 */
@Service
public class TrnscUserGroupService {

    @Autowired
    private TrnscUserGroupRepo trnscUserGroupRepo;

    @Autowired
    private TrnscUserGroupLineRepo trnscUserGroupLineRepo;

    @Autowired
    private AuthUserRepo authUserRepo;
    
    @Autowired
    private LookupDetailRepo lookupDetailRepo;

    public TrnscUserGroupDto findById(Long id) {

        TrnscUserGroup x = trnscUserGroupRepo.getById(id);
        TrnscUserGroupDto b = new TrnscUserGroupDto();
        b.setId(x.getId());
        b.setVersion(x.getVersion());
        //b.setCode(x.getCode());
        //b.setDescription(x.getDescription());
        //b.setName(x.getName());
        
        LookupDetailDto gtg = new LookupDetailDto();
        gtg.setId(x.getLookupDetailTrnscType().getId());
        gtg.setCode(x.getLookupDetailTrnscType().getCode());
        b.setLookupDetailTrnscType(gtg);
        
        
        
        b.setActive(x.isActive());
        //  b.setLookupType(x.getLookupType());

        final AtomicInteger index = new AtomicInteger();

        List<TrnscUserGroupLineDto> productPriceListx = x.getTrnscUserGroupLines().stream()
                .map(p -> {
                    TrnscUserGroupLineDto kk = new TrnscUserGroupLineDto();

                    kk.setId(p.getId());
                    kk.set_index(index.getAndIncrement());
                    
                    AuthUserDto aud=new AuthUserDto(); 
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

    public List<TrnscUserGroupDto> listConv(List<TrnscUserGroup> oos) {
        List<TrnscUserGroupDto> mms = new ArrayList();

        for (TrnscUserGroup x : oos) {
            TrnscUserGroupDto b = new TrnscUserGroupDto();
            b.setId(x.getId());
            //b.setName(x.getName());
            //b.setDescription(x.getDescription());
            b.setActive(x.isActive());
            //b.set(x.isActive());
            
            
        LookupDetailDto gtg = new LookupDetailDto();
        gtg.setId(x.getLookupDetailTrnscType().getId());
        gtg.setCode(x.getLookupDetailTrnscType().getCode());
        b.setLookupDetailTrnscType(gtg);
        

            mms.add(b);
        }

        return mms;
    }

    public List<TrnscUserGroupDto> findAll() {
        return listConv(trnscUserGroupRepo.findAll());
    }

    public Page<TrnscUserGroupDto> findAll(Pageable pageable) {
        Page<TrnscUserGroup> pp = trnscUserGroupRepo.findAll(pageable);

        Page<TrnscUserGroupDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());

        return mmmm;
    }

    public Page<TrnscUserGroupDto> findAll(String search, Pageable pageable) {
        Page<TrnscUserGroup> pp = trnscUserGroupRepo.customQuery(search.toLowerCase(),pageable);
        System.out.println("find all "+search+pp.getContent());
        Page<TrnscUserGroupDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());
        return mmmm;
    }

    public void save(TrnscUserGroupDto obj) {
        // trnscUserGroupRepo.save(obj);

        TrnscUserGroup xx = new TrnscUserGroup();

        //xx.setName(obj.getName());
        xx.setActive(obj.isActive());
        xx.setLookupDetailTrnscType(lookupDetailRepo.getById(obj.getLookupDetailTrnscType().getId()));

        //xx.setDescription(obj.getDescription());

        TrnscUserGroup xxx = trnscUserGroupRepo.save(xx);

        processDetail(obj.getLines(), xxx);

    }

    public void deleteById(Long id) {
        trnscUserGroupRepo.deleteById(id);
    }

    public void update(Long id, TrnscUserGroupDto obj) {

        System.out.println("update lookup " + obj);
        TrnscUserGroup xx = trnscUserGroupRepo.findById(id).get();

        xx.setLookupDetailTrnscType(lookupDetailRepo.getById(obj.getLookupDetailTrnscType().getId()));

//        xx.setName(obj.getName());
        xx.setActive(obj.isActive());
        //xx.setDescription(obj.getDescription());

        processDetail(obj.getLines(), xx);

        trnscUserGroupRepo.save(xx);
    }

    private void processDetail(List<TrnscUserGroupLineDto> details, TrnscUserGroup xx) {

        for (TrnscUserGroupLineDto dtlDto : details) {

            if (null != dtlDto.get_mode()) {
                switch (dtlDto.get_mode()) {
                    case NEW:
                    case NEW_UPDATED:

                        TrnscUserGroupLine newObj = new TrnscUserGroupLine();
                        newObj.setTrnscUserGroup(xx);
                        newObj.setActive(dtlDto.isActive());
                        newObj.setAuthUser(authUserRepo.getById(dtlDto.getAuthUser().getId()));

                        trnscUserGroupLineRepo.save(newObj);
                        break;
                    case UPDATED:
                        TrnscUserGroupLine oldObj = trnscUserGroupLineRepo.getById(dtlDto.getId());
                        // trnscUserGroupLineRepo.merge(old, childArray);
                        oldObj.setActive(dtlDto.isActive());
                        oldObj.setAuthUser(authUserRepo.getById(dtlDto.getAuthUser().getId()));

                        trnscUserGroupLineRepo.save(oldObj);

                        //await trnscUserGroupLineRepo.update(childArray, { where: { id: childArray.id } });
                        break;
                    case DELETED:
                        trnscUserGroupLineRepo.deleteById(dtlDto.getId());
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
