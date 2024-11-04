package com.erms.ERMS_Application.PertrolAllowance;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import jakarta.persistence.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;


@Entity
@Table(name = "petrol_allowance")
public class PetrolAllowanceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long pId;

    private String startTime;

    private String startReading;

    private String endTime;

    private String endReading;

    private float totalKm;

    private float petrolChargePerKm;

    @Column(columnDefinition = "LONGBLOB")
    private LocalDate date;

    @Column(columnDefinition = "LONGBLOB")
    private String additionalComments;

    @Column(columnDefinition = "LONGBLOB",nullable = true)
    private byte[] choosePetrolInvoiceBill; // To store the image or PDF file

    @ManyToOne(fetch = FetchType.LAZY)
    private Sales sales;


    public long getpId() {
        return pId;
    }

    public void setpId(long pId) {
        this.pId = pId;
    }



    public String getStartReading() {
        return startReading;
    }

    public void setStartReading(String startReading) {
        this.startReading = startReading;
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

    public Sales getSales() {
        return sales;
    }

    public void setSales(Sales sales) {
        this.sales = sales;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public PetrolAllowanceEntity() {
    }

    public PetrolAllowanceEntity(long pId, String startTime, String startReading, String endTime, String endReading, float totalKm, float petrolChargePerKm, LocalDate date, String additionalComments, byte[] choosePetrolInvoiceBill, Sales sales) {
        this.pId = pId;
        this.startTime = startTime;
        this.startReading = startReading;
        this.endTime = endTime;
        this.endReading = endReading;
        this.totalKm = totalKm;
        this.petrolChargePerKm = petrolChargePerKm;
        this.date = date;
        this.additionalComments = additionalComments;
        this.choosePetrolInvoiceBill = choosePetrolInvoiceBill;
        this.sales = sales;
    }



}
