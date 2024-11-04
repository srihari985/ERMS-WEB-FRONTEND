package com.erms.ERMS_Application.Quotation.Form;

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

import com.erms.ERMS_Application.Quotation.AddParty.AddPartyEntity;
import com.erms.ERMS_Application.Quotation.AddParty.AddPartyRepo;

@RestController
@RequestMapping("api/form")
public class FormController {

    @Autowired
    private FormService formService;
    
    @Autowired
    private AddPartyRepo addPartyRepo;

    /////////////////////// Form Saving ///////////////////////////////    
    @PostMapping("/save/{addPartyId}/{sId}")
    public ResponseEntity<?> createForm(@PathVariable long addPartyId,
                                        @PathVariable long sId,
                                        @RequestBody FormDTO formDTO) {
        AddPartyEntity addParty = addPartyRepo.findById(addPartyId).orElse(null);

        if (addParty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("AddPartyEntity not found for ID: " + addPartyId);
        }

        // Create form with dynamic quotation number, using FormDTO
        FormDTO createdFormDTO = formService.createForm(addParty, formDTO, sId);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdFormDTO);
    }


    

    ///////////////////// Get By Form Id ///////////////////////////////
    @GetMapping("/getById/{fId}")
    public ResponseEntity<?> getById(@PathVariable("fId") long fId) {
        try {
            Optional<FormEntity> formdetails = formService.findByFormId(fId);
            if (formdetails.isPresent()) {
                // Convert FormEntity to FormDTO
                FormEntity form = formdetails.get();
                FormDTO dto = new FormDTO();
                dto.setFId(form.getfId());
                dto.setQuotationNumber(form.getQuotationNumber());
                dto.setQuotationDate(form.getQuotationDate());
                dto.setPaymentTerms(form.getPaymentTerms());
                dto.setDueDate(form.getDueDate());
                dto.setPoNo(form.getPoNo());
                dto.setLut(form.getLut());

                return new ResponseEntity<>(dto, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Form not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching form: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    ///////////////////// Get All Forms ///////////////////////////////

    @GetMapping("/getAllForms")
    public ResponseEntity<?> getAllForms() {
        try {
            List<FormEntity> allForms = formService.getAllForms();

            // Convert List<FormEntity> to List<FormDTO>
            List<FormDTO> formDTOs = allForms.stream().map(form -> {
                FormDTO dto = new FormDTO();
                dto.setFId(form.getfId());
                dto.setQuotationNumber(form.getQuotationNumber());
                dto.setQuotationDate(form.getQuotationDate());
                dto.setPaymentTerms(form.getPaymentTerms());
                dto.setDueDate(form.getDueDate());
                dto.setPoNo(form.getPoNo());
                dto.setLut(form.getLut());
                return dto;
            }).collect(Collectors.toList());

            return new ResponseEntity<>(formDTOs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching all forms: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //////////////////// Partial Update //////////////////////////////
    @PatchMapping("/update/{fId}")
    public ResponseEntity<?> updateformDetail(@PathVariable long fId, @RequestBody FormEntity updateform) {
        try {
            FormEntity updatedForm = formService.updateFormDetails(fId, updateform);
            return new ResponseEntity<>(updatedForm, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating form: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    ///////////////////// Delete Form By Id ///////////////////////////
    @DeleteMapping("/{fId}")
    public ResponseEntity<?> deleteFormById(@PathVariable("fId") long fId) {
        try {
        	Optional<FormEntity> form = formService.findByFormId(fId);
            if (form.isPresent()) {
            	formService.deleteByFormId(fId);
                return new ResponseEntity<>("Form deleted successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Form not found for ID: " + fId, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting form: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}