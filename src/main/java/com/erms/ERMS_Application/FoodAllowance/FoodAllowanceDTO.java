package com.erms.ERMS_Application.FoodAllowance;

import java.time.LocalDate;

public class FoodAllowanceDTO {
    private long foId;
    private String name;
    private LocalDate date;
    private String customerName;
    private String noOfPersons;
    private float foodCost;
    private String salesId;  // To represent the associated Sales entity

    // Getters and Setters
    public long getFoId() {
        return foId;
    }

    public void setFoId(long foId) {
        this.foId = foId;
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

    public String getNoOfPersons() {
        return noOfPersons;
    }

    public void setNoOfPersons(String noOfPersons) {
        this.noOfPersons = noOfPersons;
    }

    public float getFoodCost() {
        return foodCost;
    }

    public void setFoodCost(float foodCost) {
        this.foodCost = foodCost;
    }

    public String getSalesId() {
        return salesId;
    }

    public void setSalesId(String salesId) {
        this.salesId = salesId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
