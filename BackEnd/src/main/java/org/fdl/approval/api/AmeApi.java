package org.fdl.approval.api;

import org.fdl.approval.dto.AmeDto;
import org.fdl.approval.service.AmeService;
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
import java.util.Map;

/**
 *
 * @author Manik
 */
@RestController
@RequestMapping("/api/ames")
@CrossOrigin(origins = "http://localhost:3000")

public class AmeApi {

    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    //@Autowired
    //private PageModel pageModel;
    @Autowired
    private AmeService ameService;
    // @Autowired
    // private AuthRoleService authRoleService;

    @GetMapping(value = "/list")
    public ResponseEntity index(HttpServletRequest req) {
        //  pageModel.initPageAndSize();

        int page = Integer.parseInt(req.getParameter("page"));
        int pageSize = Integer.parseInt(req.getParameter("pageSize"));

        String search = "";
        Page<AmeDto> objs;
        if (search.isEmpty()) {
            objs = ameService.findAll(PageRequest.of(page, pageSize));

        } else {
            objs = ameService.findAll(PageRequest.of(page, pageSize));
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
    public ResponseEntity save(@RequestBody AmeDto obj) {
        
        ameService.save(obj);
        System.out.println(obj);
        return new ResponseEntity(obj, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity view(@PathVariable Long id) {
        System.out.println("ppppppppppp" + id);

        AmeDto obj = ameService.findById(id);
      
        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }

    @DeleteMapping(value = "/{id}")
    public String delete(@PathVariable Long id) {
        ameService.deleteById(id);
        return "Record Deleted : " + id;
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity update(@PathVariable Long id, @RequestBody AmeDto obj) {

        if (id != null) {
            ameService.update(id, obj);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(obj);
        }
    }
}
