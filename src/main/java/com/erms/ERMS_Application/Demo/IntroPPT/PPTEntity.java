package com.erms.ERMS_Application.Demo.IntroPPT;

import jakarta.persistence.*;


@Entity
@Table(name = "ppt")
public class PPTEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content_name")
    private String contentName;

    @Column(columnDefinition = "LONGBLOB",nullable = true)
    private byte[] uploadFile;

    // Constructors
    public PPTEntity() {}

    public PPTEntity(String contentName, byte[] uploadFile) {
        this.contentName = contentName;
        this.uploadFile = uploadFile;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContentName() {
        return contentName;
    }

    public void setContentName(String contentName) {
        this.contentName = contentName;
    }

    public byte[] getUploadFile() {
        return uploadFile;
    }

    public void setUploadFile(byte[] uploadFile) {
        this.uploadFile = uploadFile;
    }
}
