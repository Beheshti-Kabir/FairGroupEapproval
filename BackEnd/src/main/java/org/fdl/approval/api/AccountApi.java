package org.fdl.approval.api;

import java.util.Map;
import org.fdl.approval.dto.AccountDto;
import org.fdl.approval.dto.TrnscAttachDto;
import org.fdl.approval.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Manik
 */
@RestController
@RequestMapping("/api/account")
public class AccountApi {

    @Autowired
    private AccountService accountService;

    @PostMapping("/init")
    public Map<String, Object> init(@RequestBody Map<String, Object> map) {
        //send sms to given mobile no
        return accountService.init(map);
    }

    @PostMapping("/verify")
    public Map<String, Object> verify(@RequestBody Map<String, Object> map) {
        //get verificationCode and match if match OK,
        return accountService.verify(map);
    }

    @PostMapping("/updateProfile")
    public Map<String, Object> updateProfile(@RequestBody AccountDto obj) {
        return accountService.updateProfile(obj);
    }

    @PostMapping("/updateAccountInterest")
    public Map<String, Object> updateAccountInterest(@RequestBody TrnscAttachDto obj) {
        return accountService.updateAccountInterest(obj);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, Object> map) {
        //loginId is mobile no or email
        System.out.println("login: " + map);
        return accountService.login(map);
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(@RequestBody Map<String, Object> map) {

        System.out.println("logout: " + map);
        //loginId is mobile no or email
        return accountService.logout(map);
    }

//    @PutMapping("/updateProfile")
//    public ResponseDto updateProfile(@RequestBody AccountDto obj) {
//        return accountService.updateProfile(obj);
//    }
}
