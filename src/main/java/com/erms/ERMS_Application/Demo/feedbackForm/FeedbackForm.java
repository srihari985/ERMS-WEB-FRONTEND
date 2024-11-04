package com.erms.ERMS_Application.Demo.feedbackForm;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import jakarta.persistence.*;

@Entity
@Table(name = "feedback_form")
public class FeedbackForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long fbId;

    private String requirements;

    private String feedback;

    @ManyToOne(fetch = FetchType.LAZY)
    private Sales sales;

    // Default constructor
    public FeedbackForm() {}

    // Constructor for all fields
    public FeedbackForm(long fbId, String requirements, String feedback, Sales sales) {
        this.fbId = fbId;
        this.requirements = requirements;
        this.feedback = feedback;
        this.sales = sales;
    }

    // Getters and Setters
    public long getFbId() {
        return fbId;
    }

    public void setFbId(long fbId) {
        this.fbId = fbId;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Sales getSales() {
        return sales;
    }

    public void setSales(Sales sales) {
        this.sales = sales;
    }
}
