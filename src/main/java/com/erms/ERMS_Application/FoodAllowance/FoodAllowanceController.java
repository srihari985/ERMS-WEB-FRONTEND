package com.erms.ERMS_Application.FoodAllowance;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/foodAllowance")
public class FoodAllowanceController {


    @Autowired
    private FoodAllowanceService foodAllowanceService;

    @PostMapping("/save/{sId}")
    public ResponseEntity<String> saveFoodAllowance(
            @PathVariable Long sId,
            @RequestParam String name,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate date,
            @RequestParam String customerName,
            @RequestParam String noOfPersons,
            @RequestParam float foodCost) {
        try {
            foodAllowanceService.saveFoodAllowance(sId,name, date, customerName, noOfPersons, foodCost);
            return ResponseEntity.status(HttpStatus.CREATED).body("Food Allowance saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving Food Allowance: " + e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<FoodAllowanceDTO>> getAllFoodAllowances() {
        List<FoodAllowanceDTO> allowances = foodAllowanceService.getAllFoodAllowances();
        return ResponseEntity.ok(allowances);
    }

    @GetMapping("/getBySalesId/{sId}")
    public ResponseEntity<List<FoodAllowanceDTO>> getFoodAllowancesBySalesId(@PathVariable Long sId) {
        List<FoodAllowanceDTO> allowances = foodAllowanceService.getFoodAllowancesBySalesId(sId);
        if (!allowances.isEmpty()) {
            return ResponseEntity.ok(allowances);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }



}
