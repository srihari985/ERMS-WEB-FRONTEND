package com.erms.ERMS_Application.Demo.contactForm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/contactForm")
public class ContactFormController {

    @Autowired
    private ContactFormService contactFormService;

    @PostMapping("/save/{salesId}")
    public ResponseEntity<ContactForm> contactForm(@PathVariable long salesId,
                                                   @RequestParam String contactPerson,
                                                   @RequestParam String contactNumber,
                                                   @RequestParam String companyName,
                                                   @RequestParam String emailId,
                                                   @RequestParam String address,
                                                   @RequestParam String gstIn) {

        // Create a new contact form using the service layer
        ContactForm contact = contactFormService.createContact(salesId, contactPerson, contactNumber, companyName, emailId, address, gstIn);

        return ResponseEntity.ok(contact);
    }


    @GetMapping("/getContactFormById/{cId}")
    public ResponseEntity<?> getByIdContactForm(@PathVariable long cId) {
        Optional<ContactFormDTO> contactFormDTOOpt = contactFormService.getContactFormById(cId);

        if (contactFormDTOOpt.isPresent()) {
            return ResponseEntity.ok(contactFormDTOOpt.get());  // Return 200 OK with the specific party details
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Contact Form  not found for ID: " + cId);  // Return 404 if not found
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllContactForm(){

        try {
            List<ContactFormDTO> allContactDTO = contactFormService.getAllContactForm();
            return new ResponseEntity<>(allContactDTO, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>("Error fetching all conatact forms: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PatchMapping("/update/{cId}")
    public ResponseEntity<?> updateContactForm(
            @PathVariable long cId,
            @RequestParam(required = false) String contactPerson,
            @RequestParam(required = false) String contactNumber,
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) String emailId,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String gstIn) {

        try {
            ContactForm updatedContact = contactFormService.updateContactForm(cId, contactPerson, contactNumber, companyName, emailId, address, gstIn);
            return new ResponseEntity<>(updatedContact, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>("Error updating contact: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}
