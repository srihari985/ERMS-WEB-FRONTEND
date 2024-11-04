package com.erms.ERMS_Application.PertrolAllowance;


import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;


public class TripDetailsDTO {

    @NotNull(message = "pId cannot be null")
    private long pId;

    @NotNull(message = "startTime cannot be null")
    private String startTime;

    @NotNull(message = "startReading cannot be null")
    private String startReading;

    @NotNull(message = "endTime cannot be null")
    private String endTime;

    @NotNull(message = "endReading cannot be null")
    private String endReading;

    @NotNull(message = "totalKm cannot be null")
    private float totalKm;

    @NotNull(message = "petrolChargePerKm cannot be null")
    private float petrolChargePerKm;

    @Column(length = 1000) // Adjust this value as needed
    private String additionalComments;

    @Lob // Specifies that this field will store large objects (like binary data)
    @Column(nullable = true) // This makes the field optional
    private byte[] choosePetrolInvoiceBill; // To store the image or PDF file

    private long salesId;

    @Column(columnDefinition = "LONGBLOB")
    private LocalDate date;



    // Getters and Setters
    public long getpId() {
        return pId;
    }

    public void setpId(long pId) {
        this.pId = pId;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getStartReading() {
        return startReading;
    }

    public void setStartReading(String startReading) {
        this.startReading = startReading;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getEndReading() {
        return endReading;
    }

    public void setEndReading(String endReading) {
        this.endReading = endReading;
    }

    public float getTotalKm() {
        return totalKm;
    }

    public void setTotalKm(float totalKm) {
        this.totalKm = totalKm;
    }

    public float getPetrolChargePerKm() {
        return petrolChargePerKm;
    }

    public void setPetrolChargePerKm(float petrolChargePerKm) {
        this.petrolChargePerKm = petrolChargePerKm;
    }

    public String getAdditionalComments() {
        return additionalComments;
    }

    public void setAdditionalComments(String additionalComments) {
        this.additionalComments = additionalComments;
    }

    public byte[] getChoosePetrolInvoiceBill() {
        return choosePetrolInvoiceBill;
    }

    public void setChoosePetrolInvoiceBill(byte[] choosePetrolInvoiceBill) {
        this.choosePetrolInvoiceBill = choosePetrolInvoiceBill;
    }

    public long getSalesId() {
        return salesId;
    }

    public void setSalesId(long salesId) {
        this.salesId = salesId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
