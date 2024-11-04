package com.erms.ERMS_Application.Quotation.Form;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import com.erms.ERMS_Application.Authentication.sales.SalesRepository;
import com.erms.ERMS_Application.Quotation.AddParty.AddPartyEntity;

@Service
public class FormService {
	
	@Autowired
	private FormRepository formRepo;
	
	@Autowired
	private SalesRepository saleRepo;
	   
	/////////////////////Saving Form /////////////////////////////////////////	

	public FormDTO createForm(AddPartyEntity addPartyOpt, FormDTO formDTO, long sId) {

		// Get SaleEntity for the salesman
		Sales saleEntity = saleRepo.findById(sId)
				.orElseThrow(() -> new RuntimeException("Salesman not found"));

		// Map FormDTO to FormEntity
		FormEntity formEntity = new FormEntity();
		formEntity.setQuotationNumber(generateQuotationNumber(saleEntity.getFirstName()));
		formEntity.setAddParty(addPartyOpt);
		formEntity.setQuotationDate(formDTO.getQuotationDate());
		formEntity.setPaymentTerms(formDTO.getPaymentTerms());
		formEntity.setDueDate(formDTO.getDueDate());
		formEntity.setPoNo(formDTO.getPoNo());
		formEntity.setLut(formDTO.getLut());

		// Save the form to the database, ensuring no duplicate quotation numbers
		FormEntity savedForm = formRepo.save(formEntity);

		// Map saved FormEntity back to FormDTO
		FormDTO savedFormDTO = new FormDTO();
		savedFormDTO.setFId(savedForm.getfId());
		savedFormDTO.setQuotationNumber(savedForm.getQuotationNumber());
		savedFormDTO.setQuotationDate(savedForm.getQuotationDate());
		savedFormDTO.setPaymentTerms(savedForm.getPaymentTerms());
		savedFormDTO.setDueDate(savedForm.getDueDate());
		savedFormDTO.setPoNo(savedForm.getPoNo());
		savedFormDTO.setLut(savedForm.getLut());

		return savedFormDTO; // Return the saved FormDTO
	}


	// Method to generate the quotation number
	    private String generateQuotationNumber(String firstName) {
	        // Extract first 3 letters from firstName
	        String namePrefix = firstName.substring(0, Math.min(3, firstName.length())).toUpperCase();

	        // Get current financial year (e.g., "24-25")
	        String financialYear = getCurrentFinancialYear();

	        // Get the next serial number (increment last serial in the current year)
	        String serialNumber = getNextSerialNumber(financialYear);

	        // Return the generated quotation number (e.g., "RAJ/QT/24-25-001")
	        return namePrefix + "/QT/" + financialYear + "-" + serialNumber;
	    }

	    // Helper method to get the current financial year (e.g., "24-25")
	    private String getCurrentFinancialYear() {
	        LocalDate today = LocalDate.now();
	        int year = today.getYear();
	        int nextYear = year + 1;

	        if (today.getMonthValue() >= 4) {  // Fiscal year starts from April
	            return year % 100 + "-" + nextYear % 100;
	        } else {
	            return (year - 1) % 100 + "-" + year % 100;
	        }
	    }

	    // Helper method to get the next serial number for the given financial year
	    private String getNextSerialNumber(String financialYear) {
	        // Fetch the last created form for the current financial year
	        Optional<FormEntity> lastForm = formRepo.findTopByQuotationNumberContainingOrderByFIdDesc(financialYear);

	        // Extract last serial number and increment
	        if (lastForm.isPresent()) {
	            String lastQuotationNumber = lastForm.get().getQuotationNumber();
	            String[] parts = lastQuotationNumber.split("-");
	            int lastSerial = Integer.parseInt(parts[2]);
	            return String.format("%03d", lastSerial + 1);
	        } else {
	            return "001";  // Start from 001 if no form exists for the year
	        }
	    }


	 
	/////////////Get By Form Id //////////////////////////////////////////////
	public Optional<FormEntity> findByFormId(long fId) {
		Optional<FormEntity> getformdetails = formRepo.findById(fId);
		return getformdetails;
	}

	////////////////////GetAll Forms/////////////////////////////////////

	public List<FormEntity> getAllForms() {
		List<FormEntity> formAll = formRepo.findAll();
		return formAll;
	}


	///////////////////Partial Update////////////////////////////////
	public FormEntity updateFormDetails (long fId, FormEntity formdetails) {
		FormEntity updateForm = formRepo.findById(fId).orElseThrow();
	
	Optional.ofNullable(formdetails.getQuotationNumber()).ifPresent(updateForm::setQuotationNumber);
	Optional.ofNullable(formdetails.getQuotationDate()).ifPresent(updateForm::setQuotationDate);
	Optional.ofNullable(formdetails.getPaymentTerms()).ifPresent(updateForm::setPaymentTerms);
	Optional.ofNullable(formdetails.getDueDate()).ifPresent(updateForm::setDueDate);
	Optional.ofNullable(formdetails.getPoNo()).ifPresent(updateForm::setPoNo);
	Optional.ofNullable(formdetails.getLut()).ifPresent(updateForm::setLut);
	return formRepo.save(updateForm);
	
	}
	
	////////////////////////Delete Form ById//////////////////////////////////////
	public void deleteByFormId(long fId) {
		formRepo.deleteById(fId);
	}


}
