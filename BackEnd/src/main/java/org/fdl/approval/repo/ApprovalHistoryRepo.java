/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.fdl.approval.repo;

import java.util.List;
import java.util.Map;

import org.fdl.approval.model.ApprovalHistory;
import org.fdl.approval.model.ApprovalStatus;
import org.fdl.approval.model.TrnscMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 *
 * @author User
 */
@Repository
public interface ApprovalHistoryRepo extends JpaRepository<ApprovalHistory, Long> {

    @Query("SELECT m FROM ApprovalHistory m WHERE m.mstId=:uid order by m.levelNo")
    public List<ApprovalHistory> findCustom(@Param("uid") Long uid);

    @Query("SELECT m FROM ApprovalHistory m  WHERE 1=1 " +
            "and (:authUserId is null or m.authUserActionById=:authUserId) " +
            "and (:searchLookupDetailTrnscType is null or m.docType=:searchLookupDetailTrnscType) " +
            "and (:comSearch is null or lower(m.docCode) like lower(concat('%',:comSearch,'%'))) " +
            "and (:approvalStatus is null or m.status=:approvalStatus) " +
            "order by m.id desc")
    Page<ApprovalHistory> customQuery(@Param("authUserId") Long authUserId,
                                      @Param("comSearch") String comSearch,
                                      @Param("searchLookupDetailTrnscType")  String searchLookupDetailTrnscType,
                                      @Param("approvalStatus") ApprovalStatus approvalStatus, Pageable pageable);
   // @Query(value = "SELECT TM.CODE,AH.ID, LEVEL_NO, NAME, MST_ID, REQ_DATE, RES_DATE, STATUS, REMARKS, APRV_USER_GROUP_ID, APRV_USER_GROUP_NAME, AUTH_USER_FORWARDED_ID, AUTH_USER_FORWARDED_NAME,AUTH_USER_ACTION_BY_ID, AUTH_USER_ACTION_BY_NAME, AUTH_USER_PERV_NAME, AUTH_USER_PERV_ID, REF_TABLE_NAME, DOC_TYPE,AUTH_USER_SUBMIT_NAME, AUTH_USER_SUBMIT_ID, IS_REJECTED FROM APPROVAL_HISTORY AH, TRNSC_MASTER TM WHERE AH.MST_ID=TM.ID and ah.auth_User_Action_By_Id=:authUserId order by ah.id desc",nativeQuery=true)
   // Page<ApprovalHistory> customQuery(@Param("authUserId") Long authUserId, Pageable pageable);

//    @Query("SELECT m FROM ApprovalHistory m WHERE m.authUserActionById=:authUserId and :comSearch=:comSearch and :trnscTypeId=:trnscTypeId and :approvalStatus=:approvalStatus order by m.id desc")
//    Page<ApprovalHistory> customQuery(@Param("authUserId") Long authUserId, @Param("comSearch") String comSearch, @Param("trnscTypeId")  Long trnscTypeId, @Param("approvalStatus") ApprovalStatus approvalStatus, Pageable pageable);

    @Query(value = "Select ah.* FROM APPROVAL_HISTORY ah, TRNSC_MASTER TM "
            + " WHERE ah.MST_ID=TM.ID "
            + " order by ah.id desc",nativeQuery=true)
    List<Map<String , Object>>findAll(@Param("authUserId") Long authUserId, Pageable pageable);

}
