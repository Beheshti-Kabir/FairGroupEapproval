/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.fdl.approval.repo;

import java.util.List;
import org.fdl.approval.dto.ApprovalQueueSumDto;
import org.fdl.approval.model.ApprovalQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 *
 * @author User
 */
@Repository
public interface ApprovalQueueRepo extends JpaRepository<ApprovalQueue, Long> {

    @Query("select new org.fdl.approval.dto.ApprovalQueueSumDto(m.docType, count(m)) from ApprovalQueue m where m.authUser.id=:uid group by m.docType order by m.docType")
    public List<ApprovalQueueSumDto> findSummary(@Param("uid") Long uid);

    @Query("select m from ApprovalQueue m where m.authUser.id=:uid and m.docType=:docType order by m.docType")
    public List<ApprovalQueue> findDetail(@Param("uid") Long uid, @Param("docType") String docType);

    @Query("select count(m) from ApprovalQueue m where m.authUser.id=:uid and m.mstId=:mstId and lower(m.tableName)=lower(:tableName)")
    public Integer findIsShowApprovalPanel(@Param("uid") Long uid, @Param("mstId") Long mstId, @Param("tableName") String tabName);

    List<ApprovalQueue> findAllByMstId(long id);

    @Query("select m from ApprovalQueue m where m.mstId=:mstId and m.tableName=:tableName order by m.userEmail")
    public List<ApprovalQueue> findAllByMstIdAndDocType(@Param("mstId") Long mstId, @Param("tableName") String tableName);
}
