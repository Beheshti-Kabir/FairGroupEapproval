package org.fdl.approval.service;

import org.fdl.approval.dto.SelectDto;
import org.fdl.approval.model.CompanyInfo;
import org.fdl.approval.repo.CompanyInfoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Manik
 */
@Service
public class CompanyInfoService {

    @Autowired
    private CompanyInfoRepo companyInfoRepo;

//    @Autowired
//    private UtilityService utilityService;
//    @Autowired
//    private PasswordEncoder passwordEncoder;
    public CompanyInfo findById(Long id) {
        return companyInfoRepo.findById(id).get();
    }

    public List<CompanyInfo> findAll() {
        return companyInfoRepo.findAll();
    }

    public Page<CompanyInfo> findAll(Pageable pageable) {
        return companyInfoRepo.findAll(pageable);
    }

    public void save(CompanyInfo obj) {
        companyInfoRepo.save(obj);
    }

    public void delete(CompanyInfo obj) {
        companyInfoRepo.delete(obj);
    }

    public CompanyInfo findByCodeOrName(String code) {
        return companyInfoRepo.findByCodeOrName(code);
    }

    public void deleteById(Long id) {
        companyInfoRepo.deleteById(id);
    }

    public void update(Long id, CompanyInfo obj) {
        CompanyInfo xx = companyInfoRepo.findById(id).get();
        xx.setCode(obj.getCode());
        xx.setCompanyName(obj.getCompanyName());
        xx.setActive(obj.isActive());
        companyInfoRepo.save(xx);

    }

    public List<SelectDto> findAllMinDto() {
        List<SelectDto> pp = new ArrayList();
        for (CompanyInfo aa : companyInfoRepo.findAllByActiveTrue()) {

            SelectDto qq = new SelectDto();
            qq.setValue(aa.getId());
            qq.setLabel(aa.getCompanyName());
            pp.add(qq);
        }

        return pp;

    }
}
