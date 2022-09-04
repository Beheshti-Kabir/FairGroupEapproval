package org.fdl.approval.repo;

import org.fdl.approval.model.AmeCondi;
import org.fdl.approval.model.AmeGroup;
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
public interface AmeGroupRepo extends JpaRepository<AmeGroup, Long> {

    @Query("select m from AmeGroup m where lower(m.description) like concat('%',:search,'%')")
    Page<AmeGroup> customQuery(@Param("search") String search, Pageable pageable);

    //@Query("select m from AuthUser m where m.code=:code or m.email=:code or m.mobile=:code")
    //public AuthUser findByCodeOrEmailOrMobile(String code);

    //List<AuthUser> findAllByActive(boolean active);

}
