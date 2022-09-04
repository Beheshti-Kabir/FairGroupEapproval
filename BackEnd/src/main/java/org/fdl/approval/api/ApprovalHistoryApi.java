package org.fdl.approval.api;

import org.fdl.approval.dto.SelectDto;
import org.fdl.approval.dto.ApprovalHistoryDto;
import org.fdl.approval.model.ApprovalStatus;
import org.fdl.approval.service.ApprovalHistoryService;
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
 * @author Manik
 */
@RestController
@RequestMapping("/api/approvalHistory")
@CrossOrigin(origins = "http://localhost:3000")

public class ApprovalHistoryApi {

    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    //@Autowired
    //private PageModel pageModel;
    @Autowired
    private ApprovalHistoryService approvalHistoryService;
    // @Autowired
    // private AuthRoleService authRoleService;

    @GetMapping(value = "/list")
    public ResponseEntity index(HttpServletRequest req) {
        //  pageModel.initPageAndSize();
        Long _req_auth_user_id = Long.parseLong(req.getParameter("_req_auth_user_id"));
        int page = Integer.parseInt(req.getParameter("page"));
        int pageSize = Integer.parseInt(req.getParameter("pageSize"));

        String comSearch = req.getParameter("searchTitle");
        //String approvalStatus = req.getParameter("searchApprovalStatus");
        String searchLookupDetailTrnscType = req.getParameter("searchLookupDetailTrnscType");

        System.out.println(" req.getParameter() 3421::: "+ req.getParameter("approvalStatus"));

        ApprovalStatus approvalStatus = req.getParameter("searchApprovalStatus") == null ? null : ApprovalStatus.valueOf(req.getParameter("searchApprovalStatus"));
       // Long searchLookupDetailTrnscTypeId = req.getParameter("searchLookupDetailTrnscTypeId") == null ? null : Long.parseLong(req.getParameter("searchLookupDetailTrnscTypeId"));

        //searchLookupDetailTrnscTypeId

        System.out.println("comSearch: " + comSearch + " searchLookupDetailTrnscType: " + searchLookupDetailTrnscType + " approvalStatus: " + approvalStatus + " _req_auth_user_id: " + _req_auth_user_id);
        //_req_auth_user_id

        //   List<SelectDto> obj = lookupDetailService.lookupDetails(1L,Long.parseLong(dd));
        //String search = "";


        Page<ApprovalHistoryDto> objs;
        //  if (comSearch == null || comSearch.isEmpty() || searchLookupDetailTrnscTypeId == null) {
        //    objs = trnscMasterService.findAll(_req_auth_user_id, PageRequest.of(0, 50));

        //} else {
        objs = approvalHistoryService.findAll(_req_auth_user_id, comSearch, searchLookupDetailTrnscType,approvalStatus, PageRequest.of(page, pageSize));
        //}
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




}
