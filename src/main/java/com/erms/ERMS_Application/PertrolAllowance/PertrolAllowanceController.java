package com.erms.ERMS_Application.PertrolAllowance;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/perolAllowance")
public class PertrolAllowanceController {

    @Autowired
    private PertrolAllowanceService pertrolAllowanceService;

    @PostMapping("/save/{salesId}")
    public ResponseEntity<String> savePetrolAllowance(
            @PathVariable Long salesId,
            @RequestParam String startTime,
            @RequestParam String startReading,
            @RequestParam String endTime,
            @RequestParam String endReading,
            @RequestParam float totalKm,
            @RequestParam float petrolChargePerKm,
            @RequestParam String additionalComments,
            @RequestParam(required = false) MultipartFile choosePetrolInvoiceBill) { // Removed date parameter
        try {
            // Generate the current date
            LocalDate date = LocalDate.now(); // Auto-generate the current date

            pertrolAllowanceService.savePetrolAllowance(
                    salesId, startTime, startReading, endTime, endReading,
                    totalKm, petrolChargePerKm, additionalComments,
                    choosePetrolInvoiceBill, date); // Pass the generated date to the service
            return ResponseEntity.status(HttpStatus.CREATED).body("Petrol Allowance saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving Petrol Allowance: " + e.getMessage());
        }
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<TripDetailsDTO>> getAllTripDetails() {
        List<TripDetailsDTO> tripDetailsList = pertrolAllowanceService.getAllTripDetails();
        return ResponseEntity.ok(tripDetailsList);
    }


    @GetMapping("/getBySalesId/{sId}")
    public ResponseEntity<List<TripDetailsDTO>> getTripDetailsBySalesId(@PathVariable Long sId) {
        List<TripDetailsDTO> tripDetailsList = pertrolAllowanceService.getTripDetailsBySalesId(sId);

        if (!tripDetailsList.isEmpty()) {
            return ResponseEntity.ok(tripDetailsList);  // Return 200 OK with the list of DTOs
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Return 404 if no records found
        }
    }

    @PatchMapping("/update/{sId}")
    public ResponseEntity<String> updatePetrolAllowance(
            @PathVariable Long sId,
            @RequestParam List<Long> pIds,  // List of pId
            @RequestParam Optional<String> startTime,
            @RequestParam Optional<String> startReading,
            @RequestParam Optional<String> endTime,
            @RequestParam Optional<String> endReading,
            @RequestParam Optional<Float> totalKm,
            @RequestParam Optional<Float> petrolChargePerKm,
            @RequestParam Optional<String> additionalComments,
            @RequestParam Optional<MultipartFile> choosePetrolInvoiceBill) {
        try {
            boolean isUpdated = pertrolAllowanceService.updateMultiplePetrolAllowances(
                    sId, pIds, startTime, startReading, endTime, endReading, totalKm,
                    petrolChargePerKm, additionalComments, choosePetrolInvoiceBill);

            if (isUpdated) {
                return ResponseEntity.ok("Petrol Allowances updated successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Petrol Allowances not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating Petrol Allowances: " + e.getMessage());
        }
    }




}
