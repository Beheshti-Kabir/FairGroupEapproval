package org.fdl.approval.api;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.fdl.approval.dto.SelectDto;
import org.fdl.approval.model.ApprovalStatus;
import org.fdl.approval.service.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import org.fdl.approval.service.TrnscMasterService;
import org.fdl.approval.dto.TrnscMasterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Manik
 */
@RestController
@RequestMapping("/api/trnscMasters")
@CrossOrigin(origins = "http://localhost:3000")

public class TrnscMasterApi {

    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private TrnscMasterService trnscMasterService;

    @Autowired
    private ReportService reportService;

    @RequestMapping("/pdf/{id}")
    public void downloadPdfAltFileResource(HttpServletRequest request, HttpServletResponse response,
                                           @PathVariable("id") BigDecimal id) throws IOException, JRException {
        System.out.println("Perinter");
        String fileName="trnsc-master";
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", String.format("inline; filename=\"" + fileName + "\".pdf"));
        OutputStream out = response.getOutputStream();
        Map mpa=new HashMap();
        mpa.put("P_TRNSC_MASTER_ID", id);
        JasperPrint jasperPrint = reportService.generatePdfFileWithParam(fileName, mpa);
        JasperExportManager.exportReportToPdfStream(jasperPrint, out);
    }

    @GetMapping(value = "/list")
    public ResponseEntity index(HttpServletRequest req) {
        //  pageModel.initPageAndSize();
        Long _req_auth_user_id = Long.parseLong(req.getParameter("_req_auth_user_id"));
        int page = Integer.parseInt(req.getParameter("page"));
        int pageSize = Integer.parseInt(req.getParameter("pageSize"));

        String _req_auth_user_type=req.getParameter("_req_auth_user_type");
        String comSearch = req.getParameter("searchTitle");
        ApprovalStatus approvalStatus = req.getParameter("approvalStatus") == null ? null : ApprovalStatus.valueOf(req.getParameter("approvalStatus"));
        Long searchLookupDetailTrnscTypeId = req.getParameter("searchLookupDetailTrnscTypeId") == null ? null : Long.parseLong(req.getParameter("searchLookupDetailTrnscTypeId"));

        //searchLookupDetailTrnscTypeId

        System.out.println("comSearch: " + comSearch + " searchLookupDetailTrnscTypeId: " + searchLookupDetailTrnscTypeId + " appSts: " + approvalStatus + " _req_auth_user_id: " + _req_auth_user_id);

        Page<TrnscMasterDto> objs = trnscMasterService.findAll(_req_auth_user_type,_req_auth_user_id, comSearch, searchLookupDetailTrnscTypeId,
                approvalStatus, PageRequest.of(page, pageSize));

        Map mm = new HashMap();

        mm.put("objs", objs.getContent());
        mm.put("totalItems", objs.getTotalElements());
        mm.put("totalPages", objs.getTotalPages());
        mm.put("currentPage", 1);

        //modelAndView.addObject("search", search);
        //return { totalItems, objs, totalPages, currentPage };
        return new ResponseEntity(mm, HttpStatus.OK);
    }

    @GetMapping(value = "/trnscMasterCodeAll")
    public ResponseEntity trnscMasterAll(HttpServletRequest req) {
        //  pageModel.initPageAndSize();

        String dd = req.getParameter("_req_auth_user_id");
        String manda = req.getParameter("_mandatory");

        //System.out.println("pppppppppppppppppp4545yyyyyy" + dd);
        //_req_auth_user_id

        List<SelectDto> obj = trnscMasterService.findAll();

        if (Boolean.parseBoolean(manda)) {
            obj.add(0, new SelectDto(null, "Select One"));
        }

        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }

    @PostMapping(value = "")
    public ResponseEntity save(@RequestBody TrnscMasterDto obj) {

        trnscMasterService.save(obj);
        System.out.println(obj);
        return new ResponseEntity(obj, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity view(@PathVariable Long id) {
        System.out.println("ppppppppppp" + id);

        TrnscMasterDto obj = trnscMasterService.findById(id);

        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }

    @DeleteMapping(value = "/{id}")
    public String delete(@PathVariable Long id) {
        trnscMasterService.deleteById(id);
        return "Record Deleted : " + id;
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity update(@PathVariable Long id, @RequestBody TrnscMasterDto obj) {

        if (id != null) {
            trnscMasterService.update(id, obj);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(obj);
        }
    }
}