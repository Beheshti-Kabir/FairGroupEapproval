package org.fdl.approval.api;

import org.fdl.approval.dto.SelectDto;
import org.fdl.approval.model.ApprovalQueue;
import org.fdl.approval.model.ApprovalStatus;
import org.fdl.approval.repo.ApprovalQueueRepo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fdl.approval.model.ApprovalAction;
import org.fdl.approval.repo.ApprovalActionRepo;
import org.fdl.approval.repo.ApprovalHistoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Manik
 */
@RestController
@RequestMapping("/api/approval")
@CrossOrigin(origins = "http://localhost:3000")

//router.get("/:id", objService.getHistoryList);
//
//router.post("/", objService.submit);
//
//router.post("/queueSum", objService.queueSum);
//
//router.post("/queue", objService.queue);
public class ApprovalApi {

    @Autowired
    private ApprovalHistoryRepo approvalHistoryRepo;

    @Autowired
    private ApprovalQueueRepo approvalQueueRepo;

    @Autowired
    private ApprovalActionRepo approvalActionRepo;

    @Autowired
    private JavaMailSender javaMailSender;

    @GetMapping(value = "/approvalStatusList")
    public ResponseEntity approvalStatusList(HttpServletRequest req) {
        //  pageModel.initPageAndSize();

        List<Map<String, String>> obj = new ArrayList<>();

        for (ApprovalStatus aa : ApprovalStatus.values()) {
            Map<String, String> map = new HashMap<>();
            map.put("value", aa.name());
            map.put("label", aa.name().replace('_', ' '));

            obj.add(map);
        }
        String manda = req.getParameter("_mandatory");

        if (Boolean.parseBoolean(manda)) {

            Map<String, String> map = new HashMap<>();
            map.put("value", null);
            map.put("label", "Select One");

            obj.add(0,map);


//            obj.add(0, new S/electDto(null, "Select One"));
        }

        if (obj == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(obj);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(obj);
        }
    }

    @GetMapping(value = "/{i}")
    public ResponseEntity getHistoryList(@PathVariable("i") Long m) {

        if (m == null) {
            return new ResponseEntity("Mst ID missing", HttpStatus.BAD_REQUEST);
        }

        List jjj = approvalHistoryRepo.findCustom(m);

        System.out.println(jjj);
        ResponseEntity aaa = new ResponseEntity<List>(jjj, HttpStatus.OK);
        return aaa;
    }

    @PostMapping("/queueSum")
    public ResponseEntity queueSum(@RequestBody Map<String, Object> map) {

        System.out.println("queueSumqueueSumqueueSum hit" + map);

        if (map.get("uid") == null) {
            //return res.status(400).send();
            return new ResponseEntity("UID missing", HttpStatus.BAD_REQUEST);

        }

        Long uid = Long.parseLong(map.get("uid") + "");

        List jjj = approvalQueueRepo.findSummary(uid);

        System.out.println(jjj);
        ResponseEntity aaa = new ResponseEntity<List>(jjj, HttpStatus.OK);

        return aaa;
    }

    @PostMapping("/queue")
    public ResponseEntity queue(@RequestBody Map<String, Object> map) {

        System.out.println("queueSumqueueSumqueueSum hit" + map);

        if (map.get("uid") == null) {
            //return res.status(400).send();
            return new ResponseEntity("UID missing", HttpStatus.BAD_REQUEST);

        }

        Long uid = Long.parseLong(map.get("uid") + "");
        String docType = (String) map.get("docType");

        List jjj = approvalQueueRepo.findDetail(uid, docType);

        System.out.println(jjj);
        ResponseEntity aaa = new ResponseEntity<List>(jjj, HttpStatus.OK);

        return aaa;
    }

    @PostMapping("")
    public ResponseEntity submit(@RequestBody Map<String, Object> map) {

        System.out.println("action submit hit" + map);
//action submit hit{uid=5, mst_id=2, auth_user_forward_to_id=null, remarks=, cmd=SUBMIT, document_root=trnsc_master, url_root=trnscMasterForm}

        if (map.get("uid") == null || map.get("mst_id") == null || map.get("cmd") == null || map.get("document_root") == null) {
            return new ResponseEntity("UID || CMD ||mstID||document_root missing", HttpStatus.BAD_REQUEST);
        }

        ApprovalAction kp = new ApprovalAction();

        kp.setAuthUserId(Long.parseLong(map.get("uid") + ""));
        kp.setMstId(Long.parseLong(map.get("mst_id") + ""));
        kp.setCmd((String) map.get("cmd"));
        kp.setRemarks((String) map.get("remarks"));
        kp.setDocumentRoot((String) map.get("document_root"));
        kp.setUrlRoot((String) map.get("url_root"));
        kp.setAuthUserForwardToId(map.get("auth_user_forward_to_id") != null ? Long.parseLong(map.get("auth_user_forward_to_id") + "") : null);
        //kp.setMstId(uid);

        approvalActionRepo.save(kp);

        Thread th=new Thread(){
            public void run (){
                sendEmail(kp.getMstId(), kp.getDocumentRoot());
            }
        };
        th.start();


        ResponseEntity aaa = new ResponseEntity<String>("saved", HttpStatus.OK);

        return aaa;
    }

    private void sendEmail(Long mstId, String docType) {

        List<ApprovalQueue> approvalQueues= approvalQueueRepo.findAllByMstIdAndDocType(mstId,  docType);

        System.out.println("list to mail "+approvalQueues);

        for (ApprovalQueue aa:approvalQueues) {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom("approval@fairgroupbd.com");
            msg.setTo(aa.getUserEmail());

            msg.setSubject(aa.getDescription());
            msg.setText("You are requested to review an approval note, please login system and send your feedback." +
                    "http://localhost:3000" + aa.getUrl());

            javaMailSender.send(msg);
            System.out.println("compa mailx");
        }

        System.out.println("all done mail");
    }
//3 val to show approval palne

    @PostMapping("/isShowApprovalPanel")
    public ResponseEntity isShowApprovalPanel(@RequestBody Map<String, Object> map) {

        System.out.println("isShowApprovalPanel hit" + map);

        if (map.get("uid") == null || map.get("mstId") == null || map.get("tableName") == null) {
            //return res.status(400).send();
            return new ResponseEntity("UID missing", HttpStatus.BAD_REQUEST);

        }

        Long uid = Long.parseLong(map.get("uid") + "");
        Long mstId = Long.parseLong(map.get("mstId") + "");
        String tabName = map.get("tableName") + "";

        Integer jjj = approvalQueueRepo.findIsShowApprovalPanel(uid, mstId, tabName);

        System.out.println(jjj);
        ResponseEntity aaa = new ResponseEntity(jjj, HttpStatus.OK);

        return aaa;
    }

}
