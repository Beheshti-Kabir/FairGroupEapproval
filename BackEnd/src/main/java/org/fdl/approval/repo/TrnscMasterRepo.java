package org.fdl.approval.repo;

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
 * @author Manik
 */

@Repository
public interface TrnscMasterRepo extends JpaRepository<TrnscMaster, Long> {

    @Query("select y from TrnscMaster y inner join y.lookupDetailTrnscType u where u in (select m from LookupDetail m, TrnscUserGroup x inner join x.trnscUserGroupLines t where x.lookupDetailTrnscType=m and t.active=true and x.active=true and m.active=true and t.authUser.id=:authUserId) order by y.id desc")
    Page<TrnscMaster> customQuery(@Param("authUserId") Long authUserId, Pageable pageable);

    @Query("select y from TrnscMaster y inner join y.lookupDetailTrnscType u where (:trnscTypeId is null or u.id=:trnscTypeId) and (:comSearch is null or lower(y.code||y.description) like lower('%'||:comSearch||'%')) and (:approvalStatus is null or y.approvalStatus=:approvalStatus) " +
            "and u in (select m from LookupDetail m, TrnscUserGroup x inner join x.trnscUserGroupLines t where x.lookupDetailTrnscType=m and t.active=true and x.active=true and m.active=true and t.authUser.id=:authUserId) order by y.id desc")
    Page<TrnscMaster> customQuery(@Param("authUserId") Long usrId, @Param("comSearch") String comSearch, @Param("trnscTypeId")  Long trnscTypeId, @Param("approvalStatus") ApprovalStatus approvalStatus, Pageable pageable);

    @Query("select y from TrnscMaster y inner join y.lookupDetailTrnscType u where (:trnscTypeId is null or u.id=:trnscTypeId) and (:comSearch is null or lower(y.code||y.description) like lower('%'||:comSearch||'%')) and (:approvalStatus is null or y.approvalStatus=:approvalStatus) " +
            //"and u in (select m from LookupDetail m, TrnscUserGroup x inner join x.trnscUserGroupLines t where x.lookupDetailTrnscType=m and t.active=true and x.active=true and m.active=true and t.authUser.id=:authUserId) " +
            "order by y.id desc")
    Page<TrnscMaster> customQuery(@Param("comSearch") String comSearch, @Param("trnscTypeId")  Long trnscTypeId, @Param("approvalStatus") ApprovalStatus approvalStatus, Pageable pageable);

//    @Query("select y from TrnscMaster y inner join y.lookupDetailTrnscType u where (:trnscTypeId is null or u.id=:trnscTypeId) and (:comSearch is null or lower(y.code||y.description) like lower('%'||:comSearch||'%')) and (:approvalStatus is null or y.approvalStatus=:approvalStatus) ")
//    Page<TrnscMaster> customAdmin(@Param("authUserId") Long usrId, @Param("comSearch") String comSearch, @Param("trnscTypeId")  Long trnscTypeId, @Param("approvalStatus") ApprovalStatus approvalStatus, Pageable pageable);


    //  @Query("select m from LookupDetail m, TrnscUserGroup x inner join x.trnscUserGroupLines t where x.lookupDetailTrnscType=m and t.active=true and x.active=true and m.active=true and t.authUser.id=:authUserId")
   // List<LookupDetail> findCustom(@Param("id") Long id, @Param("authUserId") Long authUserId);

    //@Query("select m from AuthUser m where m.code=:code or m.email=:code or m.mobile=:code")
    //public AuthUser findByCodeOrEmailOrMobile(String code);

    //List<AuthUser> findAllByActive(boolean active);

}
