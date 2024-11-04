package com.erms.ERMS_Application.Quotation.ItemsSaleTable;

public class TotalsDTO {
    private float totalAmount;
    private float totalDiscount;
    private float totalTax;
    private float amount;


    public TotalsDTO(float totalAmount, float totalDiscount, float totalTax, float amount) {
        this.totalAmount = totalAmount;
        this.totalDiscount = totalDiscount;
        this.totalTax = totalTax;
        this.amount = amount;
    }

    public TotalsDTO() {
        super();
    }




    // Getters and setters
    public float getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(float totalAmount) {
        this.totalAmount = totalAmount;
    }

    public float getTotalDiscount() {
        return totalDiscount;
    }

    public void setTotalDiscount(float totalDiscount) {
        this.totalDiscount = totalDiscount;
    }

    public float getTotalTax() {
        return totalTax;
    }

    public void setTotalTax(float totalTax) {
        this.totalTax = totalTax;
    }

    public float getAmount() {
        return amount;
    }

    public void setAmount(float amount) {
        this.amount = amount;
    }
}