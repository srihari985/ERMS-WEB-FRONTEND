package com.erms.ERMS_Application.Quotation.AddParty;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/addParty")
public class AddPartyController {
	
	
	@Autowired
	private AddPartyService addPartyService;
	
	@PostMapping("/save/{salesId}")
	public AddPartyEntity addParty(@PathVariable long salesId,@RequestBody AddPartyEntity addParty) {
		
		AddPartyEntity party=addPartyService.createParty(salesId,addParty);
		return party;
	}
	
////////////////////Getparty By Id///////////////////////////////////

	@GetMapping("/getPartyById/{adId}")
	public ResponseEntity<?> getAddedParty(@PathVariable long adId) {
		Optional<AddPartyDTO> partyDTOOpt = addPartyService.getParty(adId);

		if (partyDTOOpt.isPresent()) {
			return ResponseEntity.ok(partyDTOOpt.get());  // Return 200 OK with the specific party details
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("Party not found for ID: " + adId);  // Return 404 if not found
		}
	}



	/////////////////////GetAll Parties ///////////////////////////////////////////

	@GetMapping("/getAll")
	public ResponseEntity<?> getAllParties() {
		try {
			List<AddPartyDTO> allPartiesDTO = addPartyService.getAllParties();
			return new ResponseEntity<>(allPartiesDTO, HttpStatus.OK);
		} catch (Exception ex) {
			return new ResponseEntity<>("Error fetching all parties: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

		
		//////////////////////Partial Update////////////////////////////////////////////
		
		@PatchMapping("/update/{adId}")
		public ResponseEntity<?> updatepartially(@PathVariable long adId, @RequestBody AddPartyEntity updateAdd) {
		try {
		AddPartyEntity updatedParty = addPartyService.updateAddparty(adId, updateAdd);
		return new ResponseEntity<>(updatedParty, HttpStatus.OK);
		} catch (Exception ex) {
		return new ResponseEntity<>("Error updating party: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		}
		
		///////////////////////Delete AddParty//////////////////////////////////////
		
		
		@DeleteMapping("/{adId}")
		public ResponseEntity<?> deleteByAddPartyId(@PathVariable long adId) {
		try {
		addPartyService.deleteByPartyId(adId);
		return new ResponseEntity<>("Party deleted successfully", HttpStatus.OK);
		} catch (Exception ex) {
		return new ResponseEntity<>("Error deleting party: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		}

}
