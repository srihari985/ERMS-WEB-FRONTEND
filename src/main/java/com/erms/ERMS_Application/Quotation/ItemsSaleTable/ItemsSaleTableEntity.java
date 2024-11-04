package com.erms.ERMS_Application.Quotation.ItemsSaleTable;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import com.erms.ERMS_Application.Quotation.AddParty.AddPartyEntity;
import com.erms.ERMS_Application.Quotation.Form.FormEntity;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "items_sales_table")
public class ItemsSaleTableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long itId;

    private String items;
    private String hsn;
    private long qty;
    private float priceItem;
    private float discount;
    private float tax;
    private float amount;

    @Column(name = "sale_date")
    private LocalDate saleDate;

    @ManyToOne(fetch = FetchType.LAZY)
    private FormEntity formEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    private Sales sales;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ad_id", referencedColumnName = "adId")
    private AddPartyEntity addPartyEntity;

    public ItemsSaleTableEntity() {
    }

    public ItemsSaleTableEntity(long itId, String items, String hsn, long qty, float priceItem, float discount, float tax, float amount, LocalDate saleDate, FormEntity formEntity, Sales sales, AddPartyEntity addPartyEntity) {
        this.itId = itId;
        this.items = items;
        this.hsn = hsn;
        this.qty = qty;
        this.priceItem = priceItem;
        this.discount = discount;
        this.tax = tax;
        this.amount = amount;
        this.saleDate = saleDate;
        this.formEntity = formEntity;
        this.sales = sales;
        this.addPartyEntity = addPartyEntity;
    }

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
        if (qty < 0) throw new IllegalArgumentException("Quantity cannot be negative.");
        this.qty = qty;
    }

    public float getPriceItem() {
        return priceItem;
    }

    public void setPriceItem(float priceItem) {
        if (priceItem < 0) throw new IllegalArgumentException("Price cannot be negative.");
        this.priceItem = priceItem;
    }

    public float getDiscount() {
        return discount;
    }

    public void setDiscount(float discount) {
        if (discount < 0) throw new IllegalArgumentException("Discount cannot be negative.");
        this.discount = discount;
    }

    public float getTax() {
        return tax;
    }

    public void setTax(float tax) {
        if (tax < 0) throw new IllegalArgumentException("Tax cannot be negative.");
        this.tax = tax;
    }

    public float getAmount() {
        return amount;
    }

    public void setAmount(float amount) {
        if (amount < 0) throw new IllegalArgumentException("Amount cannot be negative.");
        this.amount = amount;
    }

    public FormEntity getFormEntity() {
        return formEntity;
    }

    public void setFormEntity(FormEntity formEntity) {
        this.formEntity = formEntity;
    }

    public Sales getSales() {
        return sales;
    }

    public void setSales(Sales sales) {
        this.sales = sales;
    }

    public LocalDate getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDate saleDate) {
        this.saleDate = saleDate;
    }

    public AddPartyEntity getAddPartyEntity() {
        return addPartyEntity;
    }

    public void setAddPartyEntity(AddPartyEntity addPartyEntity) {
        this.addPartyEntity = addPartyEntity;
    }

    @Override
    public String toString() {
        return "ItemsSaleTableEntity{" +
                "itId=" + itId +
                ", items='" + items + '\'' +
                ", hsn='" + hsn + '\'' +
                ", qty=" + qty +
                ", priceItem=" + priceItem +
                ", discount=" + discount +
                ", tax=" + tax +
                ", amount=" + amount +
                ", saleDate=" + saleDate +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ItemsSaleTableEntity)) return false;
        ItemsSaleTableEntity that = (ItemsSaleTableEntity) o;
        return itId == that.itId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(itId);
    }
}
