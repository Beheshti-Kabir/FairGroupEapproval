package org.fdl.approval.repo;

import java.util.List;
import org.fdl.approval.model.AuthUser;
import org.fdl.approval.model.LookupDetail;
import org.fdl.approval.model.TrnscMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Manik
 */
@Repository
public interface LookupDetailRepo extends JpaRepository<LookupDetail, Long> {

    @Query("select m from LookupDetail m where m.active=true order by m.code")
    List<LookupDetail> findCustom();

    @Query("select m from LookupDetail m where m.active=true and m.lookupMaster.id=:id order by m.code")
    List<LookupDetail> findCustom(@Param("id") Long id);

    @Query("select m from LookupDetail m, TrnscUserGroup x inner join x.trnscUserGroupLines t where x.lookupDetailTrnscType=m and t.active=true and x.active=true and m.active=true and m.lookupMaster.id=:id and t.authUser.id=:authUserId order by m.code")
    List<LookupDetail> findCustom(@Param("id") Long id, @Param("authUserId") Long authUserId);

    @Query("select d from LookupDetail d inner join d.lookupMaster m where m.active=true and d.active=true and m.code=:parentCode order by m.code")
    List<LookupDetail> findCustomParentCode(@Param("parentCode") String parentCode);

    @Query("select d from LookupDetail d inner join d.lookupMaster m where m.active=true and d.active=true and m.lookupDetailDependent.id=:id order by m.code")
    List<LookupDetail> findCustomParticular(@Param("id") long parentId);



    //@Query("select m from LookupDetail m where m.active=true and m.lookupType=:lookupType and (:parentId is null or m.parentId=:parentId) order by m.code")
    //List<LookupDetail> findCustomNew(@Param("lookupType") String lookupType, @Param("parentId") Long parentId, @Param("authUserId") Long authUserId);

}
