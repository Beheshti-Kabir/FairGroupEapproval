package org.fdl.approval.repo;

import org.fdl.approval.model.TrnscUserGroupLine;
import org.fdl.approval.model.TrnscDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Manik
 */

@Repository
public interface TrnscUserGroupLineRepo extends JpaRepository<TrnscUserGroupLine, Long> {

    //@Query("select m from AuthUser m where m.code=:code or m.email=:code or m.mobile=:code")
    //public AuthUser findByCodeOrEmailOrMobile(String code);

    //List<AuthUser> findAllByActive(boolean active);

}
