package com.erms.ERMS_Application.Quotation.AddParty;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import com.erms.ERMS_Application.Authentication.sales.SalesRepository;

@Service
public class AddPartyService {
	
	
	@Autowired
	private AddPartyRepo addPartyRepo;
	
	@Autowired
	private SalesRepository salesRepo;

	public AddPartyEntity createParty(long salesId, AddPartyEntity addParty) {
		// TODO Auto-generated method stub
		
		Sales sale=salesRepo.findById(salesId).orElse(null);
		
		
		addParty.setSales(sale);
		return addPartyRepo.save(addParty);
	}

	public Optional<AddPartyDTO> getParty(long adId) {
		Optional<AddPartyEntity> partyEntityOpt = addPartyRepo.findById(adId);

		if (partyEntityOpt.isPresent()) {
			AddPartyEntity partyEntity = partyEntityOpt.get();
			AddPartyDTO partyDTO = new AddPartyDTO(
					partyEntity.getAdId(),
					partyEntity.getCustomerName(),
					partyEntity.getMobileNumber(),
					partyEntity.getBillingAddress(),
					partyEntity.getState(),
					partyEntity.getPincode(),
					partyEntity.getCity(),
					partyEntity.getShippingAddress(),
					partyEntity.getShippingState(),
					partyEntity.getShippingPincode(),
					partyEntity.getShippingCity(),
					partyEntity.getGstIn(),
					partyEntity.getSales() != null ? partyEntity.getSales().getId() : 0L  // Get the sales ID
			);
			return Optional.of(partyDTO);  // Return the DTO wrapped in Optional
		}

		return Optional.empty();  // Return empty Optional if not found
	}


	
	
	//////////////////GetAll AddParties////////////////////////
	public List<AddPartyDTO> getAllParties() {
		List<AddPartyEntity> addAll = addPartyRepo.findAll();

		return addAll.stream().map(party -> new AddPartyDTO(
				party.getAdId(),
				party.getCustomerName(),
				party.getMobileNumber(),
				party.getBillingAddress(),
				party.getState(),
				party.getPincode(),
				party.getCity(),
				party.getShippingAddress(),
				party.getShippingState(),
				party.getShippingPincode(),
				party.getShippingCity(),
				party.getGstIn(),
				party.getSales() != null ? party.getSales().getId() : 0L  // Get the sales ID
		)).collect(Collectors.toList());
	}

	 
	///////////////////Partial Update////////////////////////////////
	public AddPartyEntity updateAddparty (long AdId, AddPartyEntity addparty) {
		AddPartyEntity updatepartial = addPartyRepo.findById(AdId).orElseThrow();
		
		Optional.ofNullable(addparty.getCustomerName()).ifPresent(updatepartial::setCustomerName);
		Optional.ofNullable(addparty.getMobileNumber()).ifPresent(updatepartial::setMobileNumber);
		Optional.ofNullable(addparty.getBillingAddress()).ifPresent(updatepartial::setBillingAddress);
		Optional.ofNullable(addparty.getState()).ifPresent(updatepartial::setState);
		Optional.ofNullable(addparty.getPincode()).ifPresent(updatepartial::setPincode);
		Optional.ofNullable(addparty.getCity()).ifPresent(updatepartial::setCity);
		Optional.ofNullable(addparty.getShippingAddress()).ifPresent(updatepartial::setShippingAddress);
		Optional.ofNullable(addparty.getShippingCity()).ifPresent(updatepartial::setShippingCity);
		Optional.ofNullable(addparty.getShippingState()).ifPresent(updatepartial::setShippingState);
		Optional.ofNullable(addparty.getPincode()).ifPresent(updatepartial::setShippingPincode);
		Optional.ofNullable(addparty.getGstIn()).ifPresent(updatepartial::setGstIn);
		return addPartyRepo.save(updatepartial);
		
	}



	///////////////////////Delete AddParty//////////////////////////////////////
	public void deleteByPartyId(long AdId) {
		addPartyRepo.deleteById(AdId);
	}



}
