/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.fdl.approval.repo;

import org.fdl.approval.model.ApprovalAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author User
 */
@Repository
public interface ApprovalActionRepo extends JpaRepository<ApprovalAction, Long> {

    //@Query("select m from ApprovalHistory m where m.mstId=:uid order by m.levelNo")
    //public List<ApprovalHistory> findCustom(Long uid);

}
