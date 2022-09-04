package org.fdl.approval.service;

import org.fdl.approval.dto.AmeCondiDto;
import org.fdl.approval.dto.AmeCondiLineDto;
import org.fdl.approval.model.AmeCondi;
import org.fdl.approval.model.AmeCondiLine;
import org.fdl.approval.repo.AmeCondiLineRepo;
import org.fdl.approval.repo.AmeCondiRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import org.fdl.approval.dto.SelectDto;

import static org.fdl.approval.dto._Mode.*;

/**
 * @author Manik
 */
@Service
public class AmeCondiService {

    @Autowired
    private AmeCondiRepo ameCondiRepo;

    @Autowired
    private AmeCondiLineRepo ameCondiLineRepo;

    public AmeCondiDto findById(Long id) {

        AmeCondi x = ameCondiRepo.getById(id);
        AmeCondiDto b = new AmeCondiDto();
        b.setId(x.getId());
        b.setVersion(x.getVersion());
        // b.setCode(x.getCode());
        //b.setDescription(x.getDescription());
        b.setDescription(x.getDescription());
        b.setActive(x.isActive());
        //  b.setLookupType(x.getLookupType());

        final AtomicInteger index = new AtomicInteger();

        List<AmeCondiLineDto> productPriceListx = x.getLines().stream()
                .map(p -> {
                    AmeCondiLineDto kk = new AmeCondiLineDto();

                    kk.setId(p.getId());
                    kk.set_index(index.getAndIncrement());
                    kk.setSlNo(p.getSlNo());
                    kk.setCondiSql(p.getCondiSql());
                    // kk.setCondiDetail(p.getCondiDetail);


//                    AuthUserDto aud=new AuthUserDto();
//                    aud.setId(p.getAuthUser().getId());
//                    aud.setName(p.getAuthUser().getFullName());
//                    kk.setAuthUser(aud);

                    kk.setActive(p.isActive());

                    return kk;
                })//
                .collect(Collectors.toList());

        b.setLines(productPriceListx);

        return b;
    }

    public List<AmeCondiDto> listConv(List<AmeCondi> oos) {
        List<AmeCondiDto> mms = new ArrayList();

        for (AmeCondi x : oos) {
            AmeCondiDto b = new AmeCondiDto();
            b.setId(x.getId());
//            b.setCondiDescription(x.getCondiDescription());
            b.setDescription(x.getDescription());
            b.setActive(x.isActive());
            //b.set(x.isActive());

            mms.add(b);
        }

        return mms;
    }

    public List<AmeCondiDto> findAll() {
        return listConv(ameCondiRepo.findAll());
    }

    public Page<AmeCondiDto> findAll(String search,Pageable pageable) {
        Page<AmeCondi> pp = ameCondiRepo.customQuery(search.toLowerCase(),pageable);
        System.out.println("find all "+search+pp.getContent());
        Page<AmeCondiDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());
        return mmmm;
    }

    public Page<AmeCondiDto> findAll(Pageable pageable) {
        Page<AmeCondi> pp = ameCondiRepo.findAll(pageable);
        Page<AmeCondiDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());
        return mmmm;
    }

    public void save(AmeCondiDto obj) {
        // ameCondiRepo.save(obj);

        AmeCondi xx = new AmeCondi();

        //xx.setCondiDescription(obj.getCondiDescription());
        xx.setActive(obj.isActive());
        xx.setDescription(obj.getDescription());

        AmeCondi xxx = ameCondiRepo.save(xx);

        processDetail(obj.getLines(), xxx);

    }

    public void deleteById(Long id) {
        ameCondiRepo.deleteById(id);
    }

    public void update(Long id, AmeCondiDto obj) {

        System.out.println("update lookup " + obj + " id: " + id);
        AmeCondi xx = ameCondiRepo.findById(id).get();

//        xx.setCondiDescription(obj.getCondiDescription());
        xx.setActive(obj.isActive());
        //xx.setDescription(obj.getDescription());

        processDetail(obj.getLines(), xx);

        ameCondiRepo.save(xx);
    }

    private void processDetail(List<AmeCondiLineDto> details, AmeCondi xx) {


        System.out.println("aaaaaaaaaaa"+details);

        for (AmeCondiLineDto dtlDto : details) {

            if (null != dtlDto.get_mode()) {
                switch (dtlDto.get_mode()) {
                    case NEW:
                    case NEW_UPDATED:

                        AmeCondiLine newObj = new AmeCondiLine();
                        newObj.setAmeCondi(xx);
                        newObj.setActive(dtlDto.isActive());
                        newObj.setSlNo(dtlDto.getSlNo());
                        newObj.setCondiSql(dtlDto.getCondiSql());
                        //newObj.setAuthUser(authUserRepo.getById(dtlDto.getAuthUser().getId()));

                        ameCondiLineRepo.save(newObj);
                        break;
                    case UPDATED:
                        AmeCondiLine oldObj = ameCondiLineRepo.getById(dtlDto.getId());
                        // ameCondiDtlTblRepo.merge(old, childArray);
                        oldObj.setActive(dtlDto.isActive());
                        oldObj.setSlNo(dtlDto.getSlNo());
                        oldObj.setCondiSql(dtlDto.getCondiSql());
                        oldObj.setAmeCondi(xx);

                        //oldObj.setCondiDetail(dtlDto.getCondiDetail);
                        //  oldObj.setAuthUser(authUserRepo.getById(dtlDto.getAuthUser().getId()));

                        ameCondiLineRepo.save(oldObj);

                        //await ameCondiDtlTblRepo.update(childArray, { where: { id: childArray.id } });
                        break;
                    case DELETED:
                        ameCondiLineRepo.deleteById(dtlDto.getId());
                        break;
                    default:
                        break;
                }
            }
        }
    }
    
    public List<SelectDto> findAllMinDto() {
        List<SelectDto> pp = new ArrayList();
        for (AmeCondi aa : ameCondiRepo.findAll()) {

            SelectDto qq = new SelectDto();
            qq.setValue(aa.getId());
            qq.setLabel(aa.getDescription());
            pp.add(qq);
        }
        return pp;
    }


}
