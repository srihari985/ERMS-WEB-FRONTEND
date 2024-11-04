package com.erms.ERMS_Application.TravelAllowance;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/travelAllowance")
public class TravelAllowanceController {

    @Autowired
    private TravelAllowanceService travelAllowanceService;


    @PostMapping("/save/{sId}")
    public ResponseEntity<String> saveTravelAllowance(
            @PathVariable Long sId,
            @RequestParam String name,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate date,
            @RequestParam String customerName,
            @RequestParam String travelFrom,
            @RequestParam String travelTo,
            @RequestParam String travelType,
            @RequestParam long noOfDays,
            @RequestParam float travelCost) {
        try {
            travelAllowanceService.saveTravelAllowance(
                    sId, name, date,customerName, travelFrom, travelTo, travelType, noOfDays, travelCost);
            return ResponseEntity.status(HttpStatus.CREATED).body("Travel Allowance saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving Travel Allowance: " + e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<TravelAllowanceDTO>> getAllTravelAllowances() {
        List<TravelAllowanceDTO> allowances = travelAllowanceService.getAllTravelAllowances();
        return ResponseEntity.ok(allowances);
    }

    @GetMapping("/getBySaleId/{sId}")
    public ResponseEntity<List<TravelAllowanceDTO>> getTravelAllowancesBySalesId(@PathVariable Long sId) {
        List<TravelAllowanceDTO> allowances = travelAllowanceService.getTravelAllowancesBySalesId(sId);
        if (!allowances.isEmpty()) {
            return ResponseEntity.ok(allowances);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    //update Multiple Travel Reports
    @PatchMapping("/updateMultipleTravelReports/{sId}")
    public ResponseEntity<String> updateMultipleTravelReports(
            @PathVariable Long sId,
            @RequestParam List<Long> tIds,
            @RequestParam Optional<String> name,
            @RequestParam Optional<String> totalVisits,
            @RequestParam Optional<String> requirements,
            @RequestParam Optional<String> additionalComments) {

        boolean isUpdated = travelAllowanceService.updateMultipleTravelReports(sId, tIds, name, totalVisits, requirements, additionalComments);

        if (isUpdated) {
            return ResponseEntity.status(HttpStatus.OK).body(" Travel Allowance updated successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No matching Travel Allowance found for update.");
        }
    }

}