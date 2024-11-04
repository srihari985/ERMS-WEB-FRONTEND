package com.erms.ERMS_Application.Demo.contactForm;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import com.erms.ERMS_Application.Authentication.sales.SalesRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContactFormService {

    @Autowired
    private ContactFormRepository contactFormRepository;

    @Autowired
    private SalesRepository salesRepository;


    public ContactForm createContact(long salesId, String contactPerson, String contactNumber, String companyName, String emailId, String address, String gstIn) {

        Sales sale = salesRepository.findById(salesId)
                .orElseThrow(() -> new EntityNotFoundException("Sales not found with id: " + salesId));

        // Create new ContactFrom and set the details
        ContactForm contactForm = new ContactForm();
        contactForm.setContactPerson(contactPerson);
        contactForm.setContactNumber(contactNumber);
        contactForm.setCompanyName(companyName);
        contactForm.setEmailId(emailId);
        contactForm.setAddress(address);
        contactForm.setGstIn(gstIn);
        contactForm.setSales(sale);

        return contactFormRepository.save(contactForm);
    }

    public Optional<ContactFormDTO> getContactFormById(long cId) {
        Optional<ContactForm> contactFormEntityOpt = contactFormRepository.findById(cId);

        if (contactFormEntityOpt.isPresent()) {
            ContactForm contactForm = contactFormEntityOpt.get();
            ContactFormDTO contactFormDTO = new ContactFormDTO(
                    contactForm.getcId(),
                    contactForm.getContactPerson(),
                    contactForm.getContactNumber(),
                    contactForm.getCompanyName(),
                    contactForm.getEmailId(),
                    contactForm.getAddress(),
                    contactForm.getGstIn(),
                    contactForm.getSales() != null ? contactForm.getSales().getId() : 0L  // Get the sales ID
            );
            return Optional.of(contactFormDTO);  // Return the DTO wrapped in Optional
        }
        return Optional.empty();  // Return empty Optional if not found
    }

    public List<ContactFormDTO> getAllContactForm() {
        List<ContactForm> addAll = contactFormRepository.findAll();

        return addAll.stream().map(conatctFrom -> new ContactFormDTO(
                conatctFrom.getcId(),
                conatctFrom.getContactPerson(),
                conatctFrom.getContactNumber(),
                conatctFrom.getCompanyName(),
                conatctFrom.getEmailId(),
                conatctFrom.getAddress(),
                conatctFrom.getGstIn(),
                conatctFrom.getSales() != null ? conatctFrom.getSales().getId() : 0L  // Get the sales ID
        )).collect(Collectors.toList());
    }



    public ContactForm updateContactForm(
            long cId,
            String contactPerson,
            String contactNumber,
            String companyName,
            String emailId,
            String address,
            String gstIn) {

        ContactForm contactForm = contactFormRepository.findById(cId)
                .orElseThrow(() -> new EntityNotFoundException("ContactForm not found with id: " + cId));

        Optional.ofNullable(contactPerson).ifPresent(contactForm::setContactPerson);
        Optional.ofNullable(contactNumber).ifPresent(contactForm::setContactNumber);
        Optional.ofNullable(companyName).ifPresent(contactForm::setCompanyName);
        Optional.ofNullable(emailId).ifPresent(contactForm::setEmailId);
        Optional.ofNullable(address).ifPresent(contactForm::setAddress);
        Optional.ofNullable(gstIn).ifPresent(contactForm::setGstIn);

        return contactFormRepository.save(contactForm);
    }



}
