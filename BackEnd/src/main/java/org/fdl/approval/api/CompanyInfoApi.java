package org.fdl.approval.api;

import org.fdl.approval.dto.SelectDto;
import org.fdl.approval.service.CompanyInfoService;
import org.fdl.approval.model.CompanyInfo;
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

/**
 * @author Manik
 */
@RestController
@RequestMapping("/api/companyInfos")
@CrossOrigin(origins = "http://localhost:3000")

public class CompanyInfoApi {

    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    //@Autowired
    //private PageModel pageModel;
    @Autowired
    private CompanyInfoService companyInfoService;
    // @Autowired
    // private AuthRoleService authRoleService;

    @GetMapping(value = "/listActive")

    public ResponseEntity lookupDetailsParticular(HttpServletRequest req) {
        //  pageModel.initPageAndSize();

        String manda = req.getParameter("_mandatory");


        List<SelectDto> objs = companyInfoService.findAllMinDto();


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

        String search = "";
        Page<CompanyInfo> objs;
        if (search != null && !search.isEmpty()) {
            objs = companyInfoService.findAll(PageRequest.of(0, 50));
        } else {
            objs = companyInfoService.findAll(PageRequest.of(0, 50));
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
    public ResponseEntity save(@RequestBody CompanyInfo company) {
        companyInfoService.save(company);
        System.out.println(company);
        return new ResponseEntity(company, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity view(@PathVariable Long id) {

        CompanyInfo company = companyInfoService.findById(id);

        if (company == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(company);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(company);
        }
    }

    @DeleteMapping(value = "/{id}")
    public String delete(@PathVariable Long id) {

        companyInfoService.deleteById(id);
        return "Record Deleted : " + id;
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity update(@PathVariable Long id, @RequestBody CompanyInfo company) {

        if (id != null) {
            companyInfoService.update(id, company);

            return ResponseEntity.status(HttpStatus.ACCEPTED).body(company);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(company);
        }
    }
}