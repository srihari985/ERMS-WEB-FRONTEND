package com.erms.ERMS_Application.Demo.contactForm;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import jakarta.persistence.*;

@Entity
@Table(name = "contact_form")
public class ContactForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long cId;

    private String contactPerson ;
    private String contactNumber;
    private String companyName;
    private String emailId;
    private String address;
    private String gstIn;

    @ManyToOne(fetch = FetchType.LAZY)
    private Sales sales;

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

    public Sales getSales() {
        return sales;
    }

    public void setSales(Sales sales) {
        this.sales = sales;
    }

    public ContactForm() {
    }

    public ContactForm(long cId, String contactPerson, String contactNumber, String companyName, String emailId, String address, String gstIn) {
        this.cId = cId;
        this.contactPerson = contactPerson;
        this.contactNumber = contactNumber;
        this.companyName = companyName;
        this.emailId = emailId;
        this.address = address;
        this.gstIn = gstIn;
    }
}
