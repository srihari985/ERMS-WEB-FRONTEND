package com.erms.ERMS_Application.FoodAllowance;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "food_Allowance")
public class FoodAllowanceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long foId;
    private String name;
    private LocalDate date;
    private String customerName;
    private String noOfPersons;
    private float foodCost;


    @ManyToOne(fetch = FetchType.LAZY)
    private Sales sales;




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

    public Sales getSales() {
        return sales;
    }

    public void setSales(Sales sales) {
        this.sales = sales;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public FoodAllowanceEntity() {
    }


    public FoodAllowanceEntity(String name,LocalDate date, String customerName, String noOfPersons, float foodCost, Sales sales) {
        this.name = name;
        this.date = date;
        this.customerName = customerName;
        this.noOfPersons = noOfPersons;
        this.foodCost = foodCost;
        this.sales = sales;
    }

}
