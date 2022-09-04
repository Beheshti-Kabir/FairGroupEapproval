package org.fdl.approval.repo;

import org.fdl.approval.model.AuthUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
public interface AuthUserRepo extends JpaRepository<AuthUser, Long> {

    @Query("select m from AuthUser m where m.code=:code or m.email=:code or m.mobile=:code")
     AuthUser findByCodeOrEmailOrMobile(@Param("code") String code);

    @Query("select m from AuthUser m where lower(concat(m.code,m.mobile,m.fullName,m.displayName)) like concat('%',:search,'%')")
    Page<AuthUser> customQuery(@Param("search") String search, Pageable pageable);

    @Query("select m from AuthUser m where m.id=:code")
    AuthUser findByCode(@Param("code") Long code);

    //List<AuthUser> findAllByActive(boolean active);

}
