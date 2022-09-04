package org.fdl.approval.api;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.fdl.approval.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;

@RestController
@RequestMapping("/report")
public class ReportApi {

    @Autowired
    private ReportService reportService;

    @RequestMapping("/pdf/{fileName}")
    public void downloadPdfAltFileResource(HttpServletRequest request, HttpServletResponse response, @PathVariable("fileName") String fileName) throws IOException, JRException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", String.format("inline; filename=\"" + fileName + "\".pdf"));
        OutputStream out = response.getOutputStream();
        JasperPrint jasperPrint = reportService.generateAltPdfFile(fileName);
        JasperExportManager.exportReportToPdfStream(jasperPrint, out);
    }
}
