package org.fdl.approval.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.fdl.approval.dto.AccountDto;
import org.fdl.approval.dto.TrnscAttachDto;
import org.fdl.approval.model.Account;
import org.fdl.approval.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Manik
 */
@Service
public class AccountService {

    private Map<String, String> sessionMap = new HashMap();

    @Autowired
    private AccountRepo accountRepo;

    private String refineMobileNo(String mobileNo) {
        String mob = mobileNo.trim();
        mob = mob.replace('+', ' ');
        mob = mob.replaceAll("-", "");
        mob = mob.replaceAll(" ", "");
        return mob;
    }

    public Map<String, Object> init(Map<String, Object> map) {
//    public Map<String,Object> init(String mobileNo, String deviceId) {
        String mob = refineMobileNo((String) map.get("mobileNo"));
        String deviceId = (String) map.get("deviceId");

        if (mob.length() < 10) {
            return getReady("status", "ERROR", "message", "Invalid mobile no");
        }

        Account acc = accountRepo.findByMobileNo(mob);

        if (acc == null) {
            acc = new Account();
            acc.setMobileNo(mob);
            acc.setActive(true);
        }

        int ns = 100000 + (int) (Math.random() * 900000);
        acc.setVerificationCode(ns + "");

        Account saved = accountRepo.save(acc);
        System.out.println("send Code " + ns + " to mobile no: " + mob);
        //System.out.println("Verification Code " + ns + " for mobile no: " + mob);

        return getReady("status", "OK", "message", "Created", 
                "uid", saved.getId(),"isNeedVerify",!saved.isVerified());
    }

    public Map<String, Object> verify(Map<String, Object> map) {
//    public Map<String,Object> verify(String verificationCode, String mobileNo, String deviceId) {

        long uid = Long.parseLong((String) map.get("uid"));
        String verificationCode = (String) map.get("verificationCode");

        if (verificationCode.length() != 6) {
            return getReady("status", "ERROR", "message", "Invalid Verification Code");
        }

        Account acc = accountRepo.findById(uid).get();

        if (acc.getVerificationCode().equals(verificationCode)) {
            acc.setVerified(true);
            Account saved = accountRepo.save(acc);

            return getReady("status", "OK", "message", "Update");

        } else {
            return getReady("status", "ERROR", "message", "Wrong Verification Code");
        }
    }

    public Map<String, Object> updateProfile(AccountDto obj) {

        Account acc = accountRepo.findById(obj.getUid()).get();

        acc.setFirstName(obj.getFirstName());
        acc.setLastName(obj.getLastName());
        acc.setEmail(obj.getEmail());
        acc.setPassword(obj.getPassword());

        Account saved = accountRepo.save(acc);

        return getReady("status", "OK", "message", "Update");
    }

    public Map<String, Object> updateAccountInterest(TrnscAttachDto obj) {

        Account acc = accountRepo.findById(obj.getId()).get();

        Account saved = accountRepo.save(acc);

        return getReady("status", "OK", "message", "Update");
    }

    public Map<String, Object> login(Map<String, Object> map) {
//    public Map<String, Object> login(String loginId, String password) {
        Account acc = accountRepo.findForLogin((String) map.get("loginId"));

        if (acc != null && acc.getPassword().equals((String) map.get("password"))) {
            String token = UUID.randomUUID().toString();

            sessionMap.put(token, acc.getId() + "");

            return getReady("status", "OK", "message", "Successful", "uid", acc.getId(), "email", acc.getEmail(), "token", token);

        } else {
            return getReady("status", "ERROR", "message", "Can not login");
        }
    }

    public Map<String, Object> logout(Map<String, Object> map) {
        String remove = sessionMap.remove(map.get("token"));
        System.out.println("logout: " + remove);
        return getReady("status", "OK", "message", "Logout");
    }

    private Map<String, Object> getReady(Object... arg) {
        Map<String, Object> mapx = new HashMap();
        for (int i = 0; i < arg.length; i += 2) {
            mapx.put((String) arg[i], arg[i + 1]);
        }
        System.out.println("sohwo b4 send" + mapx);
        return mapx;
    }
}
