package com.erms.ERMS_Application.Authentication.telecaller;

import com.erms.ERMS_Application.Authentication.auth.AuthenticationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/telecaller")
@Tag(name = "Telecaller")
public class TelecallerController {

    private final AuthenticationService authenticationService;

    public TelecallerController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }


//    @PostMapping("/register/technician/{saleManagerId}")
//    public ResponseEntity<AuthenticationResponse> registerTechnician(
//            @PathVariable String saleManagerId,
//            @RequestBody RegisterRequest request) {
//        try {
//            // Call the service to handle technician registration
//            AuthenticationResponse response = authenticationService.registerTechnician(request, saleManagerId);
//            return ResponseEntity.ok(response);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(new AuthenticationResponse(e.getMessage()));
//        }
//    }

}
