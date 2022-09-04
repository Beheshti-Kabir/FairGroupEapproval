package org.fdl.approval.service;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.fdl.approval.dto.StatementDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import javax.servlet.ServletContext;
import javax.sql.DataSource;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

//    @Autowired
//    private ServletContext context;

    private static final Logger LOGGER = LoggerFactory.getLogger(ReportService.class);

    @Autowired
    private DataSource dataSource;

    private static final String PDF_REPORT_PATH = "report/";

//    @Autowired
//    private ResourceLoader resourceLoader;

    public JasperPrint generatePdfFileWithParam(String fileName, Map<String, Object> parameters) throws JRException, IOException {
        String path = new File(PDF_REPORT_PATH + fileName + ".jrxml").getPath();
        System.out.println(path);
        JasperReport jasperReport = JasperCompileManager.compileReport(path);

        LOGGER.info("generatePdfFileWithParam fn: " + fileName + " param: " + parameters);
        Connection conn = null;
        try {
            conn = dataSource.getConnection();
            LOGGER.info("conn ok", conn);
        } catch (Exception er) {
            LOGGER.error("generatePdfFileWithParam err db conn", er);
            //System.out.println("err conn db: " + er);
        }

        JasperPrint print = JasperFillManager.fillReport(jasperReport, parameters, conn);
        return print;
    }


    public JasperPrint generateAltPdfFile(String fileName) throws JRException, IOException {
        String path = new File(PDF_REPORT_PATH + fileName + ".jrxml").getPath();
        System.out.println(path);
        JasperReport jasperReport = JasperCompileManager.compileReport(path);
        Map<String, Object> parameters = new HashMap();
        parameters.put("branchName", "Principle Branch");
        JasperPrint print = JasperFillManager.fillReport(jasperReport, parameters, new JRBeanCollectionDataSource(getData()));
        return print;
    }

    List<StatementDto> getData() {
        List<StatementDto> transactions = new ArrayList();
        transactions.add(
                StatementDto.builder().
                        transactionDate("01-03-2020")
                        .deposit(new BigDecimal(500.00))
                        .withdrawal(new BigDecimal(0.00))
                        .build()
        );
        return transactions;
    }
}