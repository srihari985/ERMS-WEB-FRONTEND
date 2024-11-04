package com.erms.ERMS_Application.Quotation.Form;

import java.time.LocalDate;
import java.util.List;

import com.erms.ERMS_Application.Quotation.AddParty.AddPartyEntity;
import com.erms.ERMS_Application.Quotation.ItemsTable.ItemsTableEntity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "form", uniqueConstraints = @UniqueConstraint(columnNames = "quotationNumber"))
public class FormEntity { 
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long fId;
//	@Column(nullable = false, unique = true)
	private String quotationNumber; // Auto Gen
	private LocalDate quotationDate;  // Auto Gen
	private	Long paymentTerms;
	private LocalDate	dueDate;
	private String poNo;
	private String lut;

	@ManyToOne(fetch = FetchType.LAZY)
	private AddPartyEntity addParty;
	
	@OneToMany(mappedBy = "formEntity")
	private List<ItemsTableEntity> itemsTable;
	
	

	public long getfId() {
		return fId;
	}

	public void setfId(long fId) {
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

	public AddPartyEntity getAddParty() {
		return addParty;
	}

	public void setAddParty(AddPartyEntity addParty) {
		this.addParty = addParty;
	}

	public List<ItemsTableEntity> getItemsTable() {
		return itemsTable;
	}

	public void setItemsTable(List<ItemsTableEntity> itemsTable) {
		this.itemsTable = itemsTable;
	}


	public FormEntity(long fId, String quotationNumber, LocalDate quotationDate, Long paymentTerms, LocalDate dueDate, String poNo, String lut, AddPartyEntity addParty, List<ItemsTableEntity> itemsTable) {
		this.fId = fId;
		this.quotationNumber = quotationNumber;
		this.quotationDate = quotationDate;
		this.paymentTerms = paymentTerms;
		this.dueDate = dueDate;
		this.poNo = poNo;
		this.lut = lut;
		this.addParty = addParty;
		this.itemsTable = itemsTable;
	}

	public FormEntity() {
		super();
	}


}