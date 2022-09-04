package org.fdl.approval.api;

import org.fdl.approval.dto.AmeCondiDto;
import org.fdl.approval.dto.AmeGroupDto;
import org.fdl.approval.service.AmeGroupService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.fdl.approval.dto.SelectDto;

/**
 *
 * @author Manik
 */
@RestController
@RequestMapping("/api/ameGroups")
@CrossOrigin(origins = "http://localhost:3000")

public class AmeGroupApi {

    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    //@Autowired
    //private PageModel pageModel;
    @Autowired
    private AmeGroupService ameGroupService;
    // @Autowired
    // private AuthRoleService authRoleService;

    @GetMapping(value = "/minimal")
    public ResponseEntity authMin(HttpServletRequest req) {
        //  pageModel.initPageAndSize();

        //String dd = req.getParameter("_req_auth_user_id");
        // System.out.println("fffffffffffffffffffffffffffffffff" + dd);
        //_req_auth_user_id
        List<SelectDto> obj = ameGroupService.findAllMinDto();
        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
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
        Page<AmeGroupDto> objs;
        if (search == null || search.isEmpty()) {
            objs = ameGroupService.findAll(PageRequest.of(page, pageSize));
        } else {
            objs = ameGroupService.findAll(search,PageRequest.of(page, pageSize));
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
    public ResponseEntity save(@RequestBody AmeGroupDto obj) {

        ameGroupService.save(obj);
        System.out.println(obj);
        return new ResponseEntity(obj, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity view(@PathVariable Long id) {
        System.out.println("ppppppppppp" + id);

        AmeGroupDto obj = ameGroupService.findById(id);

        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }

    @DeleteMapping(value = "/{id}")
    public String delete(@PathVariable Long id) {
        ameGroupService.deleteById(id);
        return "Record Deleted : " + id;
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity update(@PathVariable Long id, @RequestBody AmeGroupDto obj) {

        if (id != null) {
            ameGroupService.update(id, obj);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(obj);
        }
    }
}
