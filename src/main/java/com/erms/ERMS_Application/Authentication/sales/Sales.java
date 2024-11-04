package com.erms.ERMS_Application.Authentication.sales;


import java.util.List;

import com.erms.ERMS_Application.Authentication.saleManager.SaleManager;
import com.erms.ERMS_Application.Authentication.user.Role;
import com.erms.ERMS_Application.DailyReport.DailyReportEntity;
import com.erms.ERMS_Application.Demo.contactForm.ContactForm;
import com.erms.ERMS_Application.Demo.feedbackForm.FeedbackForm;
import com.erms.ERMS_Application.FoodAllowance.FoodAllowanceEntity;
import com.erms.ERMS_Application.PertrolAllowance.PetrolAllowanceEntity;
import com.erms.ERMS_Application.Quotation.AddParty.AddPartyEntity;
import com.erms.ERMS_Application.TravelAllowance.TravelAllowanceEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "sales")
public class Sales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;  // SALES, other roles if applicable

    @Column(nullable = false, unique = true)
    private String salesId;  // e.g., SALES-001

    @ManyToOne(fetch = FetchType.LAZY)  // Lazy fetch to improve performance
    @JoinColumn(name = "salesManager_id", nullable = false)  // Foreign key constraint
    private SaleManager saleManager;
    
    @OneToMany(mappedBy = "sales")
    private List<AddPartyEntity> addParty;

    @OneToMany(mappedBy = "sales")
    private List<ContactForm> contactForms;

    @OneToMany(mappedBy = "sales")
    private List<FeedbackForm> feedbackForms;

    @OneToMany(mappedBy = "sales")
    private List<PetrolAllowanceEntity> petrolAllowanceEntities;

    @OneToMany(mappedBy = "sales")
    private List<DailyReportEntity> dailyReportEntities;


    @OneToMany(mappedBy = "sales")
    private List<TravelAllowanceEntity> travelAllowanceEntities ;


    @OneToMany(mappedBy = "sales")
    private List<FoodAllowanceEntity> foodAllowanceEntities ;
   

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getSalesId() {
        return salesId;
    }

    public void setSalesId(String salesId) {
        this.salesId = salesId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public SaleManager getSaleManager() {
        return saleManager;
    }

    public void setSaleManager(SaleManager saleManager) {
        this.saleManager = saleManager;
    }



    public List<AddPartyEntity> getAddParty() {
        return addParty;
    }

    public void setAddParty(List<AddPartyEntity> addParty) {
        this.addParty = addParty;
    }

    public List<ContactForm> getContactForms() {
        return contactForms;
    }



    public void setContactForms(List<ContactForm> contactForms) {
        this.contactForms = contactForms;
    }

    public List<FeedbackForm> getFeedbackForms() {
        return feedbackForms;
    }
    public void setFeedbackForms(List<FeedbackForm> feedbackForms) {
        this.feedbackForms = feedbackForms;
    }

    public List<PetrolAllowanceEntity> getPetrolAllowanceEntities() {
        return petrolAllowanceEntities;
    }

    public void setPetrolAllowanceEntities(List<PetrolAllowanceEntity> petrolAllowanceEntities) {
        this.petrolAllowanceEntities = petrolAllowanceEntities;
    }


    public List<DailyReportEntity> getDailyReportEntities() {
        return dailyReportEntities;
    }

    public void setDailyReportEntities(List<DailyReportEntity> dailyReportEntities) {
        this.dailyReportEntities = dailyReportEntities;
    }

    public List<TravelAllowanceEntity> getTravelAllowanceEntities() {
        return travelAllowanceEntities;
    }

    public void setTravelAllowanceEntities(List<TravelAllowanceEntity> travelAllowanceEntities) {
        this.travelAllowanceEntities = travelAllowanceEntities;
    }

    public List<FoodAllowanceEntity> getFoodAllowanceEntities() {
        return foodAllowanceEntities;
    }

    public void setFoodAllowanceEntities(List<FoodAllowanceEntity> foodAllowanceEntities) {
        this.foodAllowanceEntities = foodAllowanceEntities;
    }

    public Sales() {
		super();
	}

    public Sales(Long id, String firstName, String lastName, String email, String password, Role role, String salesId, SaleManager saleManager, List<AddPartyEntity> addParty, List<ContactForm> contactForms, List<FeedbackForm> feedbackForms, List<PetrolAllowanceEntity> petrolAllowanceEntities, List<DailyReportEntity> dailyReportEntities, List<TravelAllowanceEntity> travelAllowanceEntities, List<FoodAllowanceEntity> foodAllowanceEntities) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.salesId = salesId;
        this.saleManager = saleManager;
        this.addParty = addParty;
        this.contactForms = contactForms;
        this.feedbackForms = feedbackForms;
        this.petrolAllowanceEntities = petrolAllowanceEntities;
        this.dailyReportEntities = dailyReportEntities;
        this.travelAllowanceEntities = travelAllowanceEntities;
        this.foodAllowanceEntities = foodAllowanceEntities;
    }
}
