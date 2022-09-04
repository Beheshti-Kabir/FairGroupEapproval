package org.fdl.approval.repo;

import org.fdl.approval.model.AmeCondi;
import org.fdl.approval.model.AuthUser;
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
public interface AmeCondiRepo extends JpaRepository<AmeCondi, Long> {

    //@Query("select m from AuthUser m where m.code=:code or m.email=:code or m.mobile=:code")
    //public AuthUser findByCodeOrEmailOrMobile(String code);

    @Query("select m from AmeCondi m where lower(m.description) like concat('%',:search,'%')")
    Page<AmeCondi> customQuery(@Param("search") String search, Pageable pageable);

    //List<AuthUser> findAllByActive(boolean active);

}
