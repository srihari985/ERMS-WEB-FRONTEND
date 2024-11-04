package com.erms.ERMS_Application.Demo.IntroPPT;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/ppt")
public class PPTController {

    @Autowired
    private PPTService pptService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPPT(
            @RequestParam String contentName,
            @RequestParam MultipartFile uploadFile) throws IOException {

        // Delegate validation and saving to service layer
        String response = pptService.savePPT(contentName, uploadFile);

        // Check for both success messages
        if (response.equals("File uploaded successfully.") || response.equals("PDF uploaded and compressed successfully.")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }




    @GetMapping("/getAll")
    public List<PPTEntity> getAllPPTs() {
        return pptService.getAllPPTs();
    }

    @GetMapping("getById/{id}")
    public PPTEntity getPPTById(@PathVariable Long id) {
        return pptService.getPPTById(id);
    }

    @DeleteMapping("deleteById/{id}")
    public ResponseEntity<Void> deletePPT(@PathVariable Long id) {
        pptService.deletePPT(id);
        return ResponseEntity.noContent().build();
    }
}
