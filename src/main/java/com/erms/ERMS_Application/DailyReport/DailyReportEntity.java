
package com.erms.ERMS_Application.DailyReport;

import com.erms.ERMS_Application.Authentication.sales.Sales;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "daily_report")
public class DailyReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long drId;

    private String name;

    private LocalDate date;

    private String totalVisits;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String requirements;

    @Column(columnDefinition = "LONGBLOB")
    private String additionalComments;

    @ManyToOne(fetch = FetchType.LAZY)
    private Sales sales;

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

    public Sales getSales() {
        return sales;
    }

    public void setSales(Sales sales) {
        this.sales = sales;
    }

    public DailyReportEntity() {
    }

    public DailyReportEntity(long drId, String name, LocalDate date, String totalVisits, String requirements, String additionalComments, Sales sales) {
        this.drId = drId;
        this.name = name;
        this.date = date;
        this.totalVisits = totalVisits;
        this.requirements = requirements;
        this.additionalComments = additionalComments;
        this.sales = sales;
    }
}

