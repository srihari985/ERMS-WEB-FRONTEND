package com.erms.ERMS_Application.Demo.video;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/videos")
public class DemoVideoController {

    @Autowired
    private DemoVideoService demoVideoService;

    @PostMapping("/save/link")
    public ResponseEntity<DemoVideo> uploadVideoLink(@RequestParam String title,@RequestParam String link) {
        try {
            DemoVideo savedVideo = demoVideoService.saveVideolink(title,link);
            return new ResponseEntity<>(savedVideo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<DemoVideo>> getAllVideos() {
        try {
            List<DemoVideo> videos = demoVideoService.getAllVideos();
            if (videos.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Return 204 if no videos found
            }
            return new ResponseEntity<>(videos, HttpStatus.OK); // Return 200 and list of videos
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); // Handle exceptions
        }
    }
}
