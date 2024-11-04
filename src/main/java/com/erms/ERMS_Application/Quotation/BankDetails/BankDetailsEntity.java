package com.erms.ERMS_Application.Quotation.BankDetails;

import jakarta.persistence.*;

@Entity
@Table(name="BankDetails")
public class BankDetailsEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long   bdId;
	private String accountNumber;
	private String ifscCode;
	private String bankName;
	private String branchName;
	private String accountHolderName;
	
	
	public long getBdId() {
		return bdId;
	}

	public void setBdId(long bdId) {
		this.bdId = bdId;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

	public String getIfscCode() {
		return ifscCode;
	}

	public void setIfscCode(String ifscCode) {
		this.ifscCode = ifscCode;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}



	public String getAccountHolderName() {
		return accountHolderName;
	}

	public void setAccountHolderName(String accountHolderName) {
		this.accountHolderName = accountHolderName;
	}



	public String getBranchName() {
		return branchName;
	}

	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}

	public BankDetailsEntity() {
		super();
		
	}
	
	
	
	

}
