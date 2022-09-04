package org.fdl.approval.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

import org.fdl.approval.dto.AmeCondiDto;
import org.fdl.approval.dto.AprvUserGroupDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import org.fdl.approval.service.LookupMasterService;
import org.fdl.approval.dto.LookupMasterDto;
import org.fdl.approval.dto.SelectDto;
import org.fdl.approval.service.AprvUserGroupService;
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
@RequestMapping("/api/aprvUserGroups")
@CrossOrigin(origins = "http://localhost:3000")

public class AprvUserGroupApi {

    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    //@Autowired
    //private PageModel pageModel;
    @Autowired
    private AprvUserGroupService aprvUserGroupService;
    // @Autowired
    // private AuthRoleService authRoleService;

      @GetMapping(value = "/minimal")
    public ResponseEntity authMin(HttpServletRequest req) {

        List<SelectDto> obj = aprvUserGroupService.findAllMinDto();
        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }



    @GetMapping(value = "/listActive")

    public ResponseEntity lookupDetailsParticular(HttpServletRequest req) {
        //  pageModel.initPageAndSize();

        String manda = req.getParameter("_mandatory");


        List<SelectDto> objs = aprvUserGroupService.findAllMinDto();


        if (Boolean.parseBoolean(manda)) {
            objs.add(0, new SelectDto(null, "Select One"));
        }

        if (objs == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(objs);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(objs);
        }
    }


    @GetMapping(value = "/list")
    public ResponseEntity index(HttpServletRequest req) {
        //  pageModel.initPageAndSize();
        // Long _req_auth_user_id = Long.parseLong(req.getParameter("_req_auth_user_id"));
        int page = Integer.parseInt(req.getParameter("page"));
        int pageSize = Integer.parseInt(req.getParameter("pageSize"));
        String search = req.getParameter("searchTitle");

        System.out.println(search);
        Page<AprvUserGroupDto> objs;
        if (search == null || search.isEmpty()) {
            objs = aprvUserGroupService.findAll(PageRequest.of(page, pageSize));
        } else {
            objs = aprvUserGroupService.findAll(search,PageRequest.of(page, pageSize));
        }
        //    ModelAndView modelAndView = new ModelAndView();
        Map mm = new HashMap();
        mm.put("objs", objs.getContent());
        mm.put("totalItems", objs.getTotalElements());
        mm.put("totalPages", objs.getTotalPages());
        mm.put("currentPage", 1);

        //modelAndView.addObject("search", search);
        //return { totalItems, objs, totalPages, currentPage };
        return new ResponseEntity(mm, HttpStatus.OK);
    }

    @PostMapping(value = "")
    public ResponseEntity save(@RequestBody AprvUserGroupDto obj) {
        
        aprvUserGroupService.save(obj);
        System.out.println(obj);
        return new ResponseEntity(obj, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity view(@PathVariable Long id) {
        System.out.println("ppppppppppp" + id);

        AprvUserGroupDto obj = aprvUserGroupService.findById(id);
      
        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }

    @DeleteMapping(value = "/{id}")
    public String delete(@PathVariable Long id) {
        aprvUserGroupService.deleteById(id);
        return "Record Deleted : " + id;
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity update(@PathVariable Long id, @RequestBody AprvUserGroupDto obj) {

        if (id != null) {
            aprvUserGroupService.update(id, obj);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(obj);
        }
    }
}
