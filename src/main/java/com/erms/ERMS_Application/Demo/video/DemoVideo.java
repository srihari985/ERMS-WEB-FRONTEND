package com.erms.ERMS_Application.Demo.video;
import jakarta.persistence.*;


@Entity
@Table(name = "demo_video")
public class DemoVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // Title of the video

    private  String link;



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }



    public DemoVideo() {
    }

    public DemoVideo(Long id, String title, String link) {
        this.id = id;
        this.title = title;
        this.link = link;
    }
}
