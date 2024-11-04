package com.erms.ERMS_Application.Demo.contactForm;

public class ContactFormDTO {

    private long cId;
    private String contactPerson;
    private String contactNumber;
    private String companyName;
    private String emailId;
    private String address;
    private String gstIn;
    private long salesId;  // Add salesId to represent the Sales entity

    // Constructors
    public ContactFormDTO(long cId, String contactPerson, String contactNumber, String companyName, String emailId, String address, String gstIn, long salesId) {
        this.cId = cId;
        this.contactPerson = contactPerson;
        this.contactNumber = contactNumber;
        this.companyName = companyName;
        this.emailId = emailId;
        this.address = address;
        this.gstIn = gstIn;
        this.salesId = salesId;  // Initialize salesId
    }

    // Getters and Setters
    public long getcId() {
        return cId;
    }

    public void setcId(long cId) {
        this.cId = cId;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGstIn() {
        return gstIn;
    }

    public void setGstIn(String gstIn) {
        this.gstIn = gstIn;
    }

    public long getSalesId() {
        return salesId;
    }

    public void setSalesId(long salesId) {
        this.salesId = salesId;
    }
}
