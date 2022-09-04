package org.fdl.approval.api;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;
import org.fdl.approval.model.TrnscAttach;
import org.fdl.approval.repo.TrnscAttachRepo;
import org.fdl.approval.repo.TrnscMasterRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author Manik
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminApi {

    String UPLOAD_FILES_DIR = "approval_upload/files";
    //  String UPLOAD_FILES_DIR = "D:\\approval_upload\\files";

    @Autowired
    private TrnscMasterRepo trnscMasterRepo;

    @Autowired
    private TrnscAttachRepo trnscAttachRepo;

    //   @PostMapping("/uploadfile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @RequestMapping(value = "/uploadfile", method = RequestMethod.POST,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> login(@RequestParam(name = "id") Long id,
                                        @RequestParam(name = "customFileName") String customFileName,
                                        @RequestParam("myFile") MultipartFile file
    ) {

        String extension = Optional.of(file.getOriginalFilename())
                .filter(f -> f.contains("."))
                .map(f -> f.substring(file.getOriginalFilename().lastIndexOf(".") + 1))
                .orElse("");

        String uid = UUID.randomUUID().toString() + "." + extension;
        String name = customFileName.isEmpty() ? file.getOriginalFilename() : customFileName;

        TrnscAttach aaa = new TrnscAttach();
        aaa.setTrnscMaster(trnscMasterRepo.getById(id));
        aaa.setCode(uid);
        aaa.setName(name);
        aaa.setContentType(file.getContentType());
        aaa.setFileSize(file.getSize());

        aaa.setActive(true);
        // trnsc_master_id: req.body.id,
        // code: req.file.filename.split('/').pop(),

        //  name: req.body.customFileName ? req.body.customFileName.trim() : req.file.originalname,
        //  content_type: req.file.mimetype,
        //  file_size: req.file.size,
        trnscAttachRepo.save(aaa);

        try {
            File convertFile = new File(UPLOAD_FILES_DIR + File.separator + "transAttach" + File.separator + uid);

            try {
                convertFile.getParentFile().mkdirs();
            } catch (Exception xcx) {
                System.err.println("err 7554: " + xcx);
            }

            convertFile.createNewFile();
            FileOutputStream fout = new FileOutputStream(convertFile);
            fout.write(file.getBytes());
            fout.close();
        } catch (Exception er) {
            System.out.println("file upload  errr" + er);
        }

        return new ResponseEntity<String>("Created ", HttpStatus.CREATED);
    }


    @RequestMapping(value = "/files/{m}/{i}", method = RequestMethod.GET)
    public ResponseEntity downloadFile(@PathVariable("m") String m, @PathVariable("i") String i) throws Exception {

        String filename = UPLOAD_FILES_DIR + File.separator + m + File.separator + i;

        Path sd = Paths.get(filename);

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

        try {
            mediaType = MediaType.parseMediaType(Files.probeContentType(sd));
        } catch (Exception xc) {
            System.out.println("err 2951: " + xc);
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + i + "\"")
                .body(new UrlResource(sd.toUri()));
    }

    @RequestMapping(value = "/uimg/{i}", method = RequestMethod.GET,
            produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public ResponseEntity<byte[]> downloadFile(@PathVariable("i") String i) throws IOException {

        String filename = UPLOAD_FILES_DIR + File.separator + "uimg" + File.separator + i + ".jpg";

        try {
            new File(filename).getParentFile().mkdirs();
        } catch (Exception xcx) {
            System.err.println("err 7154: " + xcx);
        }

        byte[] media = Files.readAllBytes(Paths.get(filename));
        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl(CacheControl.noCache().getHeaderValue());

        ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(media, headers, HttpStatus.OK);
        return responseEntity;
    }
}