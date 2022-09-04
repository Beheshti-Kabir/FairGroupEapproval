package org.fdl.approval.api;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import org.fdl.approval.service.LookupMasterService;
import org.fdl.approval.dto.LookupMasterDto;
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
@RequestMapping("/api/lookupMasters")
@CrossOrigin(origins = "http://localhost:3000")

public class LookupMasterApi {

    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    //@Autowired
    //private PageModel pageModel;
    @Autowired
    private LookupMasterService lookupMasterService;
    // @Autowired
    // private AuthRoleService authRoleService;

    @GetMapping(value = "/list")
    public ResponseEntity index(HttpServletRequest req) {
        //  pageModel.initPageAndSize();

        String search = "";
        Page<LookupMasterDto> objs;
        if (search.isEmpty()) {
            objs = lookupMasterService.findAll(PageRequest.of(0, 50));

        } else {
            objs = lookupMasterService.findAll(PageRequest.of(0, 50));
        }
        //    ModelAndView modelAndView = new ModelAndView();
        Map mm = new HashMap();
        
        System.out.println("uuuuuuaaauuuuuuuuuu"+objs.getContent());
        mm.put("objs", objs.getContent());
        mm.put("totalItems", objs.getTotalElements());
        mm.put("totalPages", objs.getTotalPages());
        mm.put("currentPage", 1);

        //modelAndView.addObject("search", search);
        //return { totalItems, objs, totalPages, currentPage };
        return new ResponseEntity(mm, HttpStatus.OK);
    }

    @PostMapping(value = "")
    public ResponseEntity save(@RequestBody LookupMasterDto obj) {
        
        lookupMasterService.save(obj);
        System.out.println(obj);
        return new ResponseEntity(obj, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity view(@PathVariable Long id) {
        System.out.println("ppppppppppp" + id);

        LookupMasterDto obj = lookupMasterService.findById(id);
      
        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }

    @DeleteMapping(value = "/{id}")
    public String delete(@PathVariable Long id) {
        lookupMasterService.deleteById(id);
        return "Record Deleted : " + id;
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity update(@PathVariable Long id, @RequestBody LookupMasterDto obj) {

        if (id != null) {
            lookupMasterService.update(id, obj);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(obj);
        }
    }
}
