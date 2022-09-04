package org.fdl.approval.repo;

import org.fdl.approval.model.CompanyInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @author Manik
 */

@Repository
public interface CompanyInfoRepo extends JpaRepository<CompanyInfo, Long> {

    @Query("select m from CompanyInfo m where m.companyName=:code or m.code=:code")
    public CompanyInfo findByCodeOrName(@Param("code") String code);

    List<CompanyInfo> findAllByActiveTrue();

    //List<AuthUser> findAllByActive(boolean active);

}
