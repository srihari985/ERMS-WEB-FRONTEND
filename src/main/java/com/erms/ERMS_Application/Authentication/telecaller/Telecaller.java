package com.erms.ERMS_Application.Authentication.telecaller;



import com.erms.ERMS_Application.Authentication.saleManager.SaleManager;
import com.erms.ERMS_Application.Authentication.user.Role;
import jakarta.persistence.*;

@Entity
@Table(name = "telecaller")
public class Telecaller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstname;
    private String lastname;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;  // TELECALLER, other roles if applicable

    @Column(nullable = false, unique = true)
    private String telecallerId;  // e.g., TECH-001

    @ManyToOne(fetch = FetchType.LAZY)  // Lazy fetch to improve performance
    @JoinColumn(name = "salesManager_id", nullable = false)  // Foreign key constraint
    private SaleManager saleManager;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTelecallerId() {
        return telecallerId;
    }

    public void setTelecallerId(String telecallerId) {
        this.telecallerId = telecallerId;
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
}
