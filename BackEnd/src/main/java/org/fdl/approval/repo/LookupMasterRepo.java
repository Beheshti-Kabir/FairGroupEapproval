package org.fdl.approval.repo;

import org.fdl.approval.model.AuthUser;
import org.fdl.approval.model.LookupMaster;
import org.fdl.approval.model.TrnscMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Manik
 */

@Repository
public interface LookupMasterRepo extends JpaRepository<LookupMaster, Long> {

    //@Query("select m from AuthUser m where m.code=:code or m.email=:code or m.mobile=:code")
    //public AuthUser findByCodeOrEmailOrMobile(String code);

    //List<AuthUser> findAllByActive(boolean active);

}
