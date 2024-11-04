package com.erms.ERMS_Application.Quotation.Form;

import java.time.LocalDate;

public class FormDTO {
    private long fId;
    private String quotationNumber;
    private LocalDate quotationDate;
    private Long paymentTerms;
    private LocalDate dueDate;
    private String poNo;
    private String lut;

    // Getters and Setters
    public long getFId() {
        return fId;
    }

    public void setFId(long fId) {
        this.fId = fId;
    }

    public String getQuotationNumber() {
        return quotationNumber;
    }

    public void setQuotationNumber(String quotationNumber) {
        this.quotationNumber = quotationNumber;
    }

    public LocalDate getQuotationDate() {
        return quotationDate;
    }

    public void setQuotationDate(LocalDate quotationDate) {
        this.quotationDate = quotationDate;
    }

    public Long getPaymentTerms() {
        return paymentTerms;
    }

    public void setPaymentTerms(Long paymentTerms) {
        this.paymentTerms = paymentTerms;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getPoNo() {
        return poNo;
    }

    public void setPoNo(String poNo) {
        this.poNo = poNo;
    }

    public String getLut() {
        return lut;
    }

    public void setLut(String lut) {
        this.lut = lut;
    }
}
