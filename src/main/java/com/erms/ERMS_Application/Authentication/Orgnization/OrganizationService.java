package com.erms.ERMS_Application.Authentication.Orgnization;


import com.erms.ERMS_Application.Authentication.auth.AuthenticationService;
import com.erms.ERMS_Application.Authentication.security.CustomUserDetailsService;
import com.erms.ERMS_Application.Authentication.user.Role;
import com.erms.ERMS_Application.Authentication.userUtil.UserUtilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class OrganizationService {

    @Autowired
    private  AuthenticationService authenticationService;
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private  OrganizationRepository organizationRepository;
    @Autowired
    private  AuthenticationManager authenticationManager;
    @Autowired
    private  CustomUserDetailsService customUserDetailsService;
    @Autowired
    private UserUtilService userUtilService;

    public Organization registerOrganization(String name, String email, String address, Role role) {
        // Check if the organization already exists by email
        if (organizationRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Organization with this email already exists.");
        }

        Organization organization = new Organization();
        organization.setName(name);
        organization.setEmail(email);

        String newRandomGenPassword = userUtilService.generateRandomPassword();
        String encodedPassword = passwordEncoder.encode(newRandomGenPassword);

        organization.setPassword(encodedPassword);
        organization.setRole(role);
        organization.setOrganizationId(userUtilService.generateUserRoleId(role));
        organization.setAddress(address);

        // Send the email with the generated password
        try {
            userUtilService.sendEmail(email, newRandomGenPassword);
            System.out.println(email);
        } catch (Exception e) {
            // Log the error and throw a custom exception if email sending fails
            throw new IllegalStateException("Unable to send email at this time. Please try again later.", e);
        }

        // Save the organization to the database
        return organizationRepository.save(organization);


    }



    // Method to authenticate without JWT token
    public OrganizationResponse authenticate(String email, String password, Role role) {
        // Validate input parameters
        if (email == null || password == null || role == null) {
            throw new IllegalArgumentException("Email, password, and role must not be null");
        }

        // Check if the organization exists by email
        Optional<Organization> organizationOpt = organizationRepository.findByEmail(email);
        if (organizationOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        Organization organization = organizationOpt.get();

        // Verify if the provided password matches the stored password
        if (!passwordEncoder.matches(password, organization.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Check if the role matches
        if (!organization.getRole().equals(role)) {
            throw new IllegalArgumentException("Invalid role");
        }

        // Authentication successful, return organization details
        return new OrganizationResponse(
                organization.getEmail(),
                organization.getRole(),
                organization.getName(),
                organization.getAddress(),
                organization.getOrganizationId()
        );
    }





}