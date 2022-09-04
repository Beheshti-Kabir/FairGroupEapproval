package org.fdl.approval.api;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.servlet.http.HttpServletRequest;
import org.fdl.approval.dto.SelectDto;
import org.fdl.approval.service.AuthUserService;
import org.fdl.approval.model.AuthUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Manik
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")

public class AuthApi {

    @Autowired
    private AuthUserService authUserService;

    @GetMapping("/loginx")
    public String loginx() {
        return "kkkk";
    }

    @PostMapping("/login")
//    public String login(@RequestParam(name = "username") String username,
//            @RequestParam(name = "password") String password,
//            @RequestParam(name = "isRem") boolean isRem
//    ) {
    public ResponseEntity<String> login(@RequestBody Map<String, Object> map) {
        //send sms to given mobile no
        // System.out.println("manp: " + username);
        // System.out.println("manp: " + isRem);
        /*        
        var body = {
            username: username,
            password: password,
            isRem: isRem
        };
         */

        String username = (String) map.get("username");
        String password = (String) map.get("password");
        boolean isRem = (Boolean) map.get("isRem");
        // password, isRem } = req.body;

        if (username == null || password == null) {
            //return res.status(400).send();
            return new ResponseEntity("Request missing username or password param", HttpStatus.BAD_REQUEST);

        }

        //authTokens[user.id]=user;
        //res.cookie("accessToken",user.id);
        //req.session.loggedin = true;
        //req.session.accessToken = user.accessToken;
        //req.session.username = user.fullName;
        //req.session.user={aa:'dddddd',image:user.image, displayName:user.displayName, fullName:user.fullName, mobile:user.mobile, username: user.code, uid: user.id, email: user.email};
        AuthUser user = authUserService.findByCodeOrEmailOrMobile(username);
        //let users = await authUserRepository.find({
        ///     where: { code: username }
        //});

        System.out.println(user);

        // we do not need to hash our plain text password
        // before we pass it to bcrypt.compare
        // bcrypt.compare will always return resolved Promise with a boolean value
        // indicating whether the password hashes match
        //const match = await bcrypt.compare(password, user.pwHash);
        boolean match = (password.equals(user.getPassword()));

        if (match) {

            String jjj = "{"
                    + "\"accessToken\": \"" + UUID.randomUUID().toString() + "\", \"email\": \"" + user.getEmail() + "\","
                    + "\"userType\": \"" + user.getUserType() + "\", \"displayName\": \"" + user.getDisplayName() + "\", \"fullName\": \"" + user.getFullName() + "\","
                    + "\"username\": \"" + user.getCode() + "\", \"uid\": \"" + user.getId() + "\""
                    + "}";
            System.out.println(jjj);
            ResponseEntity aaa = new ResponseEntity<String>(jjj, HttpStatus.OK);

            //   res.status(200)
            //     .send();
            return aaa;

        } else {
            //console.error(err);
            // res.status(403).send("Wrong password");

            return new ResponseEntity<String>("Wrong password", HttpStatus.FORBIDDEN);

            //return Promise.reject('wrong username or password');
        }

//  return null;//authUserService.init(map);
        //Map jjj = new HashMap();
    }

    
    @GetMapping(value = "/minimal")
    public ResponseEntity authMin(HttpServletRequest req) {
        //  pageModel.initPageAndSize();

        //String dd = req.getParameter("_req_auth_user_id");

        //_req_auth_user_id       // System.out.println("fffffffffffffffffffffffffffffffff" + dd);


        List<SelectDto> obj = authUserService.findAllMinDto();
        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }

    @PostMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, Object> map) {
        //System.out.println();
        String id = (String) map.get("userId");
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Long _req_auth_user_id = (Long)map.get("userId");
        //String password = (String) map.get("password");
        String currPassword = (String) map.get("currPassword");
        String newPassword = (String) map.get("newPassword");
        System.out.println("newPassword="+newPassword+"currPassword="+currPassword);
        if (id == null || newPassword == null) {
            return new ResponseEntity("Request missing username or password ", HttpStatus.BAD_REQUEST);

        }


        AuthUser user = authUserService.changePassword(id, newPassword);


        String jjj ="ok";
        ResponseEntity aaa = new ResponseEntity<String>(jjj, HttpStatus.OK);

        return aaa;

    }
}
