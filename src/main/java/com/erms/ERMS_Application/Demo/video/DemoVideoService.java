package com.erms.ERMS_Application.Demo.video;
import com.erms.ERMS_Application.Authentication.sales.Sales;
import com.erms.ERMS_Application.Authentication.sales.SalesRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemoVideoService {
    @Autowired
    private DemoVideoRepository demoVideoRepository;

    @Autowired
    private SalesRepository salesRepository;


    public DemoVideo saveVideolink(String title, String link) {
        DemoVideo video = new DemoVideo();
        video.setTitle(title);
        video.setLink(link);
        return  demoVideoRepository.save(video);
    }

    public List<DemoVideo> getAllVideos() {
        return demoVideoRepository.findAll();  // Returns all videos in the database
    }
}
