package com.erms.ERMS_Application.Demo.feedbackForm;

public class FeedbackFormDTO {

    private long fbId;
    private String requirements;
    private String feedback;
    private long salesId;  // Assuming you want to expose the Sales ID

    // Default constructor
    public FeedbackFormDTO() {}

    // Constructor with all fields
    public FeedbackFormDTO(long fbId, String requirements, String feedback, long salesId) {
        this.fbId = fbId;
        this.requirements = requirements;
        this.feedback = feedback;
        this.salesId = salesId;
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

    public long getSalesId() {
        return salesId;
    }

    public void setSalesId(long salesId) {
        this.salesId = salesId;
    }
}
