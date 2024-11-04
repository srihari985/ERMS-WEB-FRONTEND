package com.erms.ERMS_Application.Quotation.ItemsTable;

public class ItemsTableDTO {
    private long itId;
    private String items;
    private String hsn;
    private long qty;
    private float priceItem;
    private float discount;
    private float tax;
    private float amount;

    // Getters and Setters
    public long getItId() {
        return itId;
    }

    public void setItId(long itId) {
        this.itId = itId;
    }

    public String getItems() {
        return items;
    }

    public void setItems(String items) {
        this.items = items;
    }

    public String getHsn() {
        return hsn;
    }

    public void setHsn(String hsn) {
        this.hsn = hsn;
    }

    public long getQty() {
        return qty;
    }

    public void setQty(long qty) {
        this.qty = qty;
    }

    public float getPriceItem() {
        return priceItem;
    }

    public void setPriceItem(float priceItem) {
        this.priceItem = priceItem;
    }

    public float getDiscount() {
        return discount;
    }

    public void setDiscount(float discount) {
        this.discount = discount;
    }

    public float getTax() {
        return tax;
    }

    public void setTax(float tax) {
        this.tax = tax;
    }

    public float getAmount() {
        return amount;
    }

    public void setAmount(float amount) {
        this.amount = amount;
    }
}

