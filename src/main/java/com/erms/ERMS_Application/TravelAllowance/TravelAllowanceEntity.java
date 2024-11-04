package com.erms.ERMS_Application.TravelAllowance;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "travel_allowances")
public class TravelAllowanceEntity {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long tId;
    private String name;
    private LocalDate date;
    private String customerName;
    private String travelFrom;
    private String travelTo;
    private String travelType;
    private long noOfDays;
    private float travelCost;

    @ManyToOne(fetch = FetchType.LAZY)
    private Sales sales;

    public TravelAllowanceEntity(String name, LocalDate date, String customerName, String travelFrom, String travelTo, String travelType, long noOfDays, float travelCost, Sales sales) {
        this.name = name;
        this.date = date;
        this.customerName = customerName;
        this.travelFrom = travelFrom;
        this.travelTo = travelTo;
        this.travelType = travelType;
        this.noOfDays = noOfDays;
        this.travelCost = travelCost;
        this.sales = sales;
    }


    public long gettId() {
        return tId;
    }

    public void settId(long tId) {
        this.tId = tId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }



    public long getNoOfDays() {
        return noOfDays;
    }

    public void setNoOfDays(long noOfDays) {
        this.noOfDays = noOfDays;
    }

    public float getTravelCost() {
        return travelCost;
    }

    public void setTravelCost(float travelCost) {
        this.travelCost = travelCost;
    }

    public Sales getSales() {
        return sales;
    }

    public void setSales(Sales sales) {
        this.sales = sales;
    }

    public String getTravelFrom() {
        return travelFrom;
    }

    public void setTravelFrom(String travelFrom) {
        this.travelFrom = travelFrom;
    }

    public String getTravelTo() {
        return travelTo;
    }

    public void setTravelTo(String travelTo) {
        this.travelTo = travelTo;
    }

    public String getTravelType() {
        return travelType;
    }

    public void setTravelType(String travelType) {
        this.travelType = travelType;
    }

    public TravelAllowanceEntity() {
    }

}
