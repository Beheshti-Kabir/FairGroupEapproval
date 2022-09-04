package org.fdl.approval.service;

import java.util.ArrayList;

import org.fdl.approval.dto.*;
import org.fdl.approval.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static org.fdl.approval.dto._Mode.DELETED;
import static org.fdl.approval.dto._Mode.NEW;
import static org.fdl.approval.dto._Mode.NEW_UPDATED;
import static org.fdl.approval.dto._Mode.UPDATED;

import org.fdl.approval.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

/**
 *
 * @author Manik
 */
@Service
public class TrnscMasterService {

    @Autowired
    private TrnscMasterRepo trnscMasterRepo;

    @Autowired
    private TrnscDetailRepo trnscDetailRepo;

    @Autowired
    private LookupDetailRepo lookupDetailRepo;

    @Autowired
    private CompanyInfoRepo companyInfoRepo;

    @Autowired
    private TrnscAttachRepo trnscAttachRepo;

    public TrnscMasterDto findById(Long id) {

        TrnscMaster x = trnscMasterRepo.getById(id);
        TrnscMasterDto b = new TrnscMasterDto();
        b.setId(x.getId());
        b.setVersion(x.getVersion());
        b.setCode(x.getCode());
        b.setApprovalStatus(x.getApprovalStatus());
        b.setDescription(x.getDescription());
        b.setReferenceEmail(x.getReferenceEmail());
        b.setTermsCondition(x.getTermsCondition());
        //b.setTotalAmount(x.getTotalAmount());
        b.setTotalAmount(x.getTrnscDetails().isEmpty() ? 0 : x.getTotalAmount());

        b.setTrnscDate(x.getTrnscDate());
        b.setSubmitUserName(x.getSubmitUserName());

        CompanyInfoDto com = new CompanyInfoDto();
        com.setId(x.getCompanyInfo().getId());
        com.setCode(x.getCompanyInfo().getCode());
        b.setCompanyInfo(com);

        LookupDetailDto gtg = new LookupDetailDto();
        gtg.setId(x.getLookupDetailTrnscType().getId());
        gtg.setCode(x.getLookupDetailTrnscType().getCode());
        b.setLookupDetailTrnscType(gtg);
      //  System.out.println("found source:>>"+x.getLookupDetailFundSource());

        if (x.getLookupDetailFundSource() != null) {
            LookupDetailDto fnd = new LookupDetailDto();
            fnd.setId(x.getLookupDetailFundSource().getId());
            fnd.setCode(x.getLookupDetailFundSource().getCode());
            b.setLookupDetailFundSource(fnd);
        } else {
            b.setLookupDetailFundSource(null);
        }

        if (x.getLookupDetailDepartment() != null) {
            LookupDetailDto fnd = new LookupDetailDto();
            fnd.setId(x.getLookupDetailDepartment().getId());
            fnd.setCode(x.getLookupDetailDepartment().getCode());
            b.setLookupDetailDepartment(fnd);
        } else {
            b.setLookupDetailDepartment(null);
        }

        if (x.getTrnscMasterAdmendRef() != null) {
            SelectDto fnd = new SelectDto();
            fnd.setValue(x.getTrnscMasterAdmendRef().getId());
            fnd.setLabel(x.getTrnscMasterAdmendRef().getCode());
            b.setTrnscMasterAdmendRef(fnd);
        } else {
            b.setTrnscMasterAdmendRef(null);
        }


//        LookupDetailDto fnd = new LookupDetailDto();
//        fnd.setId(x.getLookupDetailFundSource().getId());
//        fnd.setCode(x.getLookupDetailFundSource().getCode());
//        b.setLookupDetailFundSource(fnd);

//        TrnscMasterDto ref = new TrnscMasterDto();
//        ref.setId(x.getTrnscMasterAdmendRef().getId());
//        ref.setCode(x.getTrnscMasterAdmendRef().getCode());
//        b.setTrnscMasterAdmendRef(ref);

        final AtomicInteger index = new AtomicInteger();

        List<TrnscDetailDto> productPriceListx = x.getTrnscDetails().stream()
                .map(p -> {
                    TrnscDetailDto kk = new TrnscDetailDto();

                    kk.setId(p.getId());
                    kk.set_index(index.getAndIncrement());

                    if (p.getLookupDetailParticular() != null) {
                        LookupDetailDto paa = new LookupDetailDto();
                        paa.setId(p.getLookupDetailParticular().getId());
                        paa.setCode(p.getLookupDetailParticular().getCode());
                        kk.setLookupDetailParticular(paa);
                    } else {
                        kk.setLookupDetailParticular(null);
                    }

                    if (p.getLookupDetailCurrency() != null) {
                        LookupDetailDto paa = new LookupDetailDto();
                        paa.setId(p.getLookupDetailCurrency().getId());
                        paa.setCode(p.getLookupDetailCurrency().getCode());
                        kk.setLookupDetailCurrency(paa);
                    } else {
                        kk.setLookupDetailCurrency(null);
                    }

                    kk.setDescription(p.getDescription());
                    kk.setRemarks(p.getRemarks());

                    kk.setQuantitive(p.isQuantitive());

                    //  kk.setAmount(p.getAmount());
                    kk.setQty(p.getQty());
                    kk.setUnitPrice(p.getUnitPrice());
                    kk.setLineTotal(p.getLineTotal());

                    return kk;
                })//
                .collect(Collectors.toList());

        b.setTrnscDetails(productPriceListx);

        final AtomicInteger index1 = new AtomicInteger();

        List<TrnscAttachDto> productPriceList = x.getTrnscAttachs().stream()
                .map(p -> {
                    TrnscAttachDto kk = new TrnscAttachDto();

                    kk.setId(p.getId());
                    kk.set_index(index1.getAndIncrement());

                    kk.setCode(p.getCode());
                    kk.setName(p.getName());
                    kk.setContentType(p.getContentType());
                    kk.setFileSize(p.getFileSize());

                    return kk;
                })//
                .collect(Collectors.toList());

        b.setTrnscAttachs(productPriceList);
        return b;
    }

    public List<SelectDto> listCon(List<TrnscMaster> oos) {
        List<SelectDto> mms = new ArrayList();

        for (TrnscMaster x : oos) {
            SelectDto b = new SelectDto();
            b.setValue(x.getId());
            b.setLabel(x.getCode());
            mms.add(b);
        }

        return mms;
    }

    public List<TrnscMasterDto> listConv(List<TrnscMaster> oos) {
        List<TrnscMasterDto> mms = new ArrayList();

        for (TrnscMaster x : oos) {
            TrnscMasterDto b = new TrnscMasterDto();
            b.setId(x.getId());
            b.setCode(x.getCode());
            b.setApprovalStatus(x.getApprovalStatus());
            b.setDescription(x.getDescription());
            b.setReferenceEmail(x.getReferenceEmail());
            b.setTermsCondition(x.getTermsCondition());
            b.setTotalAmount(x.getTotalAmount());
//            b.setTotalAmount(x.getTrnscDetails().isEmpty() ? 0 : x.getTotalAmount());

            b.setTrnscDate(x.getTrnscDate());

//            CompanyInfoDto com = new CompanyInfoDto();
//            com.setId(x.getCompanyInfo().getId());
//            com.setCode(x.getCompanyInfo().getCode());
//            b.setCompanyInfo(com);

            LookupDetailDto gtg = new LookupDetailDto();
            gtg.setId(x.getLookupDetailTrnscType().getId());
            gtg.setCode(x.getLookupDetailTrnscType().getCode());
            b.setLookupDetailTrnscType(gtg);

//            SelectDto gtgx = new SelectDto();
//            gtgx.setValue(x.getTrnscMasterAdmendRef().getId());
//            gtgx.setLabel(x.getTrnscMasterAdmendRef().getCode());
//            b.setTrnscMasterAdmendRef(gtgx);

            mms.add(b);
        }

        return mms;
    }

    public List<SelectDto> findAll() {
        return listCon(trnscMasterRepo.findAll());
    }

    public Page<TrnscMasterDto> findAll(Long usrId, Pageable pageable) {
        Page<TrnscMaster> pp = trnscMasterRepo.customQuery(usrId, pageable);
//        Page<TrnscMaster> pp = trnscMasterRepo.findAll(pageable);

        Page<TrnscMasterDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());

        return mmmm;
    }

    public void save(TrnscMasterDto obj) {
        // trnscMasterRepo.save(obj);

        TrnscMaster xx = new TrnscMaster();

        xx.setCode(obj.getCode());
        xx.setApprovalStatus(obj.getApprovalStatus());
        xx.setDescription(obj.getDescription());
        xx.setReferenceEmail(obj.getReferenceEmail());
        xx.setTermsCondition(obj.getTermsCondition());
        //xx.setTotalAmount(obj.getTotalAmount());
        xx.setTotalAmount(obj.getTrnscDetails().isEmpty() ? 0 : obj.getTotalAmount());

        xx.setTrnscDate(obj.getTrnscDate());
        xx.setLookupDetailTrnscType(lookupDetailRepo.getById(obj.getLookupDetailTrnscType().getId()));

        System.out.println("fund source save"+xx.getLookupDetailFundSource());
        if (obj.getLookupDetailFundSource() != null   && obj.getLookupDetailFundSource().getId() != null) {
            xx.setLookupDetailFundSource(lookupDetailRepo.getById(obj.getLookupDetailFundSource().getId()));
        } else {
            xx.setLookupDetailFundSource(null);
        }

        System.out.println("Department save"+xx.getLookupDetailDepartment());
        if (obj.getLookupDetailDepartment() != null   && obj.getLookupDetailDepartment().getId() != null) {
            xx.setLookupDetailDepartment(lookupDetailRepo.getById(obj.getLookupDetailDepartment().getId()));
        } else {
            xx.setLookupDetailDepartment(null);
        }

        if (obj.getTrnscMasterAdmendRef  () != null   && obj.getTrnscMasterAdmendRef().getValue() != null) {
            xx.setTrnscMasterAdmendRef(trnscMasterRepo.getById(obj.getTrnscMasterAdmendRef().getValue()));
        } else {
            xx.setTrnscMasterAdmendRef(null);
        }

//        xx.setLookupDetailFundSource(lookupDetailRepo.getById(obj.getLookupDetailFundSource().getId()));
        //xx.setTrnscMasterAdmendRef(trnscMasterRepo.getById(obj.getTrnscMasterAdmendRef().getId()));
        xx.setCompanyInfo(companyInfoRepo.getById(obj.getCompanyInfo().getId()));



        TrnscMaster xxx = trnscMasterRepo.save(xx);

        obj.setId(xxx.getId());

        processDetail(obj.getTrnscDetails(), xxx);
    }

    public void deleteById(Long id) {
        trnscMasterRepo.deleteById(id);
    }

//const handleDetail = async (id, lines) => {
    //   console.log('handladteail transc master id', id);
    //  if (!lines)
    //     return;
//};
    public void update(Long id, TrnscMasterDto obj) {

        System.out.println("update trnsc " + obj);
        TrnscMaster xx = trnscMasterRepo.findById(id).get();

        xx.setCode(obj.getCode());
        //xx.setApprovalStatus(obj.getApprovalStatus());
        xx.setDescription(obj.getDescription());
        xx.setReferenceEmail(obj.getReferenceEmail());
        xx.setTermsCondition(obj.getTermsCondition());
        xx.setTotalAmount(obj.getTrnscDetails().isEmpty() ? 0 : obj.getTotalAmount());
        xx.setTrnscDate(obj.getTrnscDate());
        xx.setLookupDetailTrnscType(lookupDetailRepo.getById(obj.getLookupDetailTrnscType().getId()));
        //xx.setLookupDetailFundSource(lookupDetailRepo.getById(obj.getLookupDetailFundSource().getId()));
        xx.setCompanyInfo(companyInfoRepo.getById(obj.getCompanyInfo().getId()));
        System.out.println("fund source update "+xx.getLookupDetailFundSource());

        if (obj.getLookupDetailFundSource() != null   && obj.getLookupDetailFundSource().getId() != null) {
            xx.setLookupDetailFundSource(lookupDetailRepo.getById(obj.getLookupDetailFundSource().getId()));
        } else {
            xx.setLookupDetailFundSource(null);
        }

        if (obj.getLookupDetailDepartment() != null   && obj.getLookupDetailDepartment().getId() != null) {
            xx.setLookupDetailDepartment(lookupDetailRepo.getById(obj.getLookupDetailDepartment().getId()));
        } else {
            xx.setLookupDetailDepartment(null);
        }


        if (obj.getTrnscMasterAdmendRef  () != null   && obj.getTrnscMasterAdmendRef().getValue() != null) {
            xx.setTrnscMasterAdmendRef(trnscMasterRepo.getById(obj.getTrnscMasterAdmendRef().getValue()));
        } else {
            xx.setTrnscMasterAdmendRef(null);
        }
        // xx.setTrnscDetails();
        // var myArray = lines.filter(x => x._mode !== undefined);
        // console.log("myarr 62527:", myArray);
        processDetail(obj.getTrnscDetails(), xx);
        processAttach(obj.getTrnscAttachs(), xx);

        trnscMasterRepo.save(xx);
    }

    private void processDetail(List<TrnscDetailDto> details, TrnscMaster xx) {

        for (TrnscDetailDto dtlDto : details) {

            if (null != dtlDto.get_mode()) {
                switch (dtlDto.get_mode()) {
                    case NEW:
                    case NEW_UPDATED:

                        TrnscDetail newObj = new TrnscDetail();
                        newObj.setTrnscMaster(xx);
                        newObj.setDescription(dtlDto.getDescription());
                        newObj.setRemarks(dtlDto.getRemarks());
                        newObj.setQuantitive(dtlDto.isQuantitive());

                        // newObj.setAmount(dtlDto.getAmount());
                        newObj.setQty(dtlDto.getQty());
                        newObj.setUnitPrice(dtlDto.getUnitPrice());

                        newObj.setLineTotal(dtlDto.getLineTotal());

                        if (dtlDto.getLookupDetailParticular() != null && dtlDto.getLookupDetailParticular().getId() != null) {
                            newObj.setLookupDetailParticular(lookupDetailRepo.getById(dtlDto.getLookupDetailParticular().getId()));
                        } else {
                            newObj.setLookupDetailParticular(null);
                        }

                        if (dtlDto.getLookupDetailCurrency() != null && dtlDto.getLookupDetailCurrency().getId() != null) {
                            newObj.setLookupDetailCurrency(lookupDetailRepo.getById(dtlDto.getLookupDetailCurrency().getId()));
                        } else {
                            newObj.setLookupDetailCurrency(null);
                        }

                        trnscDetailRepo.save(newObj);
                        break;
                    case UPDATED:
                        TrnscDetail oldObj = trnscDetailRepo.getById(dtlDto.getId());
                        // trnscDetailRepo.merge(old, childArray);
                        oldObj.setDescription(dtlDto.getDescription());
                        oldObj.setRemarks(dtlDto.getRemarks());
                        oldObj.setQuantitive(dtlDto.isQuantitive());

                        //  oldObj.setAmount(dtlDto.getAmount());
                        oldObj.setQty(dtlDto.getQty());
                        oldObj.setUnitPrice(dtlDto.getUnitPrice());
                        oldObj.setLineTotal(dtlDto.getLineTotal());

                        if (dtlDto.getLookupDetailParticular() != null && dtlDto.getLookupDetailParticular().getId() != null) {
                            oldObj.setLookupDetailParticular(lookupDetailRepo.getById(dtlDto.getLookupDetailParticular().getId()));
                        } else {
                            oldObj.setLookupDetailParticular(null);
                        }

                        if (dtlDto.getLookupDetailCurrency() != null && dtlDto.getLookupDetailCurrency().getId() != null) {
                            oldObj.setLookupDetailCurrency(lookupDetailRepo.getById(dtlDto.getLookupDetailCurrency().getId()));
                        } else {
                            oldObj.setLookupDetailCurrency(null);
                        }

                        trnscDetailRepo.save(oldObj);

                        //await trnscDetailRepo.update(childArray, { where: { id: childArray.id } });
                        break;
                    case DELETED:
                        trnscDetailRepo.deleteById(dtlDto.getId());
                        break;
                    default:
                        break;
                }
            }
        }
    }

    private void processAttach(List<TrnscAttachDto> details, TrnscMaster xx) {

        for (TrnscAttachDto dtlDto : details) {

            if (null != dtlDto.get_mode()) {
                switch (dtlDto.get_mode()) {
                    case NEW:
                    case NEW_UPDATED:

                        TrnscAttach newObj = new TrnscAttach();
                        newObj.setTrnscMaster(xx);
                        newObj.setName(dtlDto.getName());
                        newObj.setContentType(dtlDto.getContentType());
                        newObj.setCode(dtlDto.getCode());
                        newObj.setActive(dtlDto.isActive());
                        newObj.setFileSize(dtlDto.getFileSize());

                        trnscAttachRepo.save(newObj);
                        break;
                    case UPDATED:
                        TrnscAttach oldObj = trnscAttachRepo.getById(dtlDto.getId());
                        oldObj.setName(dtlDto.getName());
                        oldObj.setContentType(dtlDto.getContentType());
                        oldObj.setCode(dtlDto.getCode());
                        oldObj.setActive(dtlDto.isActive());
                        oldObj.setFileSize(dtlDto.getFileSize());

                        trnscAttachRepo.save(oldObj);

                        //await trnscDetailRepo.update(childArray, { where: { id: childArray.id } });
                        break;
                    case DELETED:
                        trnscAttachRepo.deleteById(dtlDto.getId());
                        break;
                    default:
                        break;
                }
            }
        }
    }

    public Page<TrnscMasterDto> findAll(String userType,Long usrId, String comSearch, Long searchLookupDetailTrnscTypeId, ApprovalStatus approvalStatus, Pageable pageable) {
        System.out.println(userType);
        if (userType.equals("ADMIN")){
            System.out.println("admin......");
            Page<TrnscMaster> pp = trnscMasterRepo.customQuery(comSearch, searchLookupDetailTrnscTypeId, approvalStatus, pageable);
            Page<TrnscMasterDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());
            return mmmm;
        }
       else {
            System.out.println("general......");
            Page<TrnscMaster> pp = trnscMasterRepo.customQuery(usrId, comSearch, searchLookupDetailTrnscTypeId, approvalStatus, pageable);
//        Page<TrnscMaster> pp = trnscMasterRepo.findAll(pageable);
            Page<TrnscMasterDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());
            return mmmm;
         }


    }

//    public Page<TrnscMasterDto> findAllAdmin(Long usrId, String comSearch, Long searchLookupDetailTrnscTypeId, ApprovalStatus approvalStatus, Pageable pageable) {
//        Page<TrnscMaster> pp = trnscMasterRepo.customAdmin(usrId,comSearch, searchLookupDetailTrnscTypeId, approvalStatus, pageable);
////        Page<TrnscMaster> pp = trnscMasterRepo.findAll(pageable);
//
//        Page<TrnscMasterDto> mmmm = new PageImpl(listConv(pp.getContent()), pageable, pp.getTotalElements());
//
//        return mmmm;
//    }
}
