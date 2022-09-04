package org.fdl.approval.service;

import java.util.ArrayList;

import org.fdl.approval.dto.TrnscMasterDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import org.fdl.approval.dto.SelectDto;
import org.fdl.approval.model.AuthUser;
import org.fdl.approval.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Manik
 */
@Service
public class AuthUserService {

    @Autowired
    private AuthUserRepo authUserRepo;

//    @Autowired
//    private UtilityService utilityService;
//    @Autowired
//    private PasswordEncoder passwordEncoder;
    public AuthUser findById(Long id) {
        return authUserRepo.findById(id).get();
    }

    public List<AuthUser> findAll() {
        return authUserRepo.findAll();
    }

    public Page<AuthUser> findAll(Pageable pageable) {
        return authUserRepo.findAll(pageable);
    }

    /*
    public Page<AuthUser> findAll(Specification<AuthUser> specification, Pageable pageable) {
        return authUserRepo.findAll(specification,pageable);
    }

    /*
    public void register(AuthUserDto authUserDto) {
        AuthUser authUserExists = authUserRepo.findByCodeOrEmail(authUserDto.getCode(), authUserDto.getEmail());

        if (authUserExists != null)
            throw new UserAlreadyExistsException();
        else {
            AuthUser authUser = new AuthUser();
            authUser.setCode(authUserDto.getCode());
            authUser.setName(authUserDto.getName());
            authUser.setDisplayName(authUserDto.getDisplayName());
            authUser.setEmail(authUserDto.getEmail());
            authUser.setGender(authUserDto.getGender());
            //Auditor auditor = new Auditor();
            //au/ditor.setInsertBy(authUserRepo.getOne(Long.ONE));
            //auditor.setInsertDate(LocalDateTime.now());
            //authUser.setAuditor(auditor);

            authUser.setActive(Boolean.TRUE);
            authUser.setAccountExpired(Boolean.FALSE);
            authUser.setAccountLocked(Boolean.FALSE);
            authUser.setCredentialsExpired(Boolean.FALSE);

            authUser.setPasswordHash(authUserDto.getPassword());
            //authUser.setPassword(passwordEncoder.encode(authUserDto.getPassword()));

            //AuthRole userRole = authRoleRepo.findByCode("USER");
            //authUser.setAuthRoles(new HashSet<>(Arrays.asList(userRole)));

            authUserRepo.save(authUser);
        }
    }
     */
 /* public void changePassword(ChangePasswordDto authUserDto) {

        AuthUser authUser = utilityService.getCurrentUser();

        authUser.setPasswordHash(authUserDto.getPassword());
        authUser.setPassword(passwordEncoder.encode(authUserDto.getPassword()));
        authUserRepo.save(authUser);
    }*/
    public void save(AuthUser obj) {
        authUserRepo.save(obj);
    }

    public void delete(AuthUser obj) {
        authUserRepo.delete(obj);
    }

    public AuthUser findByCodeOrEmailOrMobile(String code) {
        return authUserRepo.findByCodeOrEmailOrMobile(code);
    }

    public void deleteById(Long id) {
        authUserRepo.deleteById(id);
    }

    public void update(Long id, AuthUser obj) {
        AuthUser xx = authUserRepo.findById(id).get();
        xx.setCode(obj.getCode());
        xx.setFullName(obj.getFullName());
        xx.setUserType(obj.getUserType());
        xx.setDisplayName(obj.getDisplayName());
        xx.setEmail(obj.getEmail());
        xx.setMobile(obj.getMobile());
        xx.setPassword(obj.getPassword());
        xx.setActive(obj.isActive());
        authUserRepo.save(xx);

    }

    public AuthUser changePassword(String code,String pass){
        AuthUser    authUser=authUserRepo.findByCode(Long.parseLong(code));
        authUser.setPassword(pass);
        authUserRepo.save(authUser);
        return authUser;
    }

    public List<SelectDto> findAllMinDto() {
        List<SelectDto> pp = new ArrayList();
        for (AuthUser aa : authUserRepo.findAll()) {

            SelectDto qq = new SelectDto();
            qq.setValue(aa.getId());
            qq.setLabel(aa.getFullName());
            pp.add(qq);
        }
        return pp;
    }

    public Page<AuthUser> findAll(String search, Pageable pageable) {
        return authUserRepo.customQuery(search.toLowerCase(),  pageable);
    }
}
