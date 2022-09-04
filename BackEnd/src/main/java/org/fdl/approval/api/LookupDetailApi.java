package org.fdl.approval.api;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.fdl.approval.dto.SelectDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import org.fdl.approval.service.LookupDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Manik
 */
@RestController
@RequestMapping("/api/lookupDetails")
@CrossOrigin(origins = "http://localhost:3000")

public class LookupDetailApi {

    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    //@Autowired
    //private PageModel pageModel;
    @Autowired
    private LookupDetailService lookupDetailService;
    // @Autowired
    // private AuthRoleService authRoleService;

    @GetMapping(value = "/lookupDetails")
    public ResponseEntity lookupDetails() {

        List<SelectDto> obj = lookupDetailService.lookupDetails();
        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }

    @GetMapping(value = "/lookupDetailsDocType")
    public ResponseEntity lookupDetailsDocType(HttpServletRequest req) {
        //  pageModel.initPageAndSize();

        String dd = req.getParameter("_req_auth_user_id");
        String manda = req.getParameter("_mandatory");

        System.out.println("fffffffffffffffffffffffffffffffff" + dd);
        //_req_auth_user_id

        List<SelectDto> obj = lookupDetailService.lookupDetails(1L, Long.parseLong(dd));
        
        if (Boolean.parseBoolean(manda)) {
            obj.add(0, new SelectDto(null, "Select One"));
        }
        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }

    @GetMapping(value = "/lookupDetailsParentCode")
    public ResponseEntity lookupDetailsParentCode(HttpServletRequest req) {
        //  pageModel.initPageAndSize();

        String dd = req.getParameter("parent_code");
        String manda = req.getParameter("_mandatory");

        System.out.println("fffffffffffffffffffffffffffffffff" + dd);
        //_req_auth_user_id

        List<SelectDto> obj = lookupDetailService.lookupDetailParentCode(dd);

        if (Boolean.parseBoolean(manda)) {
            obj.add(0, new SelectDto(null, "Select One"));
        }
        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }

    @GetMapping(value = "/lookupDetailsParticular")
    public ResponseEntity lookupDetailsParticular(HttpServletRequest req) {
        //  pageModel.initPageAndSize();

        String manda = req.getParameter("_mandatory");
        String parent_id = req.getParameter("parent_id");

        List<SelectDto> obj = lookupDetailService.lookupDetailParticular(Long.parseLong(parent_id));
//        List<SelectDto> obj = lookupDetailService.lookupDetails(2L, parent_id);

        if (Boolean.parseBoolean(manda)) {
            obj.add(0, new SelectDto(null, "Select One"));
        }

        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }

}
