package com.erms.ERMS_Application.DailyReport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dailyReport")
public class DailyReportController {

    @Autowired
    private DailyReportService dailyReportService;

    @PostMapping("/save/{sId}")
    public ResponseEntity<String> saveDailyReport(
            @PathVariable Long sId,
            @RequestParam String name,
            @RequestParam String totalVisits,
            @RequestParam String requirements,
            @RequestParam String additionalComments) {
        try {
            // Auto-generate the current date
            LocalDate date = LocalDate.now();

            dailyReportService.saveDailyReport(
                    sId, name, totalVisits, requirements, additionalComments, date);

            return ResponseEntity.status(HttpStatus.CREATED).body("Daily Report saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving Daily Report: " + e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<DailyReportDTO>> getAllDailyReports() {
        List<DailyReportDTO> reportList = dailyReportService.getAllDailyReports();
        return ResponseEntity.ok(reportList);
    }

    @GetMapping("/getBySaleId/{sId}")
    public ResponseEntity<List<DailyReportDTO>> getDailyReportsBySalesId(@PathVariable Long sId) {
        List<DailyReportDTO> reportList = dailyReportService.getDailyReportsBySalesId(sId);

        if (!reportList.isEmpty()) {
            return ResponseEntity.ok(reportList);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PatchMapping("/update/{sId}")
    public ResponseEntity<String> updateDailyReports(
            @PathVariable Long sId,
            @RequestParam List<Long> drIds,  // List of drId values
            @RequestParam Optional<String> name,
            @RequestParam Optional<String> totalVisits,
            @RequestParam Optional<String> requirements,
            @RequestParam Optional<String> additionalComments) {
        try {
            // Update the fields if they are present in the request for all reports in the list of drIds
            boolean isUpdated = dailyReportService.updateMultipleDailyReports(
                    sId, drIds, name, totalVisits, requirements, additionalComments);

            if (isUpdated) {
                return ResponseEntity.ok("Daily Reports updated successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Daily Reports not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating Daily Reports: " + e.getMessage());
        }
    }



}
