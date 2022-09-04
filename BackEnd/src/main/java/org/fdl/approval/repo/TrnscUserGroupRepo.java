package org.fdl.approval.repo;


import org.fdl.approval.model.TrnscUserGroup;
import org.fdl.approval.model.LookupDetail;
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
public interface TrnscUserGroupRepo extends JpaRepository<TrnscUserGroup, Long> {

    //@Query("select m from AuthUser m where m.code=:code or m.email=:code or m.mobile=:code")
    //public AuthUser findByCodeOrEmailOrMobile(String code);

    @Query("select m from TrnscUserGroup m , LookupDetail d where " +
            "m.lookupDetailTrnscType.id=d.id and lower(d.code) like concat('%',:search,'%')")
    Page<TrnscUserGroup> customQuery(@Param("search") String search, Pageable pageable);
    //List<AuthUser> findAllByActive(boolean active);

}
