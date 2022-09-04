package org.fdl.approval.api;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import org.fdl.approval.service.AuthUserService;
import org.fdl.approval.model.AuthUser;
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
@RequestMapping("/api/authUsers")
@CrossOrigin(origins = "http://localhost:3000")

public class AuthUserApi {

    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    //@Autowired
    //private PageModel pageModel;
    @Autowired
    private AuthUserService authUserService;
    // @Autowired
    // private AuthRoleService authRoleService;

    @GetMapping(value = "/list")
    public ResponseEntity index(HttpServletRequest req) {
        //  pageModel.initPageAndSize();
       // Long _req_auth_user_id = Long.parseLong(req.getParameter("_req_auth_user_id"));
        int page = Integer.parseInt(req.getParameter("page"));
        int pageSize = Integer.parseInt(req.getParameter("pageSize"));
        String search = req.getParameter("searchTitle");

        Page<AuthUser> objs;
        if (search == null || search.isEmpty()) {
            objs = authUserService.findAll(PageRequest.of(page, pageSize));
        } else {
            objs = authUserService.findAll(search,PageRequest.of(page, pageSize));
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
    public ResponseEntity save(@RequestBody AuthUser employee) {
        authUserService.save(employee);
        System.out.println(employee);
        return new ResponseEntity(employee, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity view(@PathVariable Long id) {

        AuthUser employee = authUserService.findById(id);

        if (employee == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(employee);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(employee);
        }
    }

    @DeleteMapping(value = "/{id}")
    public String delete(@PathVariable Long id) {

        authUserService.deleteById(id);
        return "Record Deleted : " + id;

    }

    @PutMapping(value = "/{id}")
    public ResponseEntity update(@PathVariable Long id, @RequestBody AuthUser employee) {

        if (id != null) {
            authUserService.update(id, employee);

            return ResponseEntity.status(HttpStatus.ACCEPTED).body(employee);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(employee);
        }
    }

}
