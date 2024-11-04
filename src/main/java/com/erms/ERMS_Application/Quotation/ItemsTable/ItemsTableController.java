package com.erms.ERMS_Application.Quotation.ItemsTable;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

import com.erms.ERMS_Application.Quotation.Form.FormEntity;
import com.erms.ERMS_Application.Quotation.Form.FormService;

@RestController 
@RequestMapping("/api/itemstable")
public class ItemsTableController {
	
	@Autowired
	private ItemsTableService itemsTableService; 
	
	@Autowired
	private FormService formService;
    @Autowired
	private ItemsTableRepository itemRepo;
	
	////////////////////Adding List of items///////////////////////////////

	@PostMapping("/saveitems/{fId}")
	public ResponseEntity<?> saveItems(@PathVariable long fId, @RequestBody ItemsTableEntity addItems) {
	    // Find the FormEntity using the provided FId
	    Optional<FormEntity> formOptional = formService.findByFormId(fId);

	    if (!formOptional.isPresent()) { // Check if the FormEntity exists
	        return new ResponseEntity<>("FormEntity not found", HttpStatus.NOT_FOUND);
	    }	    
	    FormEntity addForm = formOptional.get();
	    // Set the FormEntity reference for each item in the list
	   // for (ItemsTableEntity addItem : addItems) {
		addItems.setFormEntity(addForm);
	    //}
	    // Save all items at once
	    ItemsTableEntity savedItems = itemRepo.save(addItems);
	    return new ResponseEntity<>(savedItems, HttpStatus.CREATED);
	}

	////////////////////Get List of Items by AdId ///////////////////////////

	@GetMapping("/getItemsByFormId/{fId}")
	public ResponseEntity<?> getItemsByFormId(@PathVariable long fId) {
		try {
			// Fetch the form details by form ID
			Optional<FormEntity> formDetails = formService.findByFormId(fId);

			if (formDetails.isPresent()) {
				// Correct method to fetch items from FormEntity
				List<ItemsTableEntity> items = formDetails.get().getItemsTable(); // Updated line

				// Convert the list of ItemsTableEntity to a list of ItemsTableDTO
				List<ItemsTableDTO> itemsDTO = items.stream()
						.map(item -> {
							ItemsTableDTO dto = new ItemsTableDTO();
							dto.setItId(item.getItId());
							dto.setItems(item.getItems());
							dto.setHsn(item.getHsn());
							dto.setQty(item.getQty());
							dto.setPriceItem(item.getPriceItem());
							dto.setDiscount(item.getDiscount());
							dto.setTax(item.getTax());
							dto.setAmount(item.getAmount());
							return dto;
						})
						.collect(Collectors.toList());

				return new ResponseEntity<>(itemsDTO, HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Items not found", HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>("Error fetching items: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}




	///////////////////// Get All Forms ///////////////////////////////

	@GetMapping("/getAllForms")
	public ResponseEntity<?> getAllItems() {
		try {
			List<ItemsTableEntity> allItems = itemsTableService.findAllItemsTable();

			// Convert the list of ItemsTableEntity to a list of ItemsTableDTO
			List<ItemsTableDTO> allItemsDTO = allItems.stream()
					.map(item -> {
						ItemsTableDTO dto = new ItemsTableDTO();
						dto.setItId(item.getItId());
						dto.setItems(item.getItems());
						dto.setHsn(item.getHsn());
						dto.setQty(item.getQty());
						dto.setPriceItem(item.getPriceItem());
						dto.setDiscount(item.getDiscount());
						dto.setTax(item.getTax());
						dto.setAmount(item.getAmount());
						return dto;
					})
					.collect(Collectors.toList());

			return new ResponseEntity<>(allItemsDTO, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>("Error fetching all Items: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	//////////////////// Partial Update //////////////////////////////
	@PatchMapping("/update/{itId}")
	public ResponseEntity<?> updateItemsTable(@PathVariable long itId, @RequestBody ItemsTableEntity updateItem) {
		try {
			ItemsTableEntity updatedItems = itemsTableService.updateFormDetails(itId, updateItem);
			return new ResponseEntity<>(updatedItems, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>("Error updating Items: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	///////////////////// Delete Form By Id ///////////////////////////
	@DeleteMapping("/{itId}")
	public ResponseEntity<?> deleteItemById(@PathVariable("itId") long itId) {
		try {
			itemsTableService.deleteByItemsId(itId);
			return new ResponseEntity<>("ItemsTable deleted successfully", HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>("Error deleting Items: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
