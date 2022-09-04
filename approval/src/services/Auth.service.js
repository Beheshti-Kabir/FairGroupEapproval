import axios from "axios";
import CookieService from "./cookie.service";

//const API_URL = "http://192.168.31.66:4001";
const API_URL = "http://10.100.10.27:4001/approval_api/";
//const API_URL = "http://localhost:4001/";

const http = axios.create({
    baseURL: API_URL + "api/auth",
    headers: {
        "Content-type": "application/json"
    }
});

//const ACCESS_TOKEN = "access_token";
//const CURR_USER = "user";
const EXPIRE_AT = 10 * 60;//minutes

class AuthService {

    getAllMinimal() {
        return http.get("/minimal");
    }

    changePassword(currPassword, newPassword) {
        return http.post("/changePassword", {
            currPassword: currPassword,
            newPassword: newPassword
        });
    }

    forgotPassword(code, dob) {
        return http.post("/forgotPassword", {
            code: code,
            dob: dob
        });
    }

    register(displayName, username, fullName, mobile, email, password) {
        return http.post("/register", {
            displayName: displayName,
            username: username,
            fullName: fullName,
            mobile: mobile,
            email: email,
            password: password
        });
    }

    login(username, password, isRem) {
        
        var body = {
            username: username,
            password: password,
            isRem: isRem
        };
//alert(body);
        return http.post("/login", body);
    }


    /*
     if (res.data.accessToken) {
     
     var options;
     if (!isRem) {
     options = {path: '/'};
     } else {
     let date = new Date();
     date.setTime(date.getTime() + EXPIRE_AT * 60 * 1000);
     options = {path: '/', expires: date};
     }
     CookieService.set(ACCESS_TOKEN, res.data.accessToken, options);
     CookieService.set(CURR_USER, {uid: res.data.uid, displayName: res.data.displayName}, options);
     
     return res.data;
     }
     //return res.data;
     
     */
    getAccessToken() {

        var map = CookieService.get("gbl");
//        var map = CookieService.get("user");
        //JSON.stringify(map);
        //alert(JSON.stringify(map));
        return map !== undefined ? map.access_token : null;

        //   return CookieService.get("gbl").;
//        return CookieService.get("access_token");
    }

    logout = async () => {
        await CookieService.remove("gbl");
        // await CookieService.remove("access_token");
        // await CookieService.remove("user");
        //alert("mucha done");
        //sessionStorage.removeItem("user");
        //const url = API_URL + 'logout';
        /*
         return http.post('/logout', {
         credentials: 'include'
         });*/
    }

    isAuth() {
       // alert("aaaaaaaaaa"+JSON.stringify(CookieService.get("gbl")));
        return  CookieService.get("gbl") && CookieService.get("gbl")!==undefined  ? true : false;
//        return CookieService.get("access_token") ? true : false;
    }

    getUid() {
        var map = CookieService.get("gbl");
//        var map = CookieService.get("user");
        //JSON.stringify(map);
        //alert(JSON.stringify(map));
        return map !== undefined ? map.user.uid : null;
    }

    getDisplayName() {
        var map = CookieService.get("gbl");
//        var map = CookieService.get("user");
//        alert(map);
        return map !== undefined ? map.user.displayName : null;
    }

        getUserType() {
            var map = CookieService.get("gbl");
    //        var map = CookieService.get("user");
    //        alert(map);
            return map !== undefined ? map.user.userType : null;
        }
}

export default new AuthService();