package com.erms.ERMS_Application.DailyReport;

import java.time.LocalDate;

public class DailyReportDTO {

    private long drId;
    private String name;
    private LocalDate date;
    private String totalVisits;
    private String requirements;
    private String additionalComments;
    private String salesId;

    public long getDrId() {
        return drId;
    }

    public void setDrId(long drId) {
        this.drId = drId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTotalVisits() {
        return totalVisits;
    }

    public void setTotalVisits(String totalVisits) {
        this.totalVisits = totalVisits;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getAdditionalComments() {
        return additionalComments;
    }

    public void setAdditionalComments(String additionalComments) {
        this.additionalComments = additionalComments;
    }

    public String getSalesId() {
        return salesId;
    }

    public void setSalesId(String salesId) {
        this.salesId = salesId;
    }
}
