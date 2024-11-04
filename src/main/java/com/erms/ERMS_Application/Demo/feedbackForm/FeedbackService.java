package com.erms.ERMS_Application.Demo.feedbackForm;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import com.erms.ERMS_Application.Authentication.sales.SalesRepository;
import com.erms.ERMS_Application.Demo.contactForm.ContactForm;
import com.erms.ERMS_Application.Demo.contactForm.ContactFormDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    public FeedbackForm createFeedback(long salesId,@RequestBody FeedbackForm feedback) {
        Sales sale = salesRepository.findById(salesId)
                .orElseThrow(() -> new EntityNotFoundException("Sales not found with id: " + salesId));

        // Create a new FeedbackForm and set the details
        FeedbackForm feedbackForm = new FeedbackForm();
        feedbackForm.setRequirements(feedback.getRequirements());
        feedbackForm.setFeedback(feedback.getFeedback());
        feedbackForm.setSales(sale);

        return feedbackRepository.save(feedbackForm);
    }

    public Optional<FeedbackFormDTO> getFeedbackById(long fbId) {
        Optional<FeedbackForm> feedbackOpt = feedbackRepository.findById(fbId);

        if (feedbackOpt.isPresent()) {
            FeedbackForm feedbackForm = feedbackOpt.get();
            FeedbackFormDTO feedbackFormDTO = new FeedbackFormDTO(
                    feedbackForm.getFbId(),
                    feedbackForm.getRequirements(),
                    feedbackForm.getFeedback(),
                    feedbackForm.getSales() != null ? feedbackForm.getSales().getId() : 0L  // Get the sales ID
            );
            return Optional.of(feedbackFormDTO);  // Return the DTO wrapped in Optional
        }
        return Optional.empty();  // Return empty Optional if not found
    }


    public List<FeedbackFormDTO> getAllFeedbackForm() {
        List<FeedbackForm> feedbackForms = feedbackRepository.findAll();

        return feedbackForms.stream().map(feedbackForm -> new FeedbackFormDTO(
                feedbackForm.getFbId(),
                feedbackForm.getRequirements(),
                feedbackForm.getFeedback(),
                feedbackForm.getSales() != null ? feedbackForm.getSales().getId() : 0L  // Get the sales ID
        )).collect(Collectors.toList());
    }

    public FeedbackForm updateFeedbackForm(
            long fbId,
            String requirements,
            String feedback) {

        FeedbackForm feedbackForm = feedbackRepository.findById(fbId)
                .orElseThrow(() -> new EntityNotFoundException("FeedbackForm not found with id: " + fbId));

        Optional.ofNullable(requirements).ifPresent(feedbackForm::setRequirements);
        Optional.ofNullable(feedback).ifPresent(feedbackForm::setFeedback);

        return feedbackRepository.save(feedbackForm);
    }


}
